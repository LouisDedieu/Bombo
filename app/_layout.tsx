import '../styles/global.css';

import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ImageBackground, Platform } from 'react-native';
import { Toaster } from 'sonner-native';
import { AuthProvider } from '@/context/AuthContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { useAuthGuardState, LoadingScreen, NetworkErrorScreen, EmailPendingScreen } from '@/components/AuthGuard';
import DebugPanel from '../components/DebugPanel';
import { useCallback, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { syncJwtToSharedStorage, clearJwtFromSharedStorage } from '@/lib/syncJwtToSharedStorage';
import { useAndroidShareHandler } from '@/hooks/useAndroidShareHandler';
import { useFonts, Righteous_400Regular } from '@expo-google-fonts/righteous';
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import * as SplashScreen from 'expo-splash-screen';
import {AnalysisProvider} from "@/context/AnalysisContext";
import { initPostHog } from '@/lib/posthog';
import { useUTMTracking } from '@/hooks/useUTMTracking';
import { initI18n } from '../src/i18n/index';

SplashScreen.preventAutoHideAsync();

function AuthGate({ onRetry, onReady }: { onRetry: () => void; onReady: () => void }) {
  const { group, isPasswordRecovery } = useAuthGuardState();
  const router = useRouter();
  const segments = useSegments();

  const currentSegment = segments[0];
  const onAuthRoute = currentSegment === 'login' || currentSegment === 'reset-password';
  const onProtectedRoute = currentSegment === '(tabs)' || currentSegment === 'review';

  // Determine if we need to redirect (user is on wrong route for their auth state)
  const needsRedirectToLogin = group === 'auth' && !onAuthRoute;
  const needsRedirectToResetPassword = group === 'main' && isPasswordRecovery && currentSegment !== 'reset-password';
  const needsRedirectToHome = group === 'main' && !onProtectedRoute && !isPasswordRecovery;
  const isRedirecting = needsRedirectToLogin || needsRedirectToResetPassword || needsRedirectToHome;

  // Hide splash screen only when auth is determined AND we're on the correct route
  useEffect(() => {
    if (group !== 'loading' && !isRedirecting) {
      onReady();
    }
  }, [group, isRedirecting, onReady]);

  // Handle navigation redirects
  useEffect(() => {
    if (group === 'loading') return;
    if (group === 'network_error') return;
    if (group === 'email_pending') return;

    if (needsRedirectToLogin) {
      router.replace('/login');
    } else if (needsRedirectToResetPassword) {
      router.replace('/reset-password');
    } else if (needsRedirectToHome) {
      router.replace('/');
    }
  }, [group, needsRedirectToLogin, needsRedirectToResetPassword, needsRedirectToHome]);

  // Show loading screen while loading OR while redirecting
  if (group === 'loading' || isRedirecting) return <LoadingScreen />;
  if (group === 'network_error') return <NetworkErrorScreen onRetry={onRetry} />;
  if (group === 'email_pending') return <EmailPendingScreen />;

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' } }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="review/[tripId]" />
      <Stack.Screen name="login" />
      <Stack.Screen name="reset-password" />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  const [retryKey, setRetryKey] = useState(0);
  const [i18nReady, setI18nReady] = useState(false);
  const handleRetry = useCallback(() => setRetryKey((k) => k + 1), []);

  // Init i18n (runs once)
  useEffect(() => {
    initI18n()
      .then(() => setI18nReady(true))
      .catch((err) => {
        console.error('[i18n] init failed:', err);
        setI18nReady(true);
      });
  }, []);

  // Load custom fonts
  const [fontsLoaded] = useFonts({
    Righteous: Righteous_400Regular,
    DMSans: DMSans_400Regular,
    'DMSans-Medium': DMSans_500Medium,
    'DMSans-SemiBold': DMSans_600SemiBold,
    'DMSans-Bold': DMSans_700Bold,
  });

  // Callback to hide splash screen once fonts, i18n, AND auth are ready
  const hideSplashScreen = useCallback(() => {
    if (fontsLoaded && i18nReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, i18nReady]);

  // Sync JWT to shared storage for iOS Share Extension
  useEffect(() => {
    if (Platform.OS !== 'ios') return;

    syncJwtToSharedStorage().catch(() => {});

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.access_token) {
        syncJwtToSharedStorage().catch(() => {});
      } else if (event === 'SIGNED_OUT') {
        clearJwtFromSharedStorage().catch(() => {});
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Handle Android share intent
  useAndroidShareHandler();

  // Track UTM parameters from deep links
  useUTMTracking();

  // Initialize PostHog analytics
  useEffect(() => {
    initPostHog();
  }, []);

  // Don't render until fonts and i18n are ready
  if (!fontsLoaded || !i18nReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ImageBackground
        source={require('../assets/images/bg-gradient.png')}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <StatusBar style="light" />
        <AuthProvider key={retryKey}>
          <NotificationProvider>
            <AnalysisProvider>
              <AuthGate onRetry={handleRetry} onReady={hideSplashScreen} />
              <Toaster position="top-center" />
              {process.env.EXPO_PUBLIC_DEV_MODE === 'true' && <DebugPanel />}
            </AnalysisProvider>
          </NotificationProvider>
        </AuthProvider>
      </ImageBackground>
    </SafeAreaProvider>
  );
}