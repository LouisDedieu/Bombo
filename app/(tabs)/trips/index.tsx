/**
 * app/(tabs)/trips/index.tsx
 *
 * Route : /trips
 * Affiche les trips validés de l'utilisateur (user_saved_trips → trips)
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Image,
  Animated,
  Easing,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Map, MapPin, Calendar, Loader2, Bookmark } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { getUserSavedTrips } from '@/services/tripService';

// ── Type ──────────────────────────────────────────────────────────────────────

interface SavedTripRow {
  id: string;
  notes: string | null;
  created_at: string;
  trips: {
    id: string;
    trip_title: string;
    vibe: string | null;
    duration_days: number;
    thumbnail_url: string | null;
    source_url: string | null;
    content_creator_handle: string | null;
  } | null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function timeAgo(dateString: string): string {
  const diffDays = Math.floor(
    (Date.now() - new Date(dateString).getTime()) / 86_400_000
  );
  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return 'Hier';
  if (diffDays < 7)  return `Il y a ${diffDays} jours`;
  if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`;
  return `Il y a ${Math.floor(diffDays / 30)} mois`;
}

// ── SpinningLoader — équivalent <Loader2 className="animate-spin" /> ──────────

function SpinningLoader({ size = 32, color = '#60a5fa' }: { size?: number; color?: string }) {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = rotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <Animated.View style={{ transform: [{ rotate: spin }] }}>
      <Loader2 size={size} color={color} />
    </Animated.View>
  );
}

// ── TripCard — avec animation staggerée ───────────────────────────────────────
// web: motion.div initial { opacity:0, y:20 } → animate { opacity:1, y:0 }, delay index * 0.08s

function TripCard({
                    trip,
                    animIndex,
                    onPress,
                  }: {
  trip: SavedTripRow;
  animIndex: number;
  onPress: () => void;
}) {
  const t = trip.trips;
  if (!t) return null;

  // Entrée staggerée
  const opacity     = useRef(new Animated.Value(0)).current;
  const translateY  = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        delay: animIndex * 80, // 0.08s par index
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        delay: animIndex * 80,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      {/* web: bg-zinc-900 rounded-xl border border-zinc-800 hover:border-zinc-700 overflow-hidden */}
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        className="bg-zinc-900 rounded-xl overflow-hidden"
        style={{ borderWidth: 1, borderColor: '#27272a' }}
      >
        {/* ── Thumbnail ── */}
        {t.thumbnail_url ? (
          <View className="relative h-48 bg-zinc-800 overflow-hidden">
            <Image
              source={{ uri: t.thumbnail_url }}
              className="w-full h-full"
              resizeMode="cover"
            />
            {/*
             * web: bg-gradient-to-t from-black/70 to-transparent
             * RN: gradient approché par deux calques semi-transparents
             */}
            <View
              className="absolute inset-0"
              style={{ backgroundColor: 'rgba(0,0,0,0.70)' }}
            />
            <View className="absolute bottom-4 left-4 right-4">
              <Text className="text-xl font-bold text-white leading-tight" numberOfLines={2}>
                {t.trip_title}
              </Text>
              {t.vibe && (
                <Text className="text-xs text-zinc-300 mt-1">{t.vibe}</Text>
              )}
            </View>
          </View>
        ) : (
          /* Pas de thumbnail — web: p-4 pb-0 */
          <View className="p-4 pb-0">
            <Text className="text-xl font-bold text-white">{t.trip_title}</Text>
            {t.vibe && (
              <Text className="text-xs text-zinc-400 mt-1">{t.vibe}</Text>
            )}
          </View>
        )}

        {/* ── Infos ── */}
        <View className="p-4 gap-3">

          {/* Méta : durée + date + créateur */}
          <View className="flex-row items-center gap-4 flex-wrap">
            {t.duration_days > 0 && (
              <View className="flex-row items-center gap-1.5">
                <MapPin size={16} color="#60a5fa" /* blue-400 */ />
                <Text className="text-sm text-zinc-400">{t.duration_days} jours</Text>
              </View>
            )}
            <View className="flex-row items-center gap-1.5">
              <Calendar size={16} color="#71717a" /* zinc-400 */ />
              <Text className="text-sm text-zinc-400">{timeAgo(trip.created_at)}</Text>
            </View>
            {t.content_creator_handle && (
              <Text className="text-sm text-zinc-500">@{t.content_creator_handle}</Text>
            )}
          </View>

          {/* Notes utilisateur — web: text-xs text-zinc-500 italic border-t border-zinc-800 pt-2 */}
          {trip.notes && (
            <Text
              className="text-xs text-zinc-500 italic pt-2"
              style={{ borderTopWidth: 1, borderTopColor: '#27272a' }}
            >
              📝 {trip.notes}
            </Text>
          )}

          {/* Badge sauvegardé — web: Bookmark fill-green-400 + span text-green-400 */}
          <View className="flex-row items-center gap-1.5 pt-1">
            <Bookmark size={14} color="#4ade80" fill="#4ade80" /* green-400 */ />
            <Text className="text-xs text-green-400">Sauvegardé</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ── Composant principal ───────────────────────────────────────────────────────

