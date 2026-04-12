// src/screens/TerminalScreen.tsx
// Educational Linux-like terminal simulator

import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, ScrollView, StyleSheet,
  TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native';
import { executeCommand } from '../data/terminalCommands';
import { useAppStore } from '../store/useAppStore';
import { ScreenHeader } from '../components/ScreenHeader';
import { COLORS, FONT_SIZE, SPACING } from '../theme';

export const TerminalScreen: React.FC = () => {
  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const scrollRef = useRef<ScrollView>(null);

  const lines = useAppStore((s) => s.terminalHistory);
  const addLine = useAppStore((s) => s.addTerminalLine);
  const clearTerminal = useAppStore((s) => s.clearTerminal);

  const submit = () => {
    const cmd = input.trim();
    if (!cmd) return;

    // Echo command
    addLine(`> ${cmd}`);
    setCmdHistory((h) => [cmd, ...h]);
    setHistoryIdx(-1);
    setInput('');

    // Execute
    const result = executeCommand(cmd);

    if (result.output.includes('__CLEAR__')) {
      clearTerminal();
    } else {
      result.output.forEach((line) => addLine(line));
      addLine(''); // blank separator
    }

    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
  };

  const navigateHistory = (dir: 'up' | 'down') => {
    const newIdx = dir === 'up'
      ? Math.min(historyIdx + 1, cmdHistory.length - 1)
      : Math.max(historyIdx - 1, -1);
    setHistoryIdx(newIdx);
    setInput(newIdx === -1 ? '' : cmdHistory[newIdx]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <ScreenHeader
          title="Terminal"
          subtitle="Educational Linux-like shell simulator"
          icon="⌨️"
        />

        {/* Output */}
        <ScrollView
          ref={scrollRef}
          style={styles.output}
          contentContainerStyle={styles.outputContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
        >
          {lines.map((line, i) => (
            <Text
              key={i}
              style={[
                styles.line,
                line.startsWith('>') && styles.cmdLine,
                line.startsWith('bash:') && styles.errorLine,
              ]}
              selectable
            >
              {line}
            </Text>
          ))}
        </ScrollView>

        {/* History nav */}
        <View style={styles.historyNav}>
          <TouchableOpacity style={styles.navBtn} onPress={() => navigateHistory('up')}>
            <Text style={styles.navText}>▲</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navBtn} onPress={() => navigateHistory('down')}>
            <Text style={styles.navText}>▼</Text>
          </TouchableOpacity>
        </View>

        {/* Input row */}
        <View style={styles.inputRow}>
          <Text style={styles.prompt}>xora@x-toolkit:~$</Text>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={submit}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="send"
            placeholder="type command..."
            placeholderTextColor={COLORS.textMuted}
            blurOnSubmit={false}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={submit}>
            <Text style={styles.sendText}>↵</Text>
          </TouchableOpacity>
        </View>

        {/* Quick commands */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.quickBar}
          contentContainerStyle={styles.quickContent}
        >
          {['help', 'ls', 'ifconfig', 'whoami', 'ps', 'date', 'clear'].map((cmd) => (
            <TouchableOpacity
              key={cmd}
              style={styles.quickBtn}
              onPress={() => { setInput(cmd); }}
            >
              <Text style={styles.quickText}>{cmd}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: COLORS.bg },

  output: { flex: 1, paddingHorizontal: SPACING.md },
  outputContent: { paddingBottom: SPACING.sm },
  line: {
    color: COLORS.textSecondary,
    fontFamily: 'monospace',
    fontSize: FONT_SIZE.sm,
    lineHeight: 20,
  },
  cmdLine: { color: COLORS.cyberGreen },
  errorLine: { color: COLORS.cyberRed },

  historyNav: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
    paddingBottom: 4,
  },
  navBtn: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    borderRadius: 4,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
  },
  navText: { color: COLORS.textSecondary, fontSize: FONT_SIZE.xs },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderAccent,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    gap: SPACING.xs,
  },
  prompt: {
    color: COLORS.cyberGreen,
    fontFamily: 'monospace',
    fontSize: FONT_SIZE.xs,
  },
  input: {
    flex: 1,
    color: COLORS.textPrimary,
    fontFamily: 'monospace',
    fontSize: FONT_SIZE.sm,
    paddingVertical: 4,
  },
  sendBtn: {
    backgroundColor: COLORS.cyberGreen,
    borderRadius: 4,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
  },
  sendText: { color: '#000', fontFamily: 'monospace', fontWeight: '700' },

  quickBar: {
    maxHeight: 38,
    backgroundColor: COLORS.bgElevated,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderDefault,
  },
  quickContent: { paddingHorizontal: SPACING.sm, gap: SPACING.xs, alignItems: 'center' },
  quickBtn: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    borderRadius: 4,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
  },
  quickText: { color: COLORS.cyberGreen, fontFamily: 'monospace', fontSize: FONT_SIZE.xs },
});
