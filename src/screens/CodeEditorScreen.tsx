// src/screens/CodeEditorScreen.tsx
// Simple code editor with basic syntax highlighting via regex colorization

import React, { useState } from 'react';
import {
  View, Text, TextInput, ScrollView, StyleSheet,
  TouchableOpacity, Modal, Alert,
} from 'react-native';
import { ScreenHeader } from '../components/ScreenHeader';
import { CyberButton } from '../components/CyberButton';
import { CyberCard } from '../components/CyberCard';
import { COLORS, FONT_SIZE, SPACING, RADIUS } from '../theme';

// ── Starter snippets ───────────────────────────────────────────────────────
const SNIPPETS: Record<string, { lang: string; code: string }> = {
  'Port Scanner (Python)': {
    lang: 'python',
    code: `#!/usr/bin/env python3
"""
Educational port scanner — use only on systems you own.
"""
import socket

def scan_port(host: str, port: int) -> bool:
    """Return True if port is open."""
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(1)
        result = sock.connect_ex((host, port))
        sock.close()
        return result == 0
    except socket.error:
        return False

def scan_host(host: str, ports: range) -> list[int]:
    """Scan a range of ports on a host."""
    open_ports = []
    for port in ports:
        if scan_port(host, port):
            print(f"  [OPEN] {host}:{port}")
            open_ports.append(port)
    return open_ports

if __name__ == "__main__":
    target = input("Enter target IP (own device only): ")
    print(f"Scanning {target}...")
    open_ports = scan_host(target, range(1, 1025))
    print(f"Found {len(open_ports)} open ports.")
`,
  },
  'DNS Lookup (Python)': {
    lang: 'python',
    code: `#!/usr/bin/env python3
"""DNS record lookup using dnspython."""
import dns.resolver

def lookup(domain: str, record_type: str = "A"):
    """Fetch DNS records for a domain."""
    try:
        answers = dns.resolver.resolve(domain, record_type)
        for rdata in answers:
            print(f"  {record_type}: {rdata}")
    except dns.exception.DNSException as e:
        print(f"  Error: {e}")

if __name__ == "__main__":
    domain = input("Domain: ")
    for rtype in ["A", "AAAA", "MX", "TXT", "NS"]:
        print(f"\\n[{rtype} Records]")
        lookup(domain, rtype)
`,
  },
  'HTTP Header Inspector': {
    lang: 'python',
    code: `#!/usr/bin/env python3
"""Inspect HTTP response headers for security misconfigurations."""
import requests

SECURITY_HEADERS = [
    "Strict-Transport-Security",
    "Content-Security-Policy",
    "X-Frame-Options",
    "X-Content-Type-Options",
    "Referrer-Policy",
    "Permissions-Policy",
]

def check_headers(url: str):
    resp = requests.get(url, timeout=5)
    print(f"Status: {resp.status_code}")
    print("\\n[Security Headers]")
    for header in SECURITY_HEADERS:
        val = resp.headers.get(header)
        status = "✓" if val else "✗ MISSING"
        print(f"  {status}  {header}: {val or ''}")

if __name__ == "__main__":
    url = input("URL: ")
    check_headers(url)
`,
  },
  'Hello World (Bash)': {
    lang: 'bash',
    code: `#!/bin/bash
# X-Toolkit example script

echo "=== X-Toolkit Bash Example ==="
echo "Date: $(date)"
echo "Host: $(hostname)"
echo "IP:   $(hostname -I | awk '{print $1}')"

# Check if a host is reachable
ping_check() {
    local host=$1
    if ping -c 1 -W 1 "$host" &>/dev/null; then
        echo "  ✓ $host is reachable"
    else
        echo "  ✗ $host is unreachable"
    fi
}

echo ""
echo "[Connectivity Check]"
ping_check "8.8.8.8"
ping_check "1.1.1.1"
`,
  },
};

// ── Minimal syntax colorizer ───────────────────────────────────────────────
interface Token { text: string; color: string }

