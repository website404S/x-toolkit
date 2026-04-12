// src/screens/LearningHubScreen.tsx

import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { LEARNING_ARTICLES, LearningArticle } from '../data/learningContent';
import { CyberCard } from '../components/CyberCard';
import { ScreenHeader } from '../components/ScreenHeader';
import { COLORS, FONT_SIZE, RADIUS, SPACING } from '../theme';

export const LearningHubScreen: React.FC = () => {
  const [selected, setSelected] = useState<LearningArticle | null>(null);

  if (selected) {
    return (
      <ScrollView style={styles.container}>
        {/* Back button */}
        <TouchableOpacity style={styles.backBtn} onPress={() => setSelected(null)}>
          <Text style={styles.backText}>{'< BACK'}</Text>
        </TouchableOpacity>

        {/* Article header */}
        <View style={styles.articleHeader}>
          <Text style={styles.articleIcon}>{selected.icon}</Text>
          <View>
            <Text style={styles.articleTitle}>{selected.title}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.metaText}>{selected.category}</Text>
              <Text style={styles.dot}>·</Text>
              <Text style={styles.metaText}>{selected.readTime}</Text>
              <Text style={styles.dot}>·</Text>
              <Text style={[styles.metaText, { color: difficultyColor(selected.difficulty) }]}>
                {selected.difficulty}
              </Text>
            </View>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Content sections */}
        <View style={styles.articleBody}>
          {selected.content.map((section, i) => (
            <View key={i} style={styles.section}>
              <Text style={styles.heading}>{section.heading}</Text>
              <Text style={styles.body}>{section.body}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <ScreenHeader
        title="Learning Hub"
        subtitle="Cybersecurity education & guides"
        icon="📚"
        accent="#FF6B9D"
      />

      <View style={styles.listBody}>
        {LEARNING_ARTICLES.map((article) => (
          <TouchableOpacity
            key={article.id}
            onPress={() => setSelected(article)}
            activeOpacity={0.75}
          >
            <CyberCard style={styles.articleCard}>
              <View style={styles.cardRow}>
                <Text style={styles.cardIcon}>{article.icon}</Text>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{article.title}</Text>
                  <View style={styles.metaRow}>
                    <Text style={styles.metaText}>{article.category}</Text>
                    <Text style={styles.dot}>·</Text>
                    <Text style={styles.metaText}>{article.readTime}</Text>
                  </View>
                  <Text style={[styles.difficulty, { color: difficultyColor(article.difficulty) }]}>
                    {article.difficulty}
                  </Text>
                </View>
                <Text style={styles.arrow}>›</Text>
              </View>
            </CyberCard>
          </TouchableOpacity>
        ))}

        {/* Disclaimer */}
        <CyberCard style={styles.disclaimer} accent="none">
          <Text style={styles.disclaimerText}>
            ⚠️ All content is for educational purposes only. Only test systems you own or have explicit written permission to test.
          </Text>
        </CyberCard>
      </View>
    </ScrollView>
  );
};

function difficultyColor(d: string) {
  return d === 'Beginner' ? COLORS.cyberGreen : d === 'Intermediate' ? COLORS.cyberYellow : COLORS.cyberRed;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  listBody: { padding: SPACING.md, gap: SPACING.sm, paddingBottom: SPACING.xxl },

  articleCard: { marginBottom: SPACING.xs },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  cardIcon: { fontSize: 28 },
  cardContent: { flex: 1, gap: 3 },
  cardTitle: { color: COLORS.textPrimary, fontFamily: 'monospace', fontSize: FONT_SIZE.md, fontWeight: '700' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { color: COLORS.textSecondary, fontFamily: 'monospace', fontSize: FONT_SIZE.xs },
  dot: { color: COLORS.textMuted },
  difficulty: { fontFamily: 'monospace', fontSize: FONT_SIZE.xs, fontWeight: '700' },
  arrow: { color: COLORS.textMuted, fontSize: 22 },

  // Article view
  backBtn: { padding: SPACING.md, paddingBottom: 0 },
  backText: { color: COLORS.cyberGreen, fontFamily: 'monospace', fontSize: FONT_SIZE.sm },
  articleHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, padding: SPACING.md },
  articleIcon: { fontSize: 40 },
  articleTitle: { color: COLORS.textPrimary, fontFamily: 'monospace', fontSize: FONT_SIZE.xl, fontWeight: '700' },
  divider: { height: 1, backgroundColor: COLORS.borderDefault, marginHorizontal: SPACING.md },
  articleBody: { padding: SPACING.md, paddingBottom: SPACING.xxl, gap: SPACING.lg },
  section: { gap: SPACING.xs },
  heading: { color: COLORS.cyberGreen, fontFamily: 'monospace', fontSize: FONT_SIZE.md, fontWeight: '700', letterSpacing: 1 },
  body: { color: COLORS.textSecondary, fontFamily: 'monospace', fontSize: FONT_SIZE.sm, lineHeight: 22 },

  disclaimer: { marginTop: SPACING.md },
  disclaimerText: { color: COLORS.textMuted, fontFamily: 'monospace', fontSize: FONT_SIZE.xs, lineHeight: 18 },
});
