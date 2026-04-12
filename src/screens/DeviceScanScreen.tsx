// src/screens/DeviceScanScreen.tsx

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { CyberCard } from '../components/CyberCard';
import { CyberButton } from '../components/CyberButton';
import { StatusBadge } from '../components/StatusBadge';
import { ScreenHeader } from '../components/ScreenHeader';
import { COLORS, FONT_SIZE, SPACING } from '../theme';
import { useAppStore } from '../store/useAppStore';
import { scanInstalledApps, HIGH_RISK_PERMISSIONS } from '../services/DeviceScanService';

export const DeviceScanScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [scanned, setScanned] = useState(false);
  const installedApps = useAppStore((s) => s.installedApps);
  const setInstalledApps = useAppStore((s) => s.setInstalledApps);

  const handleScan = async () => {
    setLoading(true);
    const apps = await scanInstalledApps();
    setInstalledApps(apps);
    setScanned(true);
    setLoading(false);
  };

  // Aggregate permission usage across all apps
  const permissionUsage: Record<string, number> = {};
  installedApps.forEach((app) => {
    app.permissions.forEach((p) => {
      permissionUsage[p] = (permissionUsage[p] ?? 0) + 1;
    });
  });
  const sortedPerms = Object.entries(permissionUsage)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ScreenHeader
        title="Device Scan"
        subtitle="Analyze all installed apps & permissions"
        icon="📱"
        accent={COLORS.cyberOrange}
      />

      <View style={styles.body}>
        <CyberButton
          label={loading ? 'SCANNING...' : 'SCAN DEVICE'}
          onPress={handleScan}
          loading={loading}
          variant="primary"
          fullWidth
        />

        {scanned && installedApps.length > 0 && (
          <>
            {/* Stats */}
            <View style={styles.statsRow}>
              {[
                { label: 'Total Apps',  value: installedApps.length,                                   color: COLORS.cyberCyan },
                { label: 'High Risk',   value: installedApps.filter((a) => a.riskLevel === 'high').length,   color: COLORS.cyberRed },
                { label: 'Sideloaded',  value: installedApps.filter((a) => a.installSource === 'sideloaded').length, color: COLORS.cyberYellow },
                { label: 'System',      value: installedApps.filter((a) => a.isSystemApp).length,            color: COLORS.textSecondary },
              ].map((s) => (
                <CyberCard key={s.label} style={styles.statBox} padding={SPACING.sm}>
                  <Text style={[styles.statVal, { color: s.color }]}>{s.value}</Text>
                  <Text style={styles.statLabel}>{s.label}</Text>
                </CyberCard>
              ))}
            </View>

            {/* Top permissions */}
            <Text style={styles.sectionTitle}>// TOP REQUESTED PERMISSIONS</Text>
            {sortedPerms.map(([perm, count]) => {
              const isHighRisk = HIGH_RISK_PERMISSIONS.includes(perm);
              return (
                <CyberCard key={perm} style={styles.permRow} padding={SPACING.sm}>
                  <View style={styles.permLeft}>
                    <Text style={[styles.permName, { color: isHighRisk ? COLORS.cyberRed : COLORS.textPrimary }]}>
                      {isHighRisk ? '⚠️ ' : '  '}{perm}
                    </Text>
                    <Text style={styles.permCount}>{count} apps</Text>
                  </View>
                  <StatusBadge
                    status={isHighRisk ? 'danger' : 'info'}
                    label={isHighRisk ? 'HIGH RISK' : 'NORMAL'}
                  />
                </CyberCard>
              );
            })}

            {/* All apps list */}
            <Text style={styles.sectionTitle}>// ALL APPS</Text>
            {installedApps.map((app) => (
              <CyberCard
                key={app.packageName}
                style={styles.appRow}
                accent={app.riskLevel === 'high' ? 'red' : 'none'}
                padding={SPACING.sm}
              >
                <View style={styles.appMeta}>
                  <Text style={styles.appName}>{app.appName}</Text>
                  <StatusBadge
                    status={app.riskLevel === 'high' ? 'danger' : app.riskLevel === 'medium' ? 'warning' : 'safe'}
                    label={app.riskLevel.toUpperCase()}
                  />
                </View>
                <Text style={styles.pkgName}>{app.packageName}</Text>
                <Text style={styles.permCount2}>{app.permissions.length} permissions • {app.installSource}</Text>
              </CyberCard>
            ))}
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  body: { padding: SPACING.md, gap: SPACING.sm, paddingBottom: SPACING.xxl },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  statBox: { flex: 1, minWidth: 70, alignItems: 'center' },
  statVal: { fontSize: FONT_SIZE.xl, fontFamily: 'monospace', fontWeight: '700' },
  statLabel: { fontSize: 10, color: COLORS.textSecondary, fontFamily: 'monospace', textAlign: 'center' },
  sectionTitle: { color: COLORS.textMuted, fontFamily: 'monospace', fontSize: FONT_SIZE.xs, letterSpacing: 2, marginTop: SPACING.sm },
  permRow: { marginBottom: SPACING.xs, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  permLeft: { flex: 1 },
  permName: { fontFamily: 'monospace', fontSize: 11, marginBottom: 2 },
  permCount: { color: COLORS.textMuted, fontFamily: 'monospace', fontSize: 10 },
  appRow: { marginBottom: SPACING.xs },
  appMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  appName: { color: COLORS.textPrimary, fontFamily: 'monospace', fontSize: FONT_SIZE.sm, fontWeight: '700' },
  pkgName: { color: COLORS.textMuted, fontFamily: 'monospace', fontSize: 10, marginTop: 2 },
  permCount2: { color: COLORS.textSecondary, fontFamily: 'monospace', fontSize: 10, marginTop: 2 },
});
