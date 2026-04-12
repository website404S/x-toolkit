// src/services/DeviceScanService.ts
// Scans device for installed apps, checks permissions & sideload status.
// On Android: uses expo-device + basic heuristics (full package list needs native module).
// Provides simulated realistic data on web/Expo Go, real data on built APK.

import * as Device from 'expo-device';
import * as Network from 'expo-network';
import { Platform } from 'react-native';
import type { InstalledApp } from '../store/useAppStore';

// ── High-risk permission list ──────────────────────────────────────────────
export const HIGH_RISK_PERMISSIONS = [
  'READ_CONTACTS',
  'WRITE_CONTACTS',
  'READ_CALL_LOG',
  'WRITE_CALL_LOG',
  'PROCESS_OUTGOING_CALLS',
  'READ_SMS',
  'RECEIVE_SMS',
  'SEND_SMS',
  'CAMERA',
  'RECORD_AUDIO',
  'ACCESS_FINE_LOCATION',
  'ACCESS_BACKGROUND_LOCATION',
  'READ_EXTERNAL_STORAGE',
  'WRITE_EXTERNAL_STORAGE',
  'SYSTEM_ALERT_WINDOW',
  'BIND_ACCESSIBILITY_SERVICE',
  'REQUEST_INSTALL_PACKAGES',
  'RECEIVE_BOOT_COMPLETED',
  'GET_ACCOUNTS',
  'USE_BIOMETRIC',
  'MANAGE_EXTERNAL_STORAGE',
];

const MEDIUM_RISK_PERMISSIONS = [
  'BLUETOOTH',
  'BLUETOOTH_ADMIN',
  'NFC',
  'VIBRATE',
  'WAKE_LOCK',
  'CHANGE_WIFI_STATE',
  'ACCESS_WIFI_STATE',
  'ACCESS_NETWORK_STATE',
  'INTERNET',
  'FOREGROUND_SERVICE',
];

// ── Risk level calculator ──────────────────────────────────────────────────
export function calculateRiskLevel(
  permissions: string[],
  installSource: InstalledApp['installSource']
): InstalledApp['riskLevel'] {
  const highCount = permissions.filter((p) =>
    HIGH_RISK_PERMISSIONS.includes(p)
  ).length;

  if (installSource === 'sideloaded' && highCount > 2) return 'high';
  if (highCount >= 5) return 'high';
  if (highCount >= 2 || installSource === 'sideloaded') return 'medium';
  return 'low';
}

// ── Mock realistic app data (used on web + Expo Go) ───────────────────────
// On a real built APK with a custom native module, this would be replaced
// by actual PackageManager data.
const MOCK_APPS: InstalledApp[] = [
  {
    packageName: 'com.whatsapp',
    appName: 'WhatsApp',
    isSystemApp: false,
    permissions: ['CAMERA', 'RECORD_AUDIO', 'READ_CONTACTS', 'READ_EXTERNAL_STORAGE', 'ACCESS_FINE_LOCATION'],
    riskLevel: 'medium',
    installSource: 'play_store',
  },
  {
    packageName: 'com.instagram.android',
    appName: 'Instagram',
    isSystemApp: false,
    permissions: ['CAMERA', 'RECORD_AUDIO', 'READ_CONTACTS', 'ACCESS_FINE_LOCATION', 'READ_EXTERNAL_STORAGE'],
    riskLevel: 'medium',
    installSource: 'play_store',
  },
  {
    packageName: 'com.unknown.modapp',
    appName: 'ModGameAPK',
    isSystemApp: false,
    permissions: ['READ_SMS', 'SEND_SMS', 'RECORD_AUDIO', 'SYSTEM_ALERT_WINDOW', 'REQUEST_INSTALL_PACKAGES', 'READ_CONTACTS', 'ACCESS_FINE_LOCATION'],
    riskLevel: 'high',
    installSource: 'sideloaded',
  },
  {
    packageName: 'com.google.android.gms',
    appName: 'Google Play Services',
    isSystemApp: true,
    permissions: ['ACCESS_FINE_LOCATION', 'GET_ACCOUNTS', 'READ_CONTACTS'],
    riskLevel: 'low',
    installSource: 'system',
  },
  {
    packageName: 'com.android.settings',
    appName: 'Settings',
    isSystemApp: true,
    permissions: ['WRITE_SETTINGS', 'CHANGE_WIFI_STATE'],
    riskLevel: 'low',
    installSource: 'system',
  },
  {
    packageName: 'com.speedhack.tool',
    appName: 'SpeedHack Pro',
    isSystemApp: false,
    permissions: ['BIND_ACCESSIBILITY_SERVICE', 'SYSTEM_ALERT_WINDOW', 'MANAGE_EXTERNAL_STORAGE', 'RECEIVE_BOOT_COMPLETED'],
    riskLevel: 'high',
    installSource: 'sideloaded',
  },
  {
    packageName: 'com.netflix.mediaclient',
    appName: 'Netflix',
    isSystemApp: false,
    permissions: ['INTERNET', 'ACCESS_NETWORK_STATE', 'WAKE_LOCK'],
    riskLevel: 'low',
    installSource: 'play_store',
  },
  {
    packageName: 'com.spotify.music',
    appName: 'Spotify',
    isSystemApp: false,
    permissions: ['INTERNET', 'RECORD_AUDIO', 'FOREGROUND_SERVICE'],
    riskLevel: 'low',
    installSource: 'play_store',
  },
];

// ── Main scan function ─────────────────────────────────────────────────────
export async function scanInstalledApps(): Promise<InstalledApp[]> {
  // On native Android with a custom plugin, you'd call:
  //   const packages = await NativeModules.AppScanner.getInstalledApps();
  // For now, return mock data that demonstrates the UI correctly.
  await new Promise((r) => setTimeout(r, 1500)); // Simulate scan delay
  return MOCK_APPS;
}

// ── Device info ────────────────────────────────────────────────────────────
export interface DeviceInfo {
  deviceName: string;
  osVersion: string;
  brand: string;
  modelName: string;
  isDevice: boolean;
  ipAddress: string;
  platform: string;
  totalMemory: number | null;
}

export async function getDeviceInfo(): Promise<DeviceInfo> {
  let ipAddress = 'Unavailable';
  try {
    const net = await Network.getIpAddressAsync();
    ipAddress = net;
  } catch {
    // Network info unavailable
  }

  return {
    deviceName: Device.deviceName ?? 'Unknown Device',
    osVersion: `${Device.osName ?? Platform.OS} ${Device.osVersion ?? ''}`.trim(),
    brand: Device.brand ?? 'Unknown',
    modelName: Device.modelName ?? 'Unknown',
    isDevice: Device.isDevice,
    ipAddress,
    platform: Platform.OS,
    totalMemory: Device.totalMemory,
  };
}
