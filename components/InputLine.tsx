import React, { useState, KeyboardEvent } from 'react';

// A shared component to render the complex prompt
const Prompt: React.FC<{ text: string }> = ({ text }) => {
    const kaliRegex = /^(root@kali:)(.*)(#\s)$/;
    const match = text.match(kaliRegex);

    if (match) {
        return (
            <span className="mr-2">
                <span className="text-red-400">{match[1]}</span>
                <span className="text-blue-400">{match[2]}</span>
                <span className="text-red-400">{match[3]}</span>
            </span>
        );
    }
    // Fallback for simple prompts like 'msf6 > ' or the default
    return <span className="text-green-400 mr-2">{text}</span>;
};

interface InputLineProps {
  onCommand: (command: string) => void;
  isLoading: boolean;
  prompt: string;
}

const InputLine: React.FC<InputLineProps> = ({ onCommand, isLoading, prompt }) => {
  const [command, setCommand] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!isLoading) {
        onCommand(command);
        setCommand('');
      }
    }
  };

  return (
    <div className="flex items-center mt-2">
      {!isLoading && <Prompt text={prompt} />}
      <input
        id="terminal-input"
        type="text"
        className="bg-transparent border-none text-white focus:outline-none w-full"
        value={command}
        onChange={(e) => setCommand(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
        autoFocus
        placeholder={isLoading ? 'Thinking...' : ''}
      />
    </div>
  );
};

export default InputLine;
