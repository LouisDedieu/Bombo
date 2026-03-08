/**
 * app/(tabs)/trips/index.tsx
 *
 * Route: /trips (now labeled "Saved")
 * Displays user's saved items (trips and cities) with filter tabs
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Image,
  ImageBackground,
  Animated,
  Easing,
  Alert,
  Platform,
} from 'react-native';
import { Navbar } from '@/components/navigation/Navbar';
import Loader from '@/components/Loader';
import { colors } from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Constants from 'expo-constants';

// Check if using native tabs (iOS 26+) which handles safe area automatically
const isExpoGo = Constants.appOwnership === 'expo';
const useNativeTabs = Platform.OS === 'ios' && parseInt(String(Platform.Version), 10) >= 26 && !isExpoGo;
import { useRouter } from 'expo-router';
import {
  Map,
  MapPin,
  Calendar,
  Bookmark,
  Trash2,
  Building2,
  Star,
} from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { deleteTrip } from '@/services/tripService';
import { deleteCity } from '@/services/cityService';
import {
  getUserSavedItems,
  SavedItem,
  getEntityAccentColor,
} from '@/services/savedService';

// -- Helpers ------------------------------------------------------------------

function timeAgo(dateString: string): string {
  const diffDays = Math.floor(
    (Date.now() - new Date(dateString).getTime()) / 86_400_000
  );
  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return 'Hier';
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`;
  return `Il y a ${Math.floor(diffDays / 30)} mois`;
}


// -- Filter type (without 'all') ----------------------------------------------

type FilterType = 'trip' | 'city';

// -- EntityCard ---------------------------------------------------------------

function EntityCard({
  item,
  onPress,
  onDelete,
}: {
  item: SavedItem;
  onPress: () => void;
  onDelete: () => void;
}) {
  const isCity = item.entity_type === 'city';
  const accentColor = getEntityAccentColor(item.entity_type);

  const handleDelete = () => {
    Alert.alert(
      'Supprimer definitivement ?',
      `Ce ${isCity ? 'guide' : 'voyage'} sera supprime de facon permanente.`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', style: 'destructive', onPress: onDelete },
      ]
    );
  };

  return (
    <View>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        className="bg-zinc-900 rounded-xl overflow-hidden"
        style={{
          borderWidth: 1,
          borderColor: '#27272a',
          borderLeftWidth: 4,
          borderLeftColor: accentColor,
        }}
      >
        {/* Thumbnail */}
        {item.thumbnail_url ? (
          <View className="relative h-48 bg-zinc-800 overflow-hidden">
            <Image
              source={{ uri: item.thumbnail_url }}
              className="w-full h-full"
              resizeMode="cover"
            />
            <View
              className="absolute inset-0"
              style={{ backgroundColor: 'rgba(0,0,0,0.70)' }}
            />
            <View className="absolute bottom-4 left-4 right-4">
              {/* Entity type badge */}
              <View
                className="self-start px-2 py-0.5 rounded-full mb-2"
                style={{ backgroundColor: `${accentColor}33` }}
              >
                <Text style={{ color: accentColor, fontSize: 10, fontWeight: '600' }}>
                  {isCity ? 'City Guide' : 'Trip'}
                </Text>
              </View>
              <Text
                className="text-xl font-bold text-white leading-tight"
                numberOfLines={2}
              >
                {item.title}
              </Text>
              {item.subtitle && (
                <Text className="text-xs text-zinc-300 mt-1">{item.subtitle}</Text>
              )}
            </View>
          </View>
        ) : (
          <View className="p-4 pb-0">
            {/* Entity type badge */}
            <View
              className="self-start px-2 py-0.5 rounded-full mb-2"
              style={{ backgroundColor: `${accentColor}33` }}
            >
              <Text style={{ color: accentColor, fontSize: 10, fontWeight: '600' }}>
                {isCity ? 'City Guide' : 'Trip'}
              </Text>
            </View>
            <Text className="text-xl font-bold text-white">{item.title}</Text>
            {item.subtitle && (
              <Text className="text-xs text-zinc-400 mt-1">{item.subtitle}</Text>
            )}
          </View>
        )}

        {/* Info section */}
        <View className="p-4 gap-3">
          <View className="flex-row items-center gap-4 flex-wrap">
            {/* Duration or highlights count */}
            {isCity && item.highlights_count ? (
              <View className="flex-row items-center gap-1.5">
                <Star size={16} color={accentColor} />
                <Text className="text-sm text-zinc-400">
                  {item.highlights_count} highlights
                </Text>
              </View>
            ) : item.duration_days ? (
              <View className="flex-row items-center gap-1.5">
                <MapPin size={16} color={accentColor} />
                <Text className="text-sm text-zinc-400">{item.duration_days} jours</Text>
              </View>
            ) : null}

            {/* Date */}
            <View className="flex-row items-center gap-1.5">
              <Calendar size={16} color="#71717a" />
              <Text className="text-sm text-zinc-400">{timeAgo(item.created_at)}</Text>
            </View>

            {/* Creator */}
            {item.content_creator_handle && (
              <Text className="text-sm text-zinc-500">
                @{item.content_creator_handle}
              </Text>
            )}
          </View>

          {/* User notes */}
          {item.notes && (
            <Text
              className="text-xs text-zinc-500 italic pt-2"
              style={{ borderTopWidth: 1, borderTopColor: '#27272a' }}
            >
              {item.notes}
            </Text>
          )}

          {/* Footer */}
          <View className="flex-row items-center justify-between pt-1">
            <View className="flex-row items-center gap-1.5">
              <Bookmark size={14} color="#4ade80" fill="#4ade80" />
              <Text className="text-xs text-green-400">Sauvegarde</Text>
            </View>
            <TouchableOpacity
              onPress={handleDelete}
              className="p-2 -mr-2"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Trash2 size={18} color="#71717a" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

