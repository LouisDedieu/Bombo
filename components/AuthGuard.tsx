/**
 * components/AuthGuard.tsx (React Native)
 *
 * Équivalent du AuthGuard React. Gère :
 * - Loading state (spinner)
 * - Network error (retry UI)
 * - Email pending (écran informatif)
 * - Unauthenticated (redirect vers Login)
 * - Password recovery (redirect vers ResetPassword)
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { WifiOff, RefreshCw, MailCheck } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import Loader from '@/components/Loader';

// ── Types ──────────────────────────────────────────────────────────────────────
export type RootStackParamList = {
  Login: undefined;
  ResetPassword: undefined;
  Main: undefined;
  Loading: undefined;
  NetworkError: { onRetry: () => void };
  EmailPending: undefined;
};

// ── Loading Screen ─────────────────────────────────────────────────────────────
export function LoadingScreen() {
  return (
    <View style={styles.container}>
      <Loader size={48} />
      <Text style={styles.loadingText}>Connexion en cours…</Text>
    </View>
  );
}

// ── Network Error Screen ───────────────────────────────────────────────────────
export function NetworkErrorScreen({ onRetry }: { onRetry: () => void }) {
  return (
    <View style={styles.container}>
      <View style={[styles.iconCircle, styles.iconCircleRed]}>
        <WifiOff size={24} color="#f87171" />
      </View>
      <Text style={styles.title}>Connexion impossible</Text>
      <Text style={styles.subtitle}>
        Impossible de joindre les serveurs. Vérifiez votre connexion internet.
      </Text>
      <TouchableOpacity style={styles.button} onPress={onRetry} activeOpacity={0.8}>
        <RefreshCw size={16} color="#ffffff" style={{ marginRight: 8 }} />
        <Text style={styles.buttonText}>Réessayer</Text>
      </TouchableOpacity>
    </View>
  );
}

// ── Email Pending Screen ───────────────────────────────────────────────────────
export function EmailPendingScreen() {
  const router = useRouter();
  
  return (
    <View style={styles.container}>
      <View style={[styles.iconCircle, styles.iconCircleBlue]}>
        <MailCheck size={24} color="#60a5fa" />
      </View>
      <Text style={styles.title}>Confirmez votre email</Text>
      <Text style={styles.subtitle}>
        Un email de confirmation vous a été envoyé. Cliquez sur le lien pour
        activer votre compte.
      </Text>
      <TouchableOpacity
        style={styles.ghostButton}
        onPress={() => router.replace('/login')}
        activeOpacity={0.7}
      >
        <Text style={styles.ghostButtonText}>Retour à la connexion</Text>
      </TouchableOpacity>
    </View>
  );
}

// ── AuthGuard Hook ─────────────────────────────────────────────────────────────
/**
 * Utilisé dans AppNavigator pour déterminer quel groupe d'écrans afficher.
 * Retourne le nom du "groupe" de navigation courant.
 */
export function useAuthGuardState(): {
  group: 'loading' | 'network_error' | 'email_pending' | 'auth' | 'main';
  isPasswordRecovery: boolean;
} {
  const { status, isPasswordRecovery } = useAuth();

  if (status === 'loading') return { group: 'loading', isPasswordRecovery };
  if (status === 'network_error') return { group: 'network_error', isPasswordRecovery };
  if (status === 'email_pending') return { group: 'email_pending', isPasswordRecovery };
  if (status === 'unauthenticated' || status === 'password_recovery') {
    return { group: 'auth', isPasswordRecovery };
  }
  // authenticated
  return { group: 'main', isPasswordRecovery };
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#71717a',
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  iconCircleRed: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  iconCircleBlue: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#71717a',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#27272a',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  ghostButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  ghostButtonText: {
    color: '#a1a1aa',
    fontSize: 14,
  },
});