// src/screens/SystemInfoScreen.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { getDeviceInfo, DeviceInfo } from '../services/DeviceScanService';
import { CyberCard } from '../components/CyberCard';
import { ScreenHeader } from '../components/ScreenHeader';
import { COLORS, FONT_SIZE, SPACING } from '../theme';

export const SystemInfoScreen: React.FC = () => {
  const [info, setInfo] = useState<DeviceInfo | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    const data = await getDeviceInfo();
    setInfo(data);
  };

  useEffect(() => { load(); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const rows: { label: string; value: string; color?: string }[] = info
    ? [
        { label: 'Device Name',  value: info.deviceName },
        { label: 'Brand',        value: info.brand },
        { label: 'Model',        value: info.modelName },
        { label: 'OS Version',   value: info.osVersion },
        { label: 'Platform',     value: info.platform.toUpperCase(), color: COLORS.cyberGreen },
        { label: 'IP Address',   value: info.ipAddress, color: COLORS.cyberCyan },
        { label: 'Real Device',  value: info.isDevice ? 'Yes' : 'No (Emulator)', color: info.isDevice ? COLORS.cyberGreen : COLORS.cyberYellow },
        { label: 'Total RAM',    value: info.totalMemory ? `${(info.totalMemory / 1e9).toFixed(1)} GB` : 'N/A' },
      ]
    : [];

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.cyberGreen} />}
    >
      <ScreenHeader title="System Info" subtitle="Device & network information" icon="💻" accent={COLORS.cyberYellow} />

      <View style={styles.body}>
        {/* Device Info */}
        <Text style={styles.section}>// DEVICE</Text>
        <CyberCard accent="none">
          {rows.map((row) => (
            <View key={row.label} style={styles.row}>
              <Text style={styles.label}>{row.label}</Text>
              <Text style={[styles.value, row.color ? { color: row.color } : null]} selectable>
                {row.value}
              </Text>
            </View>
          ))}
          {!info && <Text style={styles.loading}>Loading device info...</Text>}
        </CyberCard>

        {/* Network */}
        <Text style={styles.section}>// NETWORK</Text>
        <CyberCard accent="cyan">
          <InfoRow label="IP Address" value={info?.ipAddress ?? '...'} color={COLORS.cyberCyan} />
          <InfoRow label="Interface" value="wlan0 / eth0" />
          <InfoRow label="DNS Servers" value="8.8.8.8, 1.1.1.1 (system)" />
          <InfoRow label="Protocol" value="IPv4 + IPv6" />
        </CyberCard>

        {/* Security posture tips */}
        <Text style={styles.section}>// SECURITY TIPS</Text>
        {[
          { tip: 'Keep your Android OS updated for latest security patches.', icon: '🔄' },
          { tip: 'Use a VPN on public WiFi to encrypt your traffic.', icon: '🛡️' },
          { tip: 'Enable screen lock (PIN/biometric) to protect your device.', icon: '🔒' },
          { tip: 'Review app permissions periodically in Settings > Apps.', icon: '📋' },
          { tip: 'Use Google Play Protect to auto-scan installed apps.', icon: '✅' },
        ].map(({ tip, icon }) => (
          <CyberCard key={tip} style={styles.tipCard} padding={SPACING.sm} accent="none">
            <Text style={styles.tipText}>{icon} {tip}</Text>
          </CyberCard>
        ))}
      </View>
    </ScrollView>
  );
};

const InfoRow: React.FC<{ label: string; value: string; color?: string }> = ({ label, value, color }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={[styles.value, color ? { color } : null]} selectable>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  body: { padding: SPACING.md, gap: SPACING.sm, paddingBottom: SPACING.xxl },
  section: { color: COLORS.textMuted, fontFamily: 'monospace', fontSize: FONT_SIZE.xs, letterSpacing: 2, marginTop: SPACING.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: COLORS.borderDefault },
  label: { color: COLORS.textSecondary, fontFamily: 'monospace', fontSize: FONT_SIZE.sm },
  value: { color: COLORS.textPrimary, fontFamily: 'monospace', fontSize: FONT_SIZE.sm, textAlign: 'right', flex: 1, marginLeft: SPACING.sm },
  loading: { color: COLORS.textMuted, fontFamily: 'monospace', fontSize: FONT_SIZE.sm },
  tipCard: { marginBottom: SPACING.xs },
  tipText: { color: COLORS.textSecondary, fontFamily: 'monospace', fontSize: FONT_SIZE.sm, lineHeight: 20 },
});
