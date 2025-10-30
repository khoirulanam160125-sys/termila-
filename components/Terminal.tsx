import React, { useRef, useEffect } from 'react';
import type { HistoryLine } from '../types';
import History from './History.tsx';
import InputLine from './InputLine.tsx';

interface TerminalProps {
  history: HistoryLine[];
  onCommand: (command: string) => void;
  isLoading: boolean;
  prompt: string;
}

const Terminal: React.FC<TerminalProps> = ({ history, onCommand, isLoading, prompt }) => {
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history, isLoading]);

  const focusInput = () => {
    const inputElement = document.getElementById('terminal-input');
    if (inputElement) {
        inputElement.focus();
    }
  };

  return (
    <div
      ref={terminalRef}
      className="w-full h-screen p-4 overflow-y-auto"
      onClick={focusInput}
    >
      <History history={history} />
      <InputLine onCommand={onCommand} isLoading={isLoading} prompt={prompt} />
    </div>
  );
};

export default Terminal;
