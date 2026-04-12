// src/screens/DNSCheckerScreen.tsx

import React, { useState } from 'react';
import {
  View, Text, TextInput, ScrollView, StyleSheet, Alert,
} from 'react-native';
import { lookupDNS, DNSRecord, DNSResult } from '../services/DNSService';
import { CyberCard } from '../components/CyberCard';
import { CyberButton } from '../components/CyberButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { COLORS, FONT_SIZE, SPACING } from '../theme';
import { useAppStore } from '../store/useAppStore';

export const DNSCheckerScreen: React.FC = () => {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DNSResult | null>(null);
  const addScanResult = useAppStore((s) => s.addScanResult);

  const handleLookup = async () => {
    if (!domain.trim()) return Alert.alert('Input Error', 'Please enter a domain name.');
    setLoading(true);
    setResult(null);

    try {
      const res = await lookupDNS(domain.trim());
      setResult(res);

      // Save to history
      addScanResult({
        id: Date.now().toString(),
        type: 'dns',
        target: res.domain,
        status: res.error ? 'unknown' : 'safe',
        summary: res.error ?? `Found ${res.records.length} records`,
        timestamp: Date.now(),
        details: res as any,
      });
    } catch {
      Alert.alert('Error', 'DNS lookup failed. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // Group records by type for display
  const grouped: Record<string, DNSRecord[]> = {};
  result?.records.forEach((r) => {
    grouped[r.type] = [...(grouped[r.type] ?? []), r];
  });

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <ScreenHeader title="DNS Checker" subtitle="Query DNS records for any domain" icon="🌐" accent={COLORS.cyberCyan} />

      {/* ── Input ── */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={domain}
          onChangeText={setDomain}
          placeholder="Enter domain (e.g. google.com)"
          placeholderTextColor={COLORS.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          onSubmitEditing={handleLookup}
        />
        <CyberButton label="SCAN" onPress={handleLookup} loading={loading} variant="secondary" />
      </View>

      {/* ── Results ── */}
      {result && (
        <View style={styles.results}>
          {/* Summary */}
          <CyberCard accent="cyan" style={styles.card}>
            <Row label="Domain"  value={result.domain} />
            <Row label="IPs"     value={result.ip.length ? result.ip.join(', ') : 'None found'} />
            <Row label="Records" value={`${result.records.length} found`} />
            <Row label="Latency" value={`${result.latencyMs} ms`} />
          </CyberCard>

          {/* Error */}
          {result.error && (
            <CyberCard accent="red" style={styles.card}>
              <Text style={styles.errorText}>{result.error}</Text>
            </CyberCard>
          )}

          {/* Records by type */}
          {Object.entries(grouped).map(([type, records]) => (
            <CyberCard key={type} style={styles.card}>
              <Text style={styles.typeLabel}>{type} Records</Text>
              {records.map((rec, i) => (
                <View key={i} style={styles.recordRow}>
                  <Text style={styles.recordValue} selectable>{rec.value}</Text>
                  <Text style={styles.recordTTL}>TTL {rec.ttl}s</Text>
                </View>
              ))}
            </CyberCard>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

// ── Helper ─────────────────────────────────────────────────────────────────
const Row: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={rowStyles.row}>
    <Text style={rowStyles.label}>{label}</Text>
    <Text style={rowStyles.value} selectable numberOfLines={2}>{value}</Text>
  </View>
);

const rowStyles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  label: { color: COLORS.textSecondary, fontFamily: 'monospace', fontSize: FONT_SIZE.sm, flex: 1 },
  value: { color: COLORS.textPrimary, fontFamily: 'monospace', fontSize: FONT_SIZE.sm, flex: 2, textAlign: 'right' },
});

// ── Styles ─────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  inputRow: { flexDirection: 'row', gap: SPACING.sm, paddingHorizontal: SPACING.md, marginBottom: SPACING.md },
  input: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderCyan,
    borderRadius: 6,
    paddingHorizontal: SPACING.md,
    color: COLORS.textPrimary,
    fontFamily: 'monospace',
    fontSize: FONT_SIZE.md,
  },
  results: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.xxl },
  card: { marginBottom: SPACING.sm },
  typeLabel: { color: COLORS.cyberCyan, fontFamily: 'monospace', fontSize: FONT_SIZE.sm, fontWeight: '700', marginBottom: SPACING.sm, letterSpacing: 1 },
  recordRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  recordValue: { color: COLORS.textPrimary, fontFamily: 'monospace', fontSize: FONT_SIZE.sm, flex: 1 },
  recordTTL: { color: COLORS.textMuted, fontFamily: 'monospace', fontSize: 11 },
  errorText: { color: COLORS.cyberRed, fontFamily: 'monospace', fontSize: FONT_SIZE.sm },
});
