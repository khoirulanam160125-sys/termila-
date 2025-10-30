import { GoogleGenAI } from "@google/genai";
// Fix: Corrected the import path to point to the parent directory.
import { HELP_TEXT } from '../constants.ts';
import type { Package } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// This function is now an async generator to support streaming
export async function* getCommandOutputStream(
  command: string,
  installedPackages: Package[],
  currentWorkingDirectory: string,
  currentPrompt: string
): AsyncGenerator<string> {
  if (!command.trim()) {
    yield "";
    return;
  }
  
  // Local command handling for instant feedback
  const commandParts = command.trim().toLowerCase().split(' ');
  const mainCommand = commandParts[0];

  if (mainCommand === 'help') {
    yield HELP_TEXT;
    return;
  }
  
  const packageList = installedPackages.map(p => `${p.name} (${p.version})`).join(', ');

  const systemInstruction = `
You are a Kali Linux terminal simulator. Your responses must be extremely realistic, mimicking the exact output of actual commands.
You are running as the 'root' user. The current working directory is '${currentWorkingDirectory}'.
The current simulated installed packages are: ${packageList}.
The current prompt is '${currentPrompt}'.

SPECIAL DIRECTIVES:
- To change the Current Working Directory (for 'cd'), end your response with: <|CWD_CHANGE|/path/to/new/dir|>
- To change the prompt (for 'msfconsole', 'ssh', etc.), end your response with: <|PROMPT_CHANGE|new_prompt>
- To return to the default prompt (for 'exit' in a subshell), end with: <|PROMPT_CHANGE|DEFAULT|>
- To simulate installing a package, end your response with: <|PKG_INSTALL|package_name@version|>
- To simulate removing a package, end your response with: <|PKG_REMOVE|package_name|>

COMMAND BEHAVIOR:
- If the user runs 'msfconsole': Display the realistic msfconsole startup banner, then emit the prompt change directive to 'msf6 > '.
- If the current prompt is 'msf6 > ' and the user types 'exit': Emit the prompt change directive to 'DEFAULT'.
- If the user runs 'git clone <url>': Simulate a git clone process with progress bars and completion messages.
- If the user runs 'python <script.py>' or './<script.sh>': Invent a plausible output for a pentesting or utility script with that name.
- For 'apt install <pkg>': If the package is valid, simulate installation and emit the PKG_INSTALL directive with a realistic version. If already installed, state that.
- For 'apt remove <pkg>': If the package is installed, simulate removal and emit the PKG_REMOVE directive. If not installed, state that.
- For 'apt list --installed': Format the package list provided above into a realistic 'apt' list format.
- For 'cd <path>': Resolve the new path based on the CWD. Handle '..', '.', '~', and absolute/relative paths. Emit the CWD_CHANGE directive with the new, resolved, absolute path.
- For 'nano <file>': Display a realistic nano editor interface, filling the screen with the nano UI, header, and footer shortcuts.
- For 'ssh <user@host>': Simulate an SSH connection, including a host key prompt and a welcome banner from the target machine, then change the prompt.
- For 'ping <host>': Generate a continuous, realistic ping output with sequence numbers and latency.
- For commands like nmap, sqlmap, gobuster: Generate detailed, multi-line, realistic output as if the tool were actually running.
- If a command is nonsensical or not on the list, respond with 'bash: <command>: command not found'.
- Handle 'sudo' prefix by ignoring it, as the user is already root.
`;

  try {
    const response = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: command,
      config: {
        systemInstruction,
      }
    });

    for await (const chunk of response) {
      yield chunk.text;
    }

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        yield `Error: ${error.message}`;
    } else {
        yield "An unexpected error occurred while processing your command.";
    }
  }
}