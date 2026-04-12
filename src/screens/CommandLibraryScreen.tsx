// src/screens/CommandLibraryScreen.tsx

import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, TextInput, Alert,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { COMMAND_LIBRARY, CommandCategory, Command } from '../data/commandLibrary';
import { CyberCard } from '../components/CyberCard';
import { ScreenHeader } from '../components/ScreenHeader';
import { COLORS, FONT_SIZE, RADIUS, SPACING } from '../theme';

export const CommandLibraryScreen: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState(COMMAND_LIBRARY[0].id);
  const [search, setSearch] = useState('');
  const [expandedCmd, setExpandedCmd] = useState<string | null>(null);

  const category = COMMAND_LIBRARY.find((c) => c.id === activeCategory)!;

  // Filter by search
  const filtered: Command[] = search.trim()
    ? COMMAND_LIBRARY.flatMap((cat) =>
        cat.commands.filter(
          (cmd) =>
            cmd.cmd.toLowerCase().includes(search.toLowerCase()) ||
            cmd.description.toLowerCase().includes(search.toLowerCase())
        )
      )
    : category.commands;

  const copyCmd = async (text: string) => {
    await Clipboard.setStringAsync(text);
    Alert.alert('Copied!', `"${text}" copied to clipboard.`);
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Command Library"
        subtitle="Security & networking command reference"
        icon="📖"
        accent={COLORS.cyberPurple}
      />

      {/* Search */}
      <View style={styles.searchRow}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Search commands..."
          placeholderTextColor={COLORS.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Text style={styles.clearSearch}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Category tabs (hidden when searching) */}
      {!search && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabBar}
          contentContainerStyle={styles.tabContent}
        >
          {COMMAND_LIBRARY.map((cat: CommandCategory) => {
            const isActive = cat.id === activeCategory;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.tab,
                  isActive && { backgroundColor: cat.color + '22', borderColor: cat.color },
                ]}
                onPress={() => setActiveCategory(cat.id)}
              >
                <Text style={styles.tabIcon}>{cat.icon}</Text>
                <Text style={[styles.tabLabel, isActive && { color: cat.color }]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {/* Commands list */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {!search && (
          <Text style={[styles.categoryTitle, { color: category.color }]}>
            {category.icon} {category.label} ({filtered.length} commands)
          </Text>
        )}
        {search && (
          <Text style={styles.searchResults}>
            {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{search}"
          </Text>
        )}

        {filtered.map((cmd) => {
          const isExpanded = expandedCmd === cmd.cmd + cmd.category;
          return (
            <TouchableOpacity
              key={cmd.cmd + cmd.category}
              onPress={() => setExpandedCmd(isExpanded ? null : cmd.cmd + cmd.category)}
              activeOpacity={0.8}
            >
              <CyberCard
                style={styles.cmdCard}
                accent={isExpanded ? 'purple' : 'none'}
                padding={SPACING.sm}
              >
                {/* Command line */}
                <View style={styles.cmdHeader}>
                  <Text style={styles.cmdText} selectable>{cmd.cmd}</Text>
                  <TouchableOpacity
                    style={styles.copyBtn}
                    onPress={() => copyCmd(cmd.example)}
                  >
                    <Text style={styles.copyText}>COPY</Text>
                  </TouchableOpacity>
                </View>

                {/* Description */}
                <Text style={styles.cmdDesc}>{cmd.description}</Text>

                {/* Expanded: example */}
                {isExpanded && (
                  <View style={styles.exampleBox}>
                    <Text style={styles.exampleLabel}>EXAMPLE:</Text>
                    <Text style={styles.exampleCode} selectable>{cmd.example}</Text>
                  </View>
                )}
              </CyberCard>
            </TouchableOpacity>
          );
        })}

        {filtered.length === 0 && (
          <Text style={styles.noResults}>No commands found for "{search}"</Text>
        )}

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            ⚠️ These commands are for educational reference only.{'\n'}
            Only use on systems you own or have explicit permission to test.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    paddingHorizontal: SPACING.sm,
  },
  searchIcon: { fontSize: 14, marginRight: 6 },
  searchInput: {
    flex: 1,
    color: COLORS.textPrimary,
    fontFamily: 'monospace',
    fontSize: FONT_SIZE.sm,
    paddingVertical: SPACING.sm,
  },
  clearSearch: { color: COLORS.textMuted, fontSize: FONT_SIZE.md, padding: 4 },

  tabBar: { maxHeight: 52, marginBottom: SPACING.sm },
  tabContent: { paddingHorizontal: SPACING.md, gap: SPACING.sm, alignItems: 'center' },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    backgroundColor: COLORS.bgCard,
  },
  tabIcon: { fontSize: 14 },
  tabLabel: { color: COLORS.textSecondary, fontFamily: 'monospace', fontSize: FONT_SIZE.xs, fontWeight: '700' },

  list: { flex: 1 },
  listContent: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.xxl },
  categoryTitle: { fontFamily: 'monospace', fontSize: FONT_SIZE.sm, fontWeight: '700', marginBottom: SPACING.sm, letterSpacing: 1 },
  searchResults: { color: COLORS.textMuted, fontFamily: 'monospace', fontSize: FONT_SIZE.xs, marginBottom: SPACING.sm },

  cmdCard: { marginBottom: SPACING.xs },
  cmdHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  cmdText: { color: COLORS.cyberGreen, fontFamily: 'monospace', fontSize: FONT_SIZE.sm, fontWeight: '700', flex: 1 },
  copyBtn: {
    backgroundColor: COLORS.cyberGreen + '22',
    borderWidth: 1,
    borderColor: COLORS.cyberGreen + '66',
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
  },
  copyText: { color: COLORS.cyberGreen, fontFamily: 'monospace', fontSize: 10, fontWeight: '700' },
  cmdDesc: { color: COLORS.textSecondary, fontFamily: 'monospace', fontSize: FONT_SIZE.xs, lineHeight: 18 },

  exampleBox: {
    backgroundColor: COLORS.bgOverlay,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    marginTop: SPACING.sm,
  },
  exampleLabel: { color: COLORS.textMuted, fontFamily: 'monospace', fontSize: 10, letterSpacing: 2, marginBottom: 4 },
  exampleCode: { color: COLORS.cyberCyan, fontFamily: 'monospace', fontSize: FONT_SIZE.xs },

  noResults: { color: COLORS.textMuted, fontFamily: 'monospace', fontSize: FONT_SIZE.sm, textAlign: 'center', marginTop: SPACING.xxl },

  disclaimer: {
    marginTop: SPACING.lg,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
  },
  disclaimerText: { color: COLORS.textMuted, fontFamily: 'monospace', fontSize: FONT_SIZE.xs, lineHeight: 18, textAlign: 'center' },
});