export default function TripsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  const [rows,       setRows]       = useState<SavedTripRow[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error,      setError]      = useState<string | null>(null);

  const loadTrips = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    try {
      const data = await getUserSavedTrips(user.id);
      setRows(data as SavedTripRow[]);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => { loadTrips(); }, [loadTrips]);

  // Rechargement à chaque focus — cohérent avec le web (retour depuis review)
  useFocusEffect(useCallback(() => { loadTrips(); }, [loadTrips]));

  // ── États de chargement / erreur ──────────────────────────────────────────

  if (loading) {
    return (
      <View className="flex-1 bg-black items-center justify-center" style={{ paddingTop: insets.top }}>
        <SpinningLoader size={32} color="#60a5fa" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-black items-center justify-center" style={{ paddingTop: insets.top }}>
        <Text className="text-sm text-red-400">Erreur : {error}</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View className="flex-1 bg-black items-center justify-center" style={{ paddingTop: insets.top }}>
        <Text className="text-zinc-400">Connectez-vous pour voir vos voyages.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">

      {/* ── Liste ── */}
      <FlatList
        data={rows}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: insets.top + 16, paddingHorizontal: 16, paddingBottom: 16, gap: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); loadTrips(); }}
            tintColor="#60a5fa" /* blue-400 */
          />
        }
        renderItem={({ item, index }) => (
          <TripCard
            trip={item}
            animIndex={index}
            onPress={() => {
              if (item.trips) {
                router.push(`/(tabs)/trips/${item.trips.id}`);
              }
            }}
          />
        )}
        ListEmptyComponent={
          // web: motion.div initial opacity:0 y:20 → animate opacity:1 y:0
          <EmptyState />
        }
      />
    </View>
  );
}

// ── Empty state animé ─────────────────────────────────────────────────────────

function EmptyState() {
  const opacity    = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity,    { toValue: 1, duration: 300, easing: Easing.out(Easing.ease), useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 300, easing: Easing.out(Easing.ease), useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{ opacity, transform: [{ translateY }] }}
      className="items-center py-16"
    >
      {/* web: w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 */}
      <View className="w-20 h-20 bg-zinc-800 rounded-full items-center justify-center mb-4">
        <Map size={40} color="#52525b" /* zinc-600 */ />
      </View>
      <Text className="text-xl font-medium text-white mb-2">
        Aucun voyage pour le moment
      </Text>
      <Text className="text-zinc-400 text-center" style={{ maxWidth: 280 }}>
        Validez des vidéos depuis l'Inbox pour créer vos premiers itinéraires de voyage.
      </Text>
    </Animated.View>
  );
}