/**
 * pages/ResetPassword.tsx
 *
 * Shown when user arrives via password recovery email link.
 * Supabase fires PASSWORD_RECOVERY event which sets isPasswordRecovery=true in AuthContext.
 * AuthGuard redirects here automatically.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react-native';
import { useAuth } from "@/context/AuthContext";
import { Button } from '@/components/Button';

// ─── Strength bar colors (hardcoded Tailwind equivalents) ─────────────────────
// Dynamic class interpolation is purged by NativeWind JIT, so we use static hex values.
// Mirrors web: ['bg-red-500','bg-orange-500','bg-yellow-500','bg-blue-500','bg-emerald-500']
const STRENGTH_BAR_COLORS: Record<number, string> = {
  1: '#ef4444', // red-500
  2: '#f97316', // orange-500
  3: '#eab308', // yellow-500
  4: '#3b82f6', // blue-500
};

// ─── Password strength indicator ─────────────────────────────────────────────

function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;

  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^a-zA-Z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;

  return (
    <View className="flex-row gap-1 mt-1.5">
      {[0, 1, 2, 3].map((i) => (
        <View
          key={i}
          className="h-1 flex-1 rounded-full"
          style={{ backgroundColor: i < score ? STRENGTH_BAR_COLORS[score] : '#27272a' /* zinc-800 */ }}
        />
      ))}
    </View>
  );
}

// ─── Success screen ───────────────────────────────────────────────────────────

function SuccessScreen() {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale   = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.spring(scale,   { toValue: 1, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View className="flex-1 items-center justify-center p-4">
      <Animated.View style={{ opacity, transform: [{ scale }] }} className="items-center gap-4">
        {/* web: w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 */}
        <View
          className="w-16 h-16 rounded-full items-center justify-center"
          style={{
            backgroundColor: '#22c55e1a', // emerald-500 / 10 %
            borderWidth: 1,
            borderColor: '#22c55e33',     // emerald-500 / 20 %
          }}
        >
          <ShieldCheck size={28} color="#4ade80" /* emerald-400 */ />
        </View>

        <View className="items-center gap-1">
          <Text className="text-xl font-bold text-white">Mot de passe mis à jour !</Text>
          <Text className="text-sm text-zinc-500">Redirection en cours…</Text>
        </View>
      </Animated.View>
    </View>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ResetPassword() {
  const router = useRouter();
  const { updatePassword, clearPasswordRecovery } = useAuth();

  const [password,        setPassword]        = useState('');
  const [confirm,         setConfirm]         = useState('');
  const [showPass,        setShowPass]        = useState(false);
  const [loading,         setLoading]         = useState(false);
  const [error,           setError]           = useState<string | null>(null);
  const [success,         setSuccess]         = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmFocused,  setConfirmFocused]  = useState(false);

  const confirmHasError = !!confirm && confirm !== password;

  const handleSubmit = async () => {
    setError(null);

    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);
    const { error: updateError } = await updatePassword(password);
    setLoading(false);

    if (updateError) {
      setError(
        updateError.message.includes('expired')
          ? 'Ce lien a expiré. Demandez un nouveau lien de réinitialisation.'
          : updateError.message,
      );
    } else {
      setSuccess(true);
      setTimeout(() => {
        clearPasswordRecovery();
        router.replace('/');
      }, 2000);
    }
  };

  if (success) return <SuccessScreen />;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* web: min-h-screen flex items-center justify-center p-4 */}
        <View className="flex-1 items-center justify-center p-4">

          {/* web: w-full max-w-sm */}
          <View className="w-full max-w-sm">

            {/* ── Logo / heading ── */}
            <View className="items-center mb-8">
              {/* web: inline-flex w-12 h-12 rounded-2xl bg-blue-600 mb-4 shadow-lg shadow-blue-600/30 */}
              <View
                className="w-12 h-12 rounded-2xl bg-blue-600 items-center justify-center mb-4"
                style={{
                  shadowColor: '#2563eb', // blue-600
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.3,
                  shadowRadius: 16,
                  elevation: 8,
                }}
              >
                <ShieldCheck size={24} color="#ffffff" />
              </View>
              <Text className="text-2xl font-bold text-white">Nouveau mot de passe</Text>
              <Text className="text-sm text-zinc-500 mt-1">Choisissez un mot de passe sécurisé.</Text>
            </View>

            {/* ── Card ── */}
            <View className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 gap-4">

              {/* Password field */}
              <View className="gap-1.5">
                <Text className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
                  Nouveau mot de passe
                </Text>
                <View className="relative">
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPass}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    placeholderTextColor="#52525b" /* zinc-600 */
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    className="bg-zinc-900 rounded-lg px-3.5 py-2.5 pr-10 text-sm text-white"
                    style={{
                      borderWidth: 1,
                      // web: focus:border-blue-500/60  focus:ring-2 focus:ring-blue-500/30
                      borderColor: passwordFocused ? '#3b82f699' : '#27272a', // blue-500/60 : zinc-800
                    }}
                  />
                  {/* web: absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 */}
                  <Pressable
                    onPress={() => setShowPass((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    hitSlop={8}
                    accessibilityLabel={showPass ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  >
                    {showPass
                      ? <EyeOff size={16} color="#52525b" /* zinc-600 */ />
                      : <Eye    size={16} color="#52525b" /* zinc-600 */ />}
                  </Pressable>
                </View>
                <PasswordStrength password={password} />
              </View>

              {/* Confirm field */}
              <View className="gap-1.5">
                <Text className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
                  Confirmer le mot de passe
                </Text>
                <TextInput
                  value={confirm}
                  onChangeText={setConfirm}
                  secureTextEntry={!showPass}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  placeholderTextColor="#52525b" /* zinc-600 */
                  onFocus={() => setConfirmFocused(true)}
                  onBlur={() => setConfirmFocused(false)}
                  className="bg-zinc-900 rounded-lg px-3.5 py-2.5 text-sm text-white"
                  style={{
                    borderWidth: 1,
                    // web: error → border-red-500/60 focus:ring-red-500/30
                    //      normal → border-zinc-800 focus:border-blue-500/60
                    borderColor: confirmHasError
                      ? '#ef444499'   // red-500 / 60 %
                      : confirmFocused
                        ? '#3b82f699' // blue-500 / 60 %
                        : '#27272a',  // zinc-800
                  }}
                />
                {confirmHasError && (
                  <Text className="text-xs text-red-400">
                    Les mots de passe ne correspondent pas.
                  </Text>
                )}
              </View>

              {/* Error banner – web: flex items-start gap-2.5 bg-red-500/10 border border-red-500/20 */}
              {error && (
                <View
                  className="flex-row items-start rounded-lg px-3.5 py-3 gap-2.5"
                  style={{
                    backgroundColor: '#ef44441a', // red-500 / 10 %
                    borderWidth: 1,
                    borderColor: '#ef444433',      // red-500 / 20 %
                  }}
                >
                  <Text className="text-sm text-red-400 flex-1">{error}</Text>
                </View>
              )}

              {/* Submit button – web: w-full bg-blue-600 hover:bg-blue-500 h-10 mt-1 */}
              <Button onPress={handleSubmit} loading={loading} className="mt-1">
                {loading ? (
                  <View className="flex-row items-center gap-2">
                    <Loader2 size={16} color="#ffffff" />
                    <Text className="text-white font-medium">Mise à jour…</Text>
                  </View>
                ) : (
                  'Mettre à jour le mot de passe'
                )}
              </Button>

            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}