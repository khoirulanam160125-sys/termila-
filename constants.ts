export const KALI_WELCOME_MESSAGE = `
Linux kali 6.6.9-1kali1 (2024-01-08) x86_64
 ____  _   _ ____  _     
| __ )| | | |  _ \\| |    
|  _ \\| | | | |_) | |    
| |_) | |_| |  __/| |___ 
|____/ \\___/|_|   |_____|
                         

Last login: Mon Jan 15 10:30:12 2024 from 192.168.1.10
`;

export const HELP_TEXT = `
Kali Linux Terminal Simulator - Help

[Core Commands]
  help          Display this help message.
  clear         Clear the terminal screen.
  whoami        Display the current user (root).
  pwd           Print the current working directory.
  
[System & File Management]
  ls [path]     List directory contents.
  cd <dir>      Change the current directory.
  mkdir <dir>   Create a new directory.
  nano <file>   Simulate opening the nano text editor.

[Package Management]
  apt update                  Update package lists.
  apt upgrade                 Upgrade all installed packages.
  apt install <pkg>           Install a package.
  apt remove <pkg>            Remove a package.
  apt list --installed        List installed packages.

[Networking]
  ping <host>                 Send ICMP ECHO_REQUEST to a host.
  ssh <user@host>             Simulate an SSH connection to a host.

[Pentesting & Tools]
  nmap <opts> <host>          Simulate a network scan with nmap.
  sqlmap -u <url>             Simulate SQL injection testing.
  gobuster dir -u <url> -w <wordlist>  Simulate directory bruteforcing.
  msfconsole                  Launch the Metasploit Framework console.
  git clone <repo_url>        Simulate cloning a repository.
  python <script.py>          Simulate running a Python script.
`;

export const INITIAL_INSTALLED_PACKAGES = [
    { name: 'nmap', version: '7.94' },
    { name: 'sqlmap', version: '1.8' },
    { name: 'metasploit-framework', version: '6.3.50' },
    { name: 'burpsuite', version: '2023.11.1.3' },
    { name: 'john', version: '1.9.0' },
    { name: 'hashcat', version: '6.2.6' },
    { name: 'hydra', version: '9.5' },
    { name: 'wireshark', version: '4.2.1' },
    { name: 'aircrack-ng', version: '1.7' },
    { name: 'gobuster', version: '3.6' },
    { name: 'git', version: '1:2.43.0-1' },
    { name: 'python3', version: '3.11.7-1' },
];

export const DEFAULT_PROMPT_STRING = `root@kali:`;
