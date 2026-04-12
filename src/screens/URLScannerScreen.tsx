// src/screens/URLScannerScreen.tsx

import React, { useState } from 'react';
import {
  View, Text, TextInput, ScrollView, StyleSheet, Alert,
} from 'react-native';
import { scanURL, URLScanResult } from '../services/URLScannerService';
import { CyberCard } from '../components/CyberCard';
import { CyberButton } from '../components/CyberButton';
import { StatusBadge } from '../components/StatusBadge';
import { ScreenHeader } from '../components/ScreenHeader';
import { COLORS, FONT_SIZE, SPACING } from '../theme';
import { useAppStore } from '../store/useAppStore';

const THREAT_ACCENT = {
  safe: 'green',
  suspicious: 'none',
  dangerous: 'red',
  unknown: 'none',
} as const;

export const URLScannerScreen: React.FC = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<URLScanResult | null>(null);
  const addScanResult = useAppStore((s) => s.addScanResult);

  const handleScan = async () => {
    if (!url.trim()) return Alert.alert('Input Error', 'Please enter a URL.');
    setLoading(true);
    setResult(null);
    try {
      const res = await scanURL(url.trim());
      setResult(res);
      addScanResult({
        id: Date.now().toString(),
        type: 'url',
        target: url.trim(),
        status: res.threatLevel === 'safe' ? 'safe' : res.threatLevel === 'dangerous' ? 'danger' : 'warning',
        summary: `Score: ${res.score}/100`,
        timestamp: Date.now(),
        details: res as any,
      });
    } catch {
      Alert.alert('Error', 'Scan failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <ScreenHeader title="URL Scanner" subtitle="Detect phishing & malicious links" icon="🔗" />

      {/* ── Input ── */}
      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          value={url}
          onChangeText={setUrl}
          placeholder="https://example.com"
          placeholderTextColor={COLORS.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
        />
        <CyberButton label="SCAN URL" onPress={handleScan} loading={loading} fullWidth />
      </View>

      {/* ── Results ── */}
      {result && (
        <View style={styles.results}>
          {/* Score gauge */}
          <CyberCard accent={THREAT_ACCENT[result.threatLevel]} style={styles.card}>
            <View style={styles.scoreRow}>
              <View>
                <Text style={styles.scoreLabel}>DANGER SCORE</Text>
                <Text style={[styles.scoreValue, { color: scoreColor(result.score) }]}>
                  {result.score}<Text style={styles.scoreMax}>/100</Text>
                </Text>
              </View>
              <StatusBadge
                status={result.threatLevel === 'dangerous' ? 'danger' : result.threatLevel === 'suspicious' ? 'warning' : 'safe'}
                label={result.threatLevel.toUpperCase()}
              />
            </View>

            {/* Visual bar */}
            <View style={styles.barBg}>
              <View style={[styles.barFill, { width: `${result.score}%` as any, backgroundColor: scoreColor(result.score) }]} />
            </View>
          </CyberCard>

          {/* Findings */}
          <CyberCard style={styles.card}>
            <Text style={styles.sectionTitle}>// FINDINGS</Text>
            {result.reasons.map((r, i) => (
              <Text key={i} style={styles.finding}>{r}</Text>
            ))}
          </CyberCard>

          {/* Target URL */}
          <CyberCard style={styles.card}>
            <Text style={styles.sectionTitle}>// TARGET</Text>
            <Text style={styles.urlText} selectable>{result.url}</Text>
          </CyberCard>
        </View>
      )}
    </ScrollView>
  );
};

function scoreColor(score: number): string {
  if (score >= 70) return COLORS.cyberRed;
  if (score >= 35) return COLORS.cyberYellow;
  return COLORS.cyberGreen;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  inputArea: { padding: SPACING.md, gap: SPACING.sm },
  input: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderAccent,
    borderRadius: 6,
    padding: SPACING.md,
    color: COLORS.textPrimary,
    fontFamily: 'monospace',
    fontSize: FONT_SIZE.md,
  },
  results: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.xxl },
  card: { marginBottom: SPACING.sm },

  scoreRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  scoreLabel: { color: COLORS.textSecondary, fontFamily: 'monospace', fontSize: FONT_SIZE.xs, letterSpacing: 2 },
  scoreValue: { fontFamily: 'monospace', fontSize: 40, fontWeight: '900' },
  scoreMax: { fontSize: FONT_SIZE.lg, color: COLORS.textSecondary },

  barBg: { height: 4, backgroundColor: COLORS.bgOverlay, borderRadius: 2 },
  barFill: { height: 4, borderRadius: 2 },

  sectionTitle: { color: COLORS.textMuted, fontFamily: 'monospace', fontSize: FONT_SIZE.xs, letterSpacing: 2, marginBottom: SPACING.sm },
  finding: { color: COLORS.textPrimary, fontFamily: 'monospace', fontSize: FONT_SIZE.sm, marginBottom: 4 },
  urlText: { color: COLORS.cyberCyan, fontFamily: 'monospace', fontSize: FONT_SIZE.sm },
});
