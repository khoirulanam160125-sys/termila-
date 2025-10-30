import React from 'react';
import type { HistoryLine } from '../types';

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


interface HistoryProps {
  history: HistoryLine[];
}

const History: React.FC<HistoryProps> = ({ history }) => {
  return (
    <div>
      {history.map((line, index) => {
        switch (line.type) {
          case 'command':
            return (
              <div key={index} className="flex">
                {line.prompt && <Prompt text={line.prompt} />}
                <span className="flex-1">{line.text}</span>
              </div>
            );
          case 'output':
            return <div key={index} className="whitespace-pre-wrap my-1">{line.text}</div>;
          case 'error':
            return <div key={index} className="text-red-500 whitespace-pre-wrap my-1">{line.text}</div>;
          default:
            return null;
        }
      })}
    </div>
  );
};

export default History;
