// src/screens/HomeScreen.tsx
// Dashboard — shows all tools + recent scan summary

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONT_SIZE, RADIUS, SPACING } from '../theme';
import { CyberCard } from '../components/CyberCard';
import { useAppStore } from '../store/useAppStore';

// ── Tool grid data ─────────────────────────────────────────────────────────
const TOOLS = [
  { id: 'DNSChecker',     label: 'DNS Checker',    icon: '🌐', color: COLORS.cyberCyan,   desc: 'Lookup DNS records' },
  { id: 'URLScanner',     label: 'URL Scanner',    icon: '🔗', color: COLORS.cyberGreen,  desc: 'Detect phishing links' },
  { id: 'APKScanner',     label: 'APK Scanner',    icon: '📦', color: COLORS.cyberPurple, desc: 'Scan sideloaded APKs' },
  { id: 'DeviceScan',     label: 'Device Scan',    icon: '📱', color: COLORS.cyberOrange, desc: 'Check installed apps' },
  { id: 'SystemInfo',     label: 'System Info',    icon: '💻', color: COLORS.cyberYellow, desc: 'Device & network info' },
  { id: 'LearningHub',    label: 'Learning Hub',   icon: '📚', color: '#FF6B9D',          desc: 'Security education' },
  { id: 'Terminal',       label: 'Terminal',       icon: '⌨️', color: COLORS.cyberGreen,  desc: 'Linux-like terminal' },
  { id: 'CodeEditor',     label: 'Code Editor',    icon: '✏️', color: COLORS.cyberCyan,   desc: 'Edit & run snippets' },
  { id: 'CommandLibrary', label: 'Command Lib',    icon: '📖', color: COLORS.cyberPurple, desc: 'Security commands' },
];

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const scanHistory = useAppStore((s) => s.scanHistory);

  const dangerCount = scanHistory.filter((r) => r.status === 'danger').length;
  const warningCount = scanHistory.filter((r) => r.status === 'warning').length;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Header ── */}
      <View style={styles.header}>
        <Text style={styles.logo}>X-TOOLKIT</Text>
        <Text style={styles.tagline}>{'> Ethical Cybersecurity Suite_'}</Text>
      </View>

      {/* ── Stats Bar ── */}
      <View style={styles.statsRow}>
        <StatBox label="Scans" value={String(scanHistory.length)} color={COLORS.cyberGreen} />
        <StatBox label="Threats" value={String(dangerCount)} color={COLORS.cyberRed} />
        <StatBox label="Warnings" value={String(warningCount)} color={COLORS.cyberYellow} />
      </View>

      {/* ── Tool Grid ── */}
      <Text style={styles.sectionLabel}>// TOOLS</Text>
      <View style={styles.grid}>
        {TOOLS.map((tool) => (
          <TouchableOpacity
            key={tool.id}
            style={[styles.toolCard, { borderColor: tool.color + '44' }]}
            onPress={() => navigation.navigate(tool.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.toolIcon}>{tool.icon}</Text>
            <Text style={[styles.toolLabel, { color: tool.color }]}>{tool.label}</Text>
            <Text style={styles.toolDesc}>{tool.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Recent Scans ── */}
      {scanHistory.length > 0 && (
        <>
          <Text style={styles.sectionLabel}>// RECENT SCANS</Text>
          {scanHistory.slice(0, 5).map((result) => (
            <CyberCard
              key={result.id}
              style={styles.historyCard}
              accent={result.status === 'danger' ? 'red' : result.status === 'warning' ? 'none' : 'green'}
            >
              <View style={styles.historyRow}>
                <Text style={styles.historyTarget} numberOfLines={1}>{result.target}</Text>
                <Text style={[
                  styles.historyStatus,
                  { color: result.status === 'danger' ? COLORS.cyberRed : result.status === 'safe' ? COLORS.cyberGreen : COLORS.cyberYellow }
                ]}>
                  {result.status.toUpperCase()}
                </Text>
              </View>
              <Text style={styles.historyTime}>
                {new Date(result.timestamp).toLocaleString()}
              </Text>
            </CyberCard>
          ))}
        </>
      )}
    </ScrollView>
  );
};

// ── Sub-component ──────────────────────────────────────────────────────────
const StatBox: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
  <CyberCard style={styles.statBox} padding={SPACING.sm}>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </CyberCard>
);

// ── Styles ─────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: SPACING.md, paddingBottom: SPACING.xxl },

  header: { marginBottom: SPACING.lg, marginTop: SPACING.sm },
  logo: {
    fontSize: 32,
    fontFamily: 'monospace',
    fontWeight: '900',
    color: COLORS.cyberGreen,
    letterSpacing: 6,
  },
  tagline: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontFamily: 'monospace',
    marginTop: 4,
  },

  statsRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.lg },
  statBox: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: FONT_SIZE.xxl, fontFamily: 'monospace', fontWeight: '700' },
  statLabel: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, fontFamily: 'monospace', marginTop: 2 },

  sectionLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    fontFamily: 'monospace',
    letterSpacing: 2,
    marginBottom: SPACING.sm,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  toolCard: {
    width: '30%',
    flexGrow: 1,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    padding: SPACING.sm,
    alignItems: 'center',
    gap: 4,
    minWidth: 100,
  },
  toolIcon: { fontSize: 24 },
  toolLabel: { fontSize: FONT_SIZE.xs, fontFamily: 'monospace', fontWeight: '700', textAlign: 'center' },
  toolDesc: { fontSize: 10, color: COLORS.textMuted, fontFamily: 'monospace', textAlign: 'center' },

  historyCard: { marginBottom: SPACING.sm },
  historyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  historyTarget: { color: COLORS.textPrimary, fontFamily: 'monospace', fontSize: FONT_SIZE.sm, flex: 1 },
  historyStatus: { fontSize: FONT_SIZE.xs, fontFamily: 'monospace', fontWeight: '700', letterSpacing: 1 },
  historyTime: { color: COLORS.textMuted, fontSize: 10, fontFamily: 'monospace', marginTop: 2 },
});
