import { PostHog } from 'posthog-node';
import { Platform } from 'react-native';

let posthog: PostHog | null = null;

export function initPostHog(): PostHog {
  if (posthog) return posthog;

  const apiKey = process.env.EXPO_PUBLIC_POSTHOG_API_KEY;

  if (!apiKey || apiKey === 'phc_your_api_key_here') {
    console.warn('[PostHog] API key not configured - analytics disabled');
    return null as any;
  }

  posthog = new PostHog(apiKey, {
    host: 'https://app.posthog.com',
    flushAt: 1,
    flushInterval: 1000,
  });

  console.log('[PostHog] Initialized successfully');
  return posthog;
}

export function getPostHog(): PostHog {
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
  if (!ph) return;

  ph.capture({
    event: 'link_click',
    properties: {
      utm_source: params.utm_source,
      utm_medium: params.utm_medium,
      utm_campaign: params.utm_campaign,
      utm_content: params.utm_content,
      platform: Platform.OS,
    },
  });
}

export function captureSignupStart(utmParams?: {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
}): void {
  const ph = getPostHog();
  if (!ph) return;

  ph.capture({
    event: 'signup_start',
    properties: utmParams || {},
  });
}

export function captureSignupComplete(userId: string): void {
  const ph = getPostHog();
  if (!ph) return;

  ph.capture({
    event: 'signup_complete',
    properties: {
      user_id: userId,
    },
  });
}

export function captureFirstAnalysis(userId: string): void {
  const ph = getPostHog();
  if (!ph) return;

  ph.capture({
    event: 'first_analysis',
    properties: {
      user_id: userId,
    },
  });
}

export function captureAnalysisStart(userId: string): void {
  const ph = getPostHog();
  if (!ph) return;

  ph.capture({
    event: 'analysis_start',
    properties: {
      user_id: userId,
    },
  });
}

export function captureTripCreated(userId: string, tripId: string): void {
  const ph = getPostHog();
  if (!ph) return;

  ph.capture({
    event: 'trip_created',
    properties: {
      user_id: userId,
      trip_id: tripId,
    },
  });
}

export function captureCitySaved(userId: string, cityId: string): void {
  const ph = getPostHog();
  if (!ph) return;

  ph.capture({
    event: 'city_saved',
    properties: {
      user_id: userId,
      city_id: cityId,
    },
  });
}

export async function shutdownPostHog(): Promise<void> {
  if (posthog) {
    await posthog.shutdown();
    posthog = null;
  }
}