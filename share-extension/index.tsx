import { useEffect, useState } from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import { close, Text, View, type InitialProps } from 'expo-share-extension';
import * as SecureStore from 'expo-secure-store';

const API_BASE: string =
  process.env.EXPO_PUBLIC_API_BASE ?? 'http://localhost:8000';

type Status = 'loading' | 'success' | 'error' | 'unsupported';

const SUPPORTED_HOSTS = [
  'youtube.com',
  'youtu.be',
  'tiktok.com',
  'instagram.com',
  'vimeo.com',
];

function isSupportedUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return SUPPORTED_HOSTS.some((h) => hostname.includes(h));
  } catch {
    return false;
  }
}

export default function ShareScreen({ url }: InitialProps) {
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    handleShare();
  }, []);

  const handleShare = async () => {
    if (!url || !isSupportedUrl(url)) {
      setStatus('unsupported');
      setTimeout(() => close(), 1500);
      return;
    }

    try {
      const jwt = await SecureStore.getItemAsync('supabase_jwt', {
        accessGroup: 'group.com.anonymous.BomboMobile.shared',
      });

      if (!jwt) {
        setStatus('error');
        setTimeout(() => close(), 1500);
        return;
      }

      const response = await fetch(`${API_BASE}/analyze/url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) throw new Error('API error');
      const { job_id } = await response.json();
      console.log('Analysis job started:', job_id);
      setStatus('success');
    } catch {
      setStatus('error');
    } finally {
      setTimeout(() => close(), 1500);
    }
  };

  const config = {
    loading: { label: 'Analyse en cours...', color: '#60a5fa' },
    success: { label: 'Ajoute a votre inbox !', color: '#34d399' },
    error: { label: 'Erreur, reessayez.', color: '#f87171' },
    unsupported: { label: 'Lien non supporte.', color: '#a1a1aa' },
  }[status];

  return (
    <View style={styles.container}>
      {status === 'loading' ? (
        <ActivityIndicator size="large" color="#60a5fa" />
      ) : (
        <Text style={styles.icon}>
          {status === 'success' ? 'OK' : status === 'error' ? 'X' : '-'}
        </Text>
      )}
      <Text style={[styles.label, { color: config.color }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090b',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  icon: {
    fontSize: 36,
    color: '#ffffff',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
  },
});
