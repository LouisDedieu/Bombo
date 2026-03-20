import * as SecureStore from 'expo-secure-store';
import { supabase } from './supabase';

export async function clearJwtFromSharedStorage(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync('supabase_jwt', {
      accessGroup: 'group.com.onedaytravel.mobile.shared',
    });
    await SecureStore.deleteItemAsync('supabase_user_id', {
      accessGroup: 'group.com.onedaytravel.mobile.shared',
    });
    console.log('[syncJwt] Cleared JWT from shared storage');
  } catch (e: any) {
    console.log('[syncJwt] Error clearing:', e?.message || e);
  }
}

export async function syncJwtToSharedStorage(): Promise<void> {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    console.log('[syncJwt] Session user id:', session?.user?.id);

    if (!session?.access_token) {
      console.log('[syncJwt] No access token, skipping');
      return;
    }

    await SecureStore.setItemAsync('supabase_jwt', session.access_token, {
      accessGroup: 'group.com.onedaytravel.mobile.shared',
    });
    console.log('[syncJwt] JWT saved');

    // Also store user_id for the share extension
    if (session.user?.id) {
      await SecureStore.setItemAsync('supabase_user_id', session.user.id, {
        accessGroup: 'group.com.onedaytravel.mobile.shared',
      });
      console.log('[syncJwt] User ID saved:', session.user.id);
    }
  } catch (e: any) {
    console.log('[syncJwt] Error:', e?.message || e);
  }
}
