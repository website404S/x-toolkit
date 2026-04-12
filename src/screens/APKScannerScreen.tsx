// src/screens/APKScannerScreen.tsx
// Scans sideloaded APKs for suspicious indicators (permissions, source, signatures)

import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Alert,
} from 'react-native';
import { CyberCard } from '../components/CyberCard';
import { CyberButton } from '../components/CyberButton';
import { StatusBadge } from '../components/StatusBadge';
import { ScreenHeader } from '../components/ScreenHeader';
import { COLORS, FONT_SIZE, SPACING } from '../theme';
import { useAppStore } from '../store/useAppStore';
import { scanInstalledApps } from '../services/DeviceScanService';

export const APKScannerScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [scanned, setScanned] = useState(false);
  const installedApps = useAppStore((s) => s.installedApps);
  const setInstalledApps = useAppStore((s) => s.setInstalledApps);
  const addScanResult = useAppStore((s) => s.addScanResult);

  // Only show sideloaded apps on this screen
  const sideloadedApps = installedApps.filter((a) => a.installSource === 'sideloaded');
  const highRiskApps   = installedApps.filter((a) => a.riskLevel === 'high');

  const handleScan = async () => {
    setLoading(true);
    try {
      const apps = await scanInstalledApps();
      setInstalledApps(apps);
      setScanned(true);

      const dangerous = apps.filter((a) => a.riskLevel === 'high');
      if (dangerous.length > 0) {
        addScanResult({
          id: Date.now().toString(),
          type: 'apk',
          target: 'Installed Apps',
          status: 'danger',
          summary: `${dangerous.length} high-risk app(s) detected`,
          timestamp: Date.now(),
          details: { count: dangerous.length },
        });
        Alert.alert(
          '⚠️ Threats Detected',
          `${dangerous.length} high-risk app(s) found. Review them below.`,
          [{ text: 'OK' }]
        );
      } else {
        addScanResult({
          id: Date.now().toString(),
          type: 'apk',
          target: 'Installed Apps',
          status: 'safe',
          summary: `${apps.length} apps scanned — no high-risk apps found`,
          timestamp: Date.now(),
          details: { count: apps.length },
        });
      }
    } catch {
      Alert.alert('Error', 'Scan failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ScreenHeader
        title="APK Scanner"
        subtitle="Detect risky sideloaded applications"
        icon="📦"
        accent={COLORS.cyberPurple}
      />

      <View style={styles.body}>
        <CyberButton
          label={loading ? 'SCANNING...' : 'SCAN INSTALLED APPS'}
          onPress={handleScan}
          loading={loading}
          variant="primary"
          fullWidth
        />

        {scanned && (
          <>
            {/* Summary */}
            <View style={styles.summaryRow}>
              <SummaryBox label="Total Apps" value={String(installedApps.length)} color={COLORS.cyberCyan} />
              <SummaryBox label="Sideloaded" value={String(sideloadedApps.length)} color={COLORS.cyberYellow} />
              <SummaryBox label="High Risk" value={String(highRiskApps.length)} color={COLORS.cyberRed} />
            </View>

            {/* High risk apps */}
            {highRiskApps.length > 0 && (
              <>
                <SectionLabel label="⚠️ HIGH RISK APPS" color={COLORS.cyberRed} />
                {highRiskApps.map((app) => (
                  <AppCard key={app.packageName} app={app} />
                ))}
              </>
            )}

            {/* Sideloaded apps */}
            {sideloadedApps.filter((a) => a.riskLevel !== 'high').length > 0 && (
              <>
                <SectionLabel label="📦 SIDELOADED (Lower Risk)" color={COLORS.cyberYellow} />
                {sideloadedApps
                  .filter((a) => a.riskLevel !== 'high')
                  .map((app) => (
                    <AppCard key={app.packageName} app={app} />
                  ))}
              </>
            )}

            {highRiskApps.length === 0 && sideloadedApps.length === 0 && (
              <CyberCard accent="green" style={{ marginTop: SPACING.md }}>
                <Text style={styles.safeText}>✅ No sideloaded or high-risk apps detected.</Text>
              </CyberCard>
            )}
          </>
        )}

        {/* Info note */}
        <CyberCard style={styles.infoCard}>
          <Text style={styles.infoTitle}>ℹ️ How APK Scanning Works</Text>
          <Text style={styles.infoText}>
            This scanner checks all installed apps for:{'\n'}
            • Installation source (Play Store vs sideloaded){'\n'}
            • High-risk permission combinations{'\n'}
            • Known suspicious permission patterns{'\n\n'}
            Apps installed outside the Play Store bypass Google's malware scanning and may pose higher risk.
          </Text>
        </CyberCard>
      </View>
    </ScrollView>
  );
};

// ── Sub-components ─────────────────────────────────────────────────────────
const SummaryBox: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
  <CyberCard style={styles.summaryBox} padding={SPACING.sm}>
    <Text style={[styles.summaryValue, { color }]}>{value}</Text>
    <Text style={styles.summaryLabel}>{label}</Text>
  </CyberCard>
);

