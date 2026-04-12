// src/navigation/AppNavigator.tsx
// Navigation: Bottom tabs (Home, Scan, Learn, Tools) + stack navigators

import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { HomeScreen }          from '../screens/HomeScreen';
import { DNSCheckerScreen }    from '../screens/DNSCheckerScreen';
import { URLScannerScreen }    from '../screens/URLScannerScreen';
import { APKScannerScreen }    from '../screens/APKScannerScreen';
import { DeviceScanScreen }    from '../screens/DeviceScanScreen';
import { SystemInfoScreen }    from '../screens/SystemInfoScreen';
import { LearningHubScreen }   from '../screens/LearningHubScreen';
import { TerminalScreen }      from '../screens/TerminalScreen';
import { CodeEditorScreen }    from '../screens/CodeEditorScreen';
import { CommandLibraryScreen } from '../screens/CommandLibraryScreen';

import { COLORS } from '../theme';

// ── Stack: Scan tools ──────────────────────────────────────────────────────
const ScanStack = createNativeStackNavigator();
const ScanNavigator = () => (
  <ScanStack.Navigator screenOptions={stackOpts}>
    <ScanStack.Screen name="DNSChecker"  component={DNSCheckerScreen}  options={{ title: 'DNS Checker' }} />
    <ScanStack.Screen name="URLScanner"  component={URLScannerScreen}  options={{ title: 'URL Scanner' }} />
    <ScanStack.Screen name="APKScanner"  component={APKScannerScreen}  options={{ title: 'APK Scanner' }} />
    <ScanStack.Screen name="DeviceScan"  component={DeviceScanScreen}  options={{ title: 'Device Scan' }} />
    <ScanStack.Screen name="SystemInfo"  component={SystemInfoScreen}  options={{ title: 'System Info' }} />
  </ScanStack.Navigator>
);

// ── Stack: Learn ───────────────────────────────────────────────────────────
const LearnStack = createNativeStackNavigator();
const LearnNavigator = () => (
  <LearnStack.Navigator screenOptions={stackOpts}>
    <LearnStack.Screen name="LearningHub" component={LearningHubScreen} options={{ title: 'Learning Hub' }} />
  </LearnStack.Navigator>
);

// ── Stack: Tools ───────────────────────────────────────────────────────────
const ToolStack = createNativeStackNavigator();
const ToolNavigator = () => (
  <ToolStack.Navigator screenOptions={stackOpts}>
    <ToolStack.Screen name="Terminal"       component={TerminalScreen}       options={{ title: 'Terminal' }} />
    <ToolStack.Screen name="CodeEditor"     component={CodeEditorScreen}     options={{ title: 'Code Editor' }} />
    <ToolStack.Screen name="CommandLibrary" component={CommandLibraryScreen} options={{ title: 'Command Library' }} />
  </ToolStack.Navigator>
);

// ── Root stack (for Home → any screen via navigation.navigate) ─────────────
const RootStack = createNativeStackNavigator();
const HomeStackNavigator = () => (
  <RootStack.Navigator screenOptions={stackOpts}>
    <RootStack.Screen name="Home"           component={HomeScreen}          options={{ headerShown: false }} />
    {/* All sub-screens accessible from Home dashboard */}
    <RootStack.Screen name="DNSChecker"     component={DNSCheckerScreen}    options={{ title: 'DNS Checker' }} />
    <RootStack.Screen name="URLScanner"     component={URLScannerScreen}    options={{ title: 'URL Scanner' }} />
    <RootStack.Screen name="APKScanner"     component={APKScannerScreen}    options={{ title: 'APK Scanner' }} />
    <RootStack.Screen name="DeviceScan"     component={DeviceScanScreen}    options={{ title: 'Device Scan' }} />
    <RootStack.Screen name="SystemInfo"     component={SystemInfoScreen}    options={{ title: 'System Info' }} />
    <RootStack.Screen name="LearningHub"    component={LearningHubScreen}   options={{ title: 'Learning Hub' }} />
    <RootStack.Screen name="Terminal"       component={TerminalScreen}      options={{ title: 'Terminal' }} />
    <RootStack.Screen name="CodeEditor"     component={CodeEditorScreen}    options={{ title: 'Code Editor' }} />
    <RootStack.Screen name="CommandLibrary" component={CommandLibraryScreen} options={{ title: 'Command Library' }} />
  </RootStack.Navigator>
);

// ── Bottom Tab Navigator ───────────────────────────────────────────────────
const Tab = createBottomTabNavigator();

export const AppNavigator: React.FC = () => (
  <NavigationContainer>
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: COLORS.cyberGreen,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{ title: 'Home', tabBarIcon: ({ color }) => <TabIcon label="⌂" color={color} /> }}
      />
      <Tab.Screen
        name="ScanTab"
        component={ScanNavigator}
        options={{ title: 'Scan', tabBarIcon: ({ color }) => <TabIcon label="🔍" color={color} /> }}
      />
      <Tab.Screen
        name="LearnTab"
        component={LearnNavigator}
        options={{ title: 'Learn', tabBarIcon: ({ color }) => <TabIcon label="📚" color={color} /> }}
      />
      <Tab.Screen
        name="ToolsTab"
        component={ToolNavigator}
        options={{ title: 'Tools', tabBarIcon: ({ color }) => <TabIcon label="⚙️" color={color} /> }}
      />
    </Tab.Navigator>
  </NavigationContainer>
);

const TabIcon: React.FC<{ label: string; color: string }> = ({ label, color }) => (
  <Text style={{ fontSize: 18, color }}>{label}</Text>
);

// ── Shared screen options ──────────────────────────────────────────────────
const stackOpts = {
  headerStyle: { backgroundColor: COLORS.bgCard },
  headerTintColor: COLORS.cyberGreen,
  headerTitleStyle: { fontFamily: 'monospace', fontWeight: '700' as const, letterSpacing: 1 },
  contentStyle: { backgroundColor: COLORS.bg },
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.bgCard,
    borderTopColor: COLORS.borderDefault,
    borderTopWidth: 1,
    height: 60,
    paddingBottom: 8,
  },
  tabLabel: {
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
