// App.tsx — Entry point for X-Toolkit
// React Native + Expo cross-platform (Android APK + Web via IP)

import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, View } from 'react-native';
import { AppNavigator } from './src/navigation/AppNavigator';
import { COLORS } from './src/theme';

// Optional: set up push notifications
// import * as Notifications from 'expo-notifications';

export default function App() {
  useEffect(() => {
    // Future: register push notification permissions here
  }, []);

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <View style={styles.container}>
          {/* Dark status bar to match cyberpunk theme */}
          <StatusBar style="light" backgroundColor={COLORS.bg} />
          <AppNavigator />
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
});
