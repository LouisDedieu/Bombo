import { useEffect } from 'react';
import * as Linking from 'expo-linking';
import { captureLinkClick } from '@/lib/posthog';

interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
}

function parseUTMParams(url: string): UTMParams | null {
  try {
    const parsedUrl = new URL(url);
    const params: UTMParams = {};

    if (parsedUrl.searchParams.get('utm_source')) {
      params.utm_source = parsedUrl.searchParams.get('utm_source') || undefined;
    }
    if (parsedUrl.searchParams.get('utm_medium')) {
      params.utm_medium = parsedUrl.searchParams.get('utm_medium') || undefined;
    }
    if (parsedUrl.searchParams.get('utm_campaign')) {
      params.utm_campaign = parsedUrl.searchParams.get('utm_campaign') || undefined;
    }
    if (parsedUrl.searchParams.get('utm_content')) {
      params.utm_content = parsedUrl.searchParams.get('utm_content') || undefined;
    }

    return Object.keys(params).length > 0 ? params : null;
  } catch {
    return null;
  }
}

export function useUTMTracking() {
  useEffect(() => {
    const handleInitialURL = async () => {
      const initialURL = await Linking.getInitialURL();
      
      if (initialURL) {
        const utmParams = parseUTMParams(initialURL);
        if (utmParams && utmParams.utm_source) {
          console.log('[UTM] Initial URL detected:', utmParams);
          captureLinkClick(utmParams as any);
        }
      }
    };

    handleInitialURL();

    const subscription = Linking.addEventListener('url', (event) => {
      const utmParams = parseUTMParams(event.url);
      
      if (utmParams && utmParams.utm_source) {
        console.log('[UTM] Deep link detected:', utmParams);
        captureLinkClick(utmParams as any);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);
}

export function getUTMParamsFromUrl(url: string): UTMParams | null {
  return parseUTMParams(url);
}