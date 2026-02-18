/**
 * components/DebugPanel.tsx (React Native)
 *
 * Panneau de debug — visible uniquement en développement (__DEV__).
 * Équivalent du DebugPanel React conditionné par VITE_DEBUG.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function DebugPanel() {
  const { user, status, isPasswordRecovery } = useAuth();
  const [collapsed, setCollapsed] = useState(true);

  if (!__DEV__) return null;

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        onPress={() => setCollapsed((v) => !v)}
        style={styles.toggle}
        activeOpacity={0.8}
      >
        <Text style={styles.toggleText}>🛠 Debug {collapsed ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {!collapsed && (
        <ScrollView style={styles.panel}>
          <Row label="status" value={status} />
          <Row label="isPasswordRecovery" value={String(isPasswordRecovery)} />
          <Row label="user.id" value={user?.id ?? 'null'} />
          <Row label="user.email" value={user?.email ?? 'null'} />
          <Row label="emailConfirmed" value={String(user?.emailConfirmed ?? 'null')} />
        </ScrollView>
      )}
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 80,             // au-dessus de la tab bar
    left: 8,
    right: 8,
    zIndex: 9999,
  },
  toggle: {
    backgroundColor: '#1e1e2e',
    borderWidth: 1,
    borderColor: '#3b82f6',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  toggleText: {
    color: '#93c5fd',
    fontSize: 12,
    fontWeight: '600',
  },
  panel: {
    backgroundColor: '#1e1e2e',
    borderWidth: 1,
    borderColor: '#3b82f6',
    borderRadius: 6,
    padding: 10,
    marginTop: 4,
    maxHeight: 200,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#27272a',
  },
  label: {
    color: '#71717a',
    fontSize: 11,
    flex: 1,
  },
  value: {
    color: '#e4e4e7',
    fontSize: 11,
    flex: 1,
    textAlign: 'right',
  },
});