import React, { useState, useCallback } from 'react';
import Terminal from './components/Terminal.tsx';
import type { HistoryLine, Package } from './types';
import { DEFAULT_PROMPT_STRING, INITIAL_INSTALLED_PACKAGES, KALI_WELCOME_MESSAGE } from './constants.ts';
import { getCommandOutputStream } from './services/geminiService.ts';

function App() {
  const [history, setHistory] = useState<HistoryLine[]>([
    { type: 'output', text: KALI_WELCOME_MESSAGE }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [installedPackages, setInstalledPackages] = useState<Package[]>(INITIAL_INSTALLED_PACKAGES);
  const [currentWorkingDirectory, setCurrentWorkingDirectory] = useState('~');
  const [subShellPrompt, setSubShellPrompt] = useState<string | null>(null);

  const constructPrompt = () => {
    if (subShellPrompt) {
      return `${subShellPrompt} `;
    }
    const path = currentWorkingDirectory;
    return `${DEFAULT_PROMPT_STRING}${path}# `;
  };

  const handleCommand = useCallback(async (command: string) => {
    const currentPrompt = constructPrompt();
    const newHistory: HistoryLine[] = [...history, { type: 'command', text: command, prompt: currentPrompt }];
    
    if (command.trim().toLowerCase() === 'clear') {
        setHistory([]);
        return;
    }

    setHistory(newHistory);
    setIsLoading(true);

    // Add a placeholder for the streaming output
    const outputIndex = newHistory.length;
    setHistory(prev => [...prev, { type: 'output', text: '' }]);

    let fullOutput = '';
    try {
      const stream = getCommandOutputStream(command, installedPackages, currentWorkingDirectory, currentPrompt);
      for await (const chunk of stream) {
        fullOutput += chunk;
        setHistory(prev => {
          const updatedHistory = [...prev];
          updatedHistory[outputIndex] = { ...updatedHistory[outputIndex], text: fullOutput };
          return updatedHistory;
        });
      }
    } catch (error) {
       const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
       setHistory(prev => {
          const updatedHistory = [...prev];
          updatedHistory[outputIndex] = { type: 'error', text: errorMessage };
          return updatedHistory;
        });
    } finally {
        // Directive parsing after stream is complete
        const directiveRegex = /<\|(\w+)\|(.+?)\|>/;
        const match = fullOutput.match(directiveRegex);
        if (match) {
            const [fullMatch, directive, value] = match;
            const cleanOutput = fullOutput.replace(fullMatch, '').trim();

            // Update history with cleaned output
            setHistory(prev => {
                const updatedHistory = [...prev];
                updatedHistory[outputIndex] = { ...updatedHistory[outputIndex], text: cleanOutput };
                return updatedHistory;
            });

            // Update state based on directive
            switch (directive) {
                case 'CWD_CHANGE':
                    setCurrentWorkingDirectory(value);
                    break;
                case 'PROMPT_CHANGE':
                    if (value === 'DEFAULT') {
                        setSubShellPrompt(null);
                        // If we exited ssh, we should go back to home dir
                        if (currentPrompt.includes('@')) setCurrentWorkingDirectory('~');
                    } else {
                        setSubShellPrompt(value);
                    }
                    break;
                case 'PKG_INSTALL':
                    const [pkgName, pkgVersion] = value.split('@');
                    if (!installedPackages.some(p => p.name === pkgName)) {
                        setInstalledPackages(prev => [...prev, { name: pkgName, version: pkgVersion }]);
                    }
                    break;
                case 'PKG_REMOVE':
                     setInstalledPackages(prev => prev.filter(p => p.name !== value));
                    break;
            }
        }
        setIsLoading(false);
    }
  }, [history, installedPackages, currentWorkingDirectory, subShellPrompt]);

  return (
    <div className="bg-black text-white font-mono text-sm">
      <Terminal
        history={history}
        onCommand={handleCommand}
        isLoading={isLoading}
        prompt={constructPrompt()}
      />
    </div>
  );
}

export default App;