const SectionLabel: React.FC<{ label: string; color: string }> = ({ label, color }) => (
  <Text style={[styles.sectionLabel, { color }]}>{label}</Text>
);

const AppCard: React.FC<{ app: ReturnType<typeof useAppStore.getState>['installedApps'][0] }> = ({ app }) => {
  const riskColor = app.riskLevel === 'high' ? COLORS.cyberRed : app.riskLevel === 'medium' ? COLORS.cyberYellow : COLORS.cyberGreen;

  return (
    <CyberCard
      accent={app.riskLevel === 'high' ? 'red' : 'none'}
      style={styles.appCard}
    >
      <View style={styles.appHeader}>
        <Text style={styles.appName}>{app.appName}</Text>
        <StatusBadge
          status={app.riskLevel === 'high' ? 'danger' : app.riskLevel === 'medium' ? 'warning' : 'safe'}
          label={app.riskLevel.toUpperCase()}
        />
      </View>
      <Text style={styles.packageName}>{app.packageName}</Text>
      <View style={styles.metaRow}>
        <MetaTag label={`Source: ${app.installSource}`} color={COLORS.textSecondary} />
        <MetaTag label={`${app.permissions.length} permissions`} color={riskColor} />
      </View>
      {/* Show risky permissions */}
      {app.permissions.slice(0, 4).map((perm) => (
        <Text key={perm} style={styles.permission}>• {perm}</Text>
      ))}
      {app.permissions.length > 4 && (
        <Text style={styles.morePerms}>+{app.permissions.length - 4} more permissions</Text>
      )}
    </CyberCard>
  );
};

const MetaTag: React.FC<{ label: string; color: string }> = ({ label, color }) => (
  <Text style={[styles.metaTag, { color }]}>{label}</Text>
);

// ── Styles ─────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  body: { padding: SPACING.md, gap: SPACING.md, paddingBottom: SPACING.xxl },

  summaryRow: { flexDirection: 'row', gap: SPACING.sm },
  summaryBox: { flex: 1, alignItems: 'center' },
  summaryValue: { fontSize: FONT_SIZE.xxl, fontFamily: 'monospace', fontWeight: '700' },
  summaryLabel: { fontSize: 10, color: COLORS.textSecondary, fontFamily: 'monospace' },

  sectionLabel: { fontFamily: 'monospace', fontSize: FONT_SIZE.sm, fontWeight: '700', letterSpacing: 1, marginTop: SPACING.sm },

  appCard: { marginBottom: SPACING.sm },
  appHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  appName: { color: COLORS.textPrimary, fontFamily: 'monospace', fontSize: FONT_SIZE.md, fontWeight: '700', flex: 1 },
  packageName: { color: COLORS.textMuted, fontFamily: 'monospace', fontSize: 10, marginBottom: SPACING.sm },
  metaRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.sm },
  metaTag: { fontFamily: 'monospace', fontSize: 10 },
  permission: { color: COLORS.cyberRed + 'CC', fontFamily: 'monospace', fontSize: 11, marginBottom: 2 },
  morePerms: { color: COLORS.textMuted, fontFamily: 'monospace', fontSize: 10, marginTop: 2 },

  safeText: { color: COLORS.cyberGreen, fontFamily: 'monospace', fontSize: FONT_SIZE.sm },

  infoCard: { marginTop: SPACING.sm },
  infoTitle: { color: COLORS.cyberCyan, fontFamily: 'monospace', fontSize: FONT_SIZE.sm, fontWeight: '700', marginBottom: SPACING.sm },
  infoText: { color: COLORS.textSecondary, fontFamily: 'monospace', fontSize: FONT_SIZE.sm, lineHeight: 20 },
});
