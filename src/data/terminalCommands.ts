// src/data/terminalCommands.ts
// Simulated terminal - educational Linux-like commands
// This is a SIMULATOR only, does NOT execute real system commands.

export interface CommandResult {
  output: string[];
  isError?: boolean;
}

// ── Command registry ───────────────────────────────────────────────────────
type CommandHandler = (args: string[]) => CommandResult;

const commands: Record<string, CommandHandler> = {
  help: () => ({
    output: [
      '╔══════════════════════════════╗',
      '║   X-Toolkit Terminal v1.0    ║',
      '╚══════════════════════════════╝',
      '',
      'Available commands:',
      '  help          Show this help',
      '  ls            List directory',
      '  pwd           Print working directory',
      '  whoami        Current user info',
      '  ifconfig      Network interfaces',
      '  ping <host>   Ping a host (simulated)',
      '  nmap <host>   Port scan info (simulated)',
      '  whois <domain> WHOIS info (simulated)',
      '  clear         Clear terminal',
      '  echo <text>   Print text',
      '  date          Show current date/time',
      '  uname         System information',
      '  ps            Running processes (simulated)',
      '  cat <file>    Show file contents',
      '  history       Command history',
      '  about         About X-Toolkit',
      '',
      '⚠️  This is an educational simulator.',
      '   Commands do not execute real system operations.',
    ],
  }),

  ls: () => ({
    output: [
      'total 48',
      'drwxr-xr-x  2 xora xora 4096 Jan  1 00:00 Documents',
      'drwxr-xr-x  2 xora xora 4096 Jan  1 00:00 Downloads',
      'drwxr-xr-x  5 xora xora 4096 Jan  1 00:00 Projects',
      '-rw-r--r--  1 xora xora  256 Jan  1 00:00 README.md',
      '-rwxr-xr-x  1 xora xora 8192 Jan  1 00:00 x-toolkit',
    ],
  }),

  pwd: () => ({
    output: ['/home/xora'],
  }),

  whoami: () => ({
    output: [
      'User   : xora',
      'UID    : 1000',
      'Groups : xora, sudo, netdev',
      'Shell  : /bin/zsh',
      'Home   : /home/xora',
    ],
  }),

  ifconfig: () => ({
    output: [
      'eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500',
      '      inet 192.168.1.105  netmask 255.255.255.0  broadcast 192.168.1.255',
      '      inet6 fe80::1  prefixlen 64  scopeid 0x20<link>',
      '      ether 00:1A:2B:3C:4D:5E  txqueuelen 1000',
      '',
      'lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536',
      '    inet 127.0.0.1  netmask 255.0.0.0',
      '    inet6 ::1  prefixlen 128  scopeid 0x10<host>',
    ],
  }),

  ping: (args) => {
    const host = args[0] ?? 'localhost';
    const latencies = [12, 15, 11, 14, 13];
    return {
      output: [
        `PING ${host} (93.184.216.34): 56 data bytes`,
        ...latencies.map(
          (ms, i) =>
            `64 bytes from 93.184.216.34: icmp_seq=${i + 1} ttl=56 time=${ms} ms`
        ),
        '',
        `--- ${host} ping statistics ---`,
        `5 packets transmitted, 5 received, 0% packet loss`,
        `rtt min/avg/max = 11/13/15 ms`,
        '',
        '⚡ Simulated output — real ping requires native access.',
      ],
    };
  },

  nmap: (args) => {
    const host = args[0] ?? 'localhost';
    return {
      output: [
        `Starting Nmap 7.94 ( https://nmap.org )`,
        `Nmap scan report for ${host}`,
        `Host is up (0.015s latency).`,
        '',
        'PORT      STATE  SERVICE',
        '22/tcp    open   ssh',
        '80/tcp    open   http',
        '443/tcp   open   https',
        '3306/tcp  closed mysql',
        '8080/tcp  closed http-proxy',
        '',
        'Nmap done: 1 IP address (1 host up) scanned in 2.31 seconds',
        '',
        '⚡ Simulated output — real nmap requires root + native tools.',
      ],
    };
  },

  whois: (args) => {
    const domain = args[0] ?? 'example.com';
    return {
      output: [
        `Domain: ${domain}`,
        `Registrar: Example Registrar, Inc.`,
        `Creation Date: 2010-01-01T00:00:00Z`,
        `Updated Date:  2023-06-15T12:00:00Z`,
        `Expiry Date:   2025-01-01T00:00:00Z`,
        `Status: clientTransferProhibited`,
        `Name Servers: ns1.example.com`,
        `              ns2.example.com`,
        '',
        '⚡ Simulated output.',
      ],
    };
  },

  uname: () => ({
    output: [
      'Linux xtoolkit 5.15.0-generic #1 SMP Mon Jan  1 00:00:00 UTC 2024 aarch64 GNU/Linux',
    ],
  }),

  ps: () => ({
    output: [
      'PID   PPID  CMD',
      '1     0     /sbin/init',
      '2     1     kthreadd',
      '100   1     /usr/bin/zsh',
      '204   100   x-toolkit',
      '301   1     sshd',
      '400   1     nginx',
    ],
  }),

  date: () => ({
    output: [new Date().toString()],
  }),

  echo: (args) => ({
    output: [args.join(' ')],
  }),

  clear: () => ({ output: ['__CLEAR__'] }),

  about: () => ({
    output: [
      '╔══════════════════════════════════╗',
      '║        X-Toolkit v1.0.0          ║',
      '║  Ethical Cybersecurity Toolkit   ║',
      '╚══════════════════════════════════╝',
      '',
      'Built with React Native + Expo',
      'Developer: Xora (@xoradev404)',
      'License: MIT',
      '',
      'Features:',
      '  • DNS Checker     • URL Scanner',
      '  • APK Scanner     • Device Scan',
      '  • Terminal Sim    • Code Editor',
      '  • Command Library • Learning Hub',
    ],
  }),

  history: () => ({
    output: [
      '1  help',
      '2  ls',
      '3  ifconfig',
      '4  ping google.com',
      '5  nmap 192.168.1.1',
      '6  whoami',
    ],
  }),

  cat: (args) => {
    const file = args[0];
    if (!file) return { output: ['cat: missing file operand'], isError: true };
    if (file === 'README.md') {
      return {
        output: [
          '# X-Toolkit',
          'Ethical cybersecurity toolkit for Android.',
          'Built by Xora.',
        ],
      };
    }
    return { output: [`cat: ${file}: No such file or directory`], isError: true };
  },
};

// ── Command executor ───────────────────────────────────────────────────────
export function executeCommand(input: string): CommandResult {
  const trimmed = input.trim();
  if (!trimmed) return { output: [] };

  const [cmd, ...args] = trimmed.split(/\s+/);
  const handler = commands[cmd.toLowerCase()];

  if (!handler) {
    return {
      output: [`bash: ${cmd}: command not found`, `Type 'help' for available commands.`],
      isError: true,
    };
  }

  return handler(args);
}
