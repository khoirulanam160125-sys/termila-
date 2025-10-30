export type HistoryLine = {
  type: 'command' | 'output' | 'error';
  text: string;
  prompt?: string;
};

// Fix: Exported the Package type to resolve import errors in App.tsx and services/geminiService.ts.
export type Package = {
  name: string;
  version: string;
};