function tokenize(code: string, lang: string): Token[][] {
  const lines = code.split('\n');
  const keywords = lang === 'python'
    ? /\b(def|class|import|from|if|else|elif|for|while|return|try|except|with|as|in|not|and|or|True|False|None|print|input|range)\b/g
    : /\b(if|then|else|fi|for|while|do|done|echo|local|function|export|return|case|esac)\b/g;

  return lines.map((line) => {
    const tokens: Token[] = [];
    let remaining = line;

    // Comments
    const commentChar = lang === 'python' ? '#' : '#';
    const commentIdx = remaining.indexOf(commentChar);
    if (commentIdx === 0) {
      return [{ text: line, color: '#666699' }];
    }

    // Strings
    remaining = remaining.replace(/(["'`])(.*?)\1/g, (match) => {
      tokens.push({ text: match, color: '#FFD700' });
      return '\x00'.repeat(match.length);
    });

    // Keywords
    remaining = remaining.replace(keywords, (match) => {
      tokens.push({ text: match, color: COLORS.cyberCyan });
      return '\x00'.repeat(match.length);
    });

    // Numbers
    remaining = remaining.replace(/\b\d+\b/g, (match) => {
      tokens.push({ text: match, color: COLORS.cyberPurple });
      return '\x00'.repeat(match.length);
    });

    // Return plain text (simplified, not fully interleaved for RN)
    return [{ text: line, color: COLORS.textPrimary }];
  });
}

// ── Component ──────────────────────────────────────────────────────────────
export const CodeEditorScreen: React.FC = () => {
  const [code, setCode] = useState(SNIPPETS['Port Scanner (Python)'].code);
  const [lang, setLang] = useState('python');
  const [showPicker, setShowPicker] = useState(false);

  const loadSnippet = (name: string) => {
    const s = SNIPPETS[name];
    setCode(s.code);
    setLang(s.lang);
    setShowPicker(false);
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Code Editor"
        subtitle="View & edit security scripts"
        icon="✏️"
        accent={COLORS.cyberCyan}
      />

      {/* Toolbar */}
      <View style={styles.toolbar}>
        <TouchableOpacity style={styles.langBadge}>
          <Text style={styles.langText}>{lang.toUpperCase()}</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        <TouchableOpacity style={styles.toolBtn} onPress={() => setShowPicker(true)}>
          <Text style={styles.toolBtnText}>SNIPPETS</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.toolBtn}
          onPress={() => Alert.alert('Info', 'Code execution is not available in the simulator for safety. Copy the code to a local Python/Bash environment to run it.')}
        >
          <Text style={[styles.toolBtnText, { color: COLORS.cyberGreen }]}>▶ RUN</Text>
        </TouchableOpacity>
      </View>

      {/* Editor */}
      <ScrollView style={styles.editorScroll} horizontal>
        <ScrollView style={styles.editorInner}>
          <View style={styles.editorContainer}>
            {/* Line numbers */}
            <View style={styles.lineNumbers}>
              {code.split('\n').map((_, i) => (
                <Text key={i} style={styles.lineNum}>{i + 1}</Text>
              ))}
            </View>
            {/* Text input */}
            <TextInput
              style={styles.editor}
              value={code}
              onChangeText={setCode}
              multiline
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false}
              scrollEnabled={false}
            />
          </View>
        </ScrollView>
      </ScrollView>

      {/* Snippet picker modal */}
      <Modal visible={showPicker} transparent animationType="slide">
        <View style={styles.modalBg}>
          <CyberCard style={styles.modalCard}>
            <Text style={styles.modalTitle}>SELECT SNIPPET</Text>
            {Object.keys(SNIPPETS).map((name) => (
              <TouchableOpacity
                key={name}
                style={styles.snippetItem}
                onPress={() => loadSnippet(name)}
              >
                <Text style={styles.snippetName}>{name}</Text>
                <Text style={styles.snippetLang}>{SNIPPETS[name].lang}</Text>
              </TouchableOpacity>
            ))}
            <CyberButton label="CANCEL" onPress={() => setShowPicker(false)} variant="outline" />
          </CyberCard>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },

  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
    gap: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderDefault,
  },
  langBadge: {
    backgroundColor: COLORS.cyberCyan + '22',
    borderWidth: 1,
    borderColor: COLORS.cyberCyan + '66',
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
  },
  langText: { color: COLORS.cyberCyan, fontFamily: 'monospace', fontSize: FONT_SIZE.xs, fontWeight: '700' },
  toolBtn: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
  },
  toolBtnText: { color: COLORS.textSecondary, fontFamily: 'monospace', fontSize: FONT_SIZE.xs },

  editorScroll: { flex: 1 },
  editorInner: { flex: 1 },
  editorContainer: { flexDirection: 'row', flex: 1, minWidth: '100%' },
  lineNumbers: {
    paddingHorizontal: SPACING.sm,
    paddingTop: SPACING.sm,
    backgroundColor: COLORS.bgCard,
    alignItems: 'flex-end',
    minWidth: 40,
  },
  lineNum: { color: COLORS.textMuted, fontFamily: 'monospace', fontSize: FONT_SIZE.sm, lineHeight: 22 },
  editor: {
    flex: 1,
    color: COLORS.textPrimary,
    fontFamily: 'monospace',
    fontSize: FONT_SIZE.sm,
    lineHeight: 22,
    padding: SPACING.sm,
    textAlignVertical: 'top',
    minHeight: 600,
  },

  modalBg: { flex: 1, backgroundColor: '#00000088', justifyContent: 'flex-end' },
  modalCard: { margin: SPACING.md, gap: SPACING.sm },
  modalTitle: { color: COLORS.cyberGreen, fontFamily: 'monospace', fontSize: FONT_SIZE.sm, fontWeight: '700', letterSpacing: 2, marginBottom: SPACING.sm },
  snippetItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderDefault,
  },
  snippetName: { color: COLORS.textPrimary, fontFamily: 'monospace', fontSize: FONT_SIZE.sm },
  snippetLang: { color: COLORS.cyberCyan, fontFamily: 'monospace', fontSize: FONT_SIZE.xs },
});
