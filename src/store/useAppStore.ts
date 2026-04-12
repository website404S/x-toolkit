// src/store/useAppStore.ts
// Global state management with Zustand

import { create } from 'zustand';

// ── Types ──────────────────────────────────────────────────────────────────
export interface ScanResult {
  id: string;
  type: 'dns' | 'url' | 'apk' | 'device';
  target: string;
  status: 'safe' | 'warning' | 'danger' | 'unknown';
  summary: string;
  timestamp: number;
  details: Record<string, unknown>;
}

export interface InstalledApp {
  packageName: string;
  appName: string;
  isSystemApp: boolean;
  permissions: string[];
  riskLevel: 'low' | 'medium' | 'high';
  installSource: 'play_store' | 'sideloaded' | 'system' | 'unknown';
}

interface AppState {
  // Scan history (persisted in memory, optionally to AsyncStorage)
  scanHistory: ScanResult[];
  addScanResult: (result: ScanResult) => void;
  clearHistory: () => void;

  // Installed apps (populated on device scan)
  installedApps: InstalledApp[];
  setInstalledApps: (apps: InstalledApp[]) => void;

  // Terminal history
  terminalHistory: string[];
  addTerminalLine: (line: string) => void;
  clearTerminal: () => void;

  // Notification badge count
  badgeCount: number;
  incrementBadge: () => void;
  resetBadge: () => void;
}

// ── Store ──────────────────────────────────────────────────────────────────
export const useAppStore = create<AppState>((set) => ({
  scanHistory: [],
  addScanResult: (result) =>
    set((state) => ({
      scanHistory: [result, ...state.scanHistory].slice(0, 100), // keep last 100
    })),
  clearHistory: () => set({ scanHistory: [] }),

  installedApps: [],
  setInstalledApps: (apps) => set({ installedApps: apps }),

  terminalHistory: [
    '> X-Toolkit Terminal v1.0',
    '> Type "help" to see available commands.',
    '',
  ],
  addTerminalLine: (line) =>
    set((state) => ({
      terminalHistory: [...state.terminalHistory, line],
    })),
  clearTerminal: () =>
    set({ terminalHistory: ['> Terminal cleared.', '> Type "help" for commands.', ''] }),

  badgeCount: 0,
  incrementBadge: () => set((state) => ({ badgeCount: state.badgeCount + 1 })),
  resetBadge: () => set({ badgeCount: 0 }),
}));