// -- Main Component -----------------------------------------------------------

export default function SavedPage() {
  const router = useRouter();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  const [filter, setFilter] = useState<FilterType>('trip');
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  // Cache items per filter
  const [tripItems, setTripItems] = useState<SavedItem[]>([]);
  const [cityItems, setCityItems] = useState<SavedItem[]>([]);
  const [tripLoaded, setTripLoaded] = useState(false);
  const [cityLoaded, setCityLoaded] = useState(false);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get current items based on filter
  const items = filter === 'trip' ? tripItems : cityItems;

  const loadItems = useCallback(
    async (pageNum: number, append = false, forceFilter?: FilterType) => {
      const targetFilter = forceFilter ?? filter;
      const targetSetItems = targetFilter === 'trip' ? setTripItems : setCityItems;
      const targetSetLoaded = targetFilter === 'trip' ? setTripLoaded : setCityLoaded;

      if (!user) {
        setInitialLoading(false);
        return;
      }
      try {
        const response = await getUserSavedItems(user.id, targetFilter, pageNum, 20);
        if (append) {
          targetSetItems((prev) => [...prev, ...response.items]);
        } else {
          targetSetItems(response.items);
        }
        setHasMore(response.has_more);
        targetSetLoaded(true);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setInitialLoading(false);
        setFilterLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    [user, filter]
  );

  // Initial load (trip)
  useEffect(() => {
    if (user && !tripLoaded) {
      setPage(1);
      loadItems(1, false, 'trip');
    } else if (!user) {
      setInitialLoading(false);
    }
  }, [user]);


  // Handle tab change
  const handleTabChange = (index: number) => {
    setActiveTabIndex(index);
    const newFilter: FilterType = index === 0 ? 'trip' : 'city';
    if (newFilter !== filter) {
      setFilter(newFilter);
      setPage(1);
      setHasMore(true);

      // Only load if not already loaded
      const alreadyLoaded = newFilter === 'trip' ? tripLoaded : cityLoaded;
      if (!alreadyLoaded) {
        setFilterLoading(true);
        loadItems(1, false, newFilter);
      }
    }
  };

  // Load more (infinite scroll)
  const handleLoadMore = () => {
    // Don't trigger if list is too short (less than a full page)
    if (items.length < 20) return;
    if (!hasMore || loadingMore || filterLoading) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    loadItems(nextPage, true, filter);
  };

  // Refresh (pull-to-refresh)
  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    loadItems(1, false, filter);
  };

  // Delete handler
  const handleDelete = async (item: SavedItem) => {
    try {
      if (item.entity_type === 'city') {
        await deleteCity(item.entity_id);
        setCityItems((prev) => prev.filter((i) => i.id !== item.id));
      } else {
        await deleteTrip(item.entity_id);
        setTripItems((prev) => prev.filter((i) => i.id !== item.id));
      }
    } catch (err) {
      Alert.alert('Erreur', 'Impossible de supprimer.');
    }
  };

  // Navigation handler
  const handlePress = (item: SavedItem) => {
    if (item.entity_type === 'city') {
      router.push(`/(tabs)/trips/city/${item.entity_id}`);
    } else {
      router.push(`/(tabs)/trips/${item.entity_id}`);
    }
  };

  // Initial loading state (only on first load)
  if (initialLoading) {
    return (
      <ImageBackground
        source={require('@/assets/images/bg-gradient.png')}
        className="flex-1"
        resizeMode="cover"
      >
        <View
          className="flex-1 items-center justify-center"
          style={{ paddingTop: insets.top }}
        >
          <Loader size={72} />
        </View>
      </ImageBackground>
    );
  }

  // Error state
  if (error && items.length === 0) {
    return (
      <ImageBackground
        source={require('@/assets/images/bg-gradient.png')}
        className="flex-1"
        resizeMode="cover"
      >
        <View
          className="flex-1 items-center justify-center"
          style={{ paddingTop: insets.top }}
        >
          <Text className="text-sm text-error">Erreur : {error}</Text>
        </View>
      </ImageBackground>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <ImageBackground
        source={require('@/assets/images/bg-gradient.png')}
        className="flex-1"
        resizeMode="cover"
      >
        <View
          className="flex-1 items-center justify-center"
          style={{ paddingTop: insets.top }}
        >
          <Text className="text-text-secondary">Connectez-vous pour voir vos sauvegardes.</Text>
        </View>
      </ImageBackground>
    );
  }

  const navbarTabs = [
    { icon: 'signpost-line', label: 'Trip', badge: tripItems.length },
    { icon: 'building-line', label: 'City', badge: cityItems.length },
  ];

  return (
    <ImageBackground
      source={require('@/assets/images/bg-gradient.png')}
      className="flex-1"
      resizeMode="cover"
    >
      {/* Header */}
      <View style={{ paddingTop: insets.top + 16, paddingHorizontal: 16 }}>
        {/* Title */}
        <View className="flex-row mb-4">
          <Text className="font-righteous text-hero text-text-primary">
            Ta{' '}
          </Text>
          <Text
            className="font-righteous text-hero text-accent"
            style={{
              textShadowColor: colors.shadowDark,
              textShadowOffset: { width: 0, height: 4 },
              textShadowRadius: 4,
            }}
          >
            collection.
          </Text>
        </View>

        {/* Navbar */}
        <Navbar
          tabs={navbarTabs}
          activeIndex={activeTabIndex}
          onTabChange={handleTabChange}
          variant="secondary"
          size="default"
        />
      </View>

      {/* List */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: insets.bottom + 120,
          gap: 16,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.textPrimary}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        renderItem={({ item }) => (
          <EntityCard
            item={item}
            onPress={() => handlePress(item)}
            onDelete={() => handleDelete(item)}
          />
        )}
        ListEmptyComponent={
          filterLoading ? (
            <View className="items-center py-16">
              <Loader size={72} />
            </View>
          ) : (
            <EmptyState filter={filter} />
          )
        }
        ListFooterComponent={
          loadingMore ? (
            <View className="py-4 items-center">
              <Loader size={48} />
            </View>
          ) : null
        }
      />
    </ImageBackground>
  );
}

// -- Empty State --------------------------------------------------------------

function EmptyState({ filter }: { filter: FilterType }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const isCity = filter === 'city';
  const Icon = isCity ? Building2 : Map;
  const title = isCity ? 'Aucun guide de ville' : 'Aucun voyage';
  const subtitle = isCity
    ? "Analysez des videos de type 'city guide' pour decouvrir des villes."
    : "Analysez des videos de voyage pour creer des itineraires.";

  return (
    <Animated.View
      style={{ opacity, transform: [{ translateY }] }}
      className="items-center py-16"
    >
      <View className="w-20 h-20 bg-bg-primary/50 rounded-full items-center justify-center mb-4">
        <Icon size={40} color={colors.textMuted} />
      </View>
      <Text className="text-xl font-dmsans-medium text-text-primary mb-2">{title}</Text>
      <Text className="text-text-secondary text-center" style={{ maxWidth: 280 }}>
        {subtitle}
      </Text>
    </Animated.View>
  );
}
