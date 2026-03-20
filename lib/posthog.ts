import PostHog from 'posthog-react-native';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

let posthog: PostHog | null = null;

export function initPostHog(): PostHog | null {
  if (posthog) return posthog;

  const apiKey = process.env.EXPO_PUBLIC_POSTHOG_API_KEY;

  console.log('[PostHog] Checking API key:', apiKey ? 'FOUND' : 'NOT FOUND');

  if (!apiKey || apiKey === 'phc_your_api_key_here') {
    console.warn('[PostHog] API key not configured - analytics disabled');
    return null;
  }

  posthog = new PostHog(apiKey, {
    host: 'https://app.posthog.com',
  });

  console.log('[PostHog] Initialized successfully with key:', apiKey.substring(0, 10) + '...');
  return posthog;
}

export function getPostHog(): PostHog | null {
  if (!posthog) {
    return initPostHog();
  }
  return posthog;
}

export function captureLinkClick(params: {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
}): void {
  const ph = getPostHog();
  if (!ph) {
    console.log('[PostHog] captureLinkClick: PostHog not initialized');
    return;
  }

  ph.capture('link_click', {
    utm_source: params.utm_source,
    utm_medium: params.utm_medium,
    utm_campaign: params.utm_campaign,
    utm_content: params.utm_content,
    platform: Platform.OS,
  });
  
  console.log('[PostHog] captureLinkClick: Event sent!', params);
}

export function captureSignupStart(utmParams?: {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
}): void {
  const ph = getPostHog();
  if (!ph) return;

  ph.capture('signup_start', utmParams || {});
}

export function captureSignupComplete(userId: string): void {
  const ph = getPostHog();
  if (!ph) return;

  ph.capture('signup_complete', {
    user_id: userId,
  });
}

export function captureFirstAnalysis(userId: string): void {
  const ph = getPostHog();
  if (!ph) return;

  ph.capture('first_analysis', {
    user_id: userId,
  });
}

export function captureAnalysisStart(userId: string): void {
  const ph = getPostHog();
  if (!ph) return;

  ph.capture('analysis_start', {
    user_id: userId,
  });
}

export function captureTripCreated(userId: string, tripId: string): void {
  const ph = getPostHog();
  if (!ph) return;

  ph.capture('trip_created', {
    user_id: userId,
    trip_id: tripId,
  });
}

export function captureCitySaved(userId: string, cityId: string): void {
  const ph = getPostHog();
  if (!ph) return;

  ph.capture('city_saved', {
    user_id: userId,
    city_id: cityId,
  });
}

export async function shutdownPostHog(): Promise<void> {
  if (posthog) {
    posthog = null;
  }
}

export function testPostHogCapture(): void {
  const ph = getPostHog();
  if (!ph) {
    console.log('[PostHog] Not initialized - cannot test');
    return;
  }
  
  ph.capture('test_event', {
    test: 'debug',
    timestamp: new Date().toISOString(),
  });
  
  console.log('[PostHog] Test event sent!');
}