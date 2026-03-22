/**
 * DayDetailView - Daily view for a trip day
 *
 * Reuses the same layout and interactions as CityDetailPage
 * but works with DbSpot data from a trip day.
 */

import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { SecondaryButton, type ColorScheme } from '@/components/SecondaryButton';
import { TicketCard, type CategoryType } from '@/components/TicketCard';
import { SpotFormModal } from '@/components/trip/SpotFormModal';
import { HighlightCategory } from '@/types/api';
import { updateSpot, deleteSpot, type SpotUpdatePayload } from '@/services/reviewService';
import Icon from 'react-native-remix-icon';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DbSpot {
  id: string;
  name: string;
  spot_type: string | null;
  address: string | null;
  duration_minutes: number | null;
  price_range: string | null;
  price_detail: string | null;
  tips: string | null;
  highlight: boolean;
  latitude: number | null;
  longitude: number | null;
  google_place_id: string | null;
  spot_order: number;
  verified: boolean;
  source_city_id: string | null;
  city_highlight_id: string | null;
  _synced_from_highlight?: boolean;
}

export interface DbDay {
  id: string;
  day_number: number;
  location: string | null;
  theme: string | null;
  accommodation_name: string | null;
  spots: DbSpot[];
  linked_city_id: string | null;
}

interface DayDetailViewProps {
  day: DbDay;
  onRefresh: () => void;
  highlightedSpotId: string | null;
  onHighlightChange: (id: string | null) => void;
}

// ---------------------------------------------------------------------------
// Category Mappings
// ---------------------------------------------------------------------------

const SPOT_TYPE_TO_CATEGORY: Record<string, HighlightCategory> = {
  restaurant: 'food',
  food: 'food',
  café: 'food',
  cafe: 'food',
  bar: 'nightlife',
  club: 'nightlife',
  nightclub: 'nightlife',
  museum: 'culture',
  monument: 'culture',
  gallery: 'culture',
  historic: 'culture',
  park: 'nature',
  garden: 'nature',
  beach: 'nature',
  hiking: 'nature',
  shop: 'shopping',
  market: 'shopping',
  mall: 'shopping',
  boutique: 'shopping',
};

const CATEGORY_TO_COLOR_SCHEME: Record<HighlightCategory, ColorScheme> = {
  food: 'restaurant',
  culture: 'culture',
  nature: 'nature',
  shopping: 'shopping',
  nightlife: 'nightlife',
  other: 'location',
};

const CATEGORY_ICONS: Record<HighlightCategory, string> = {
  food: 'restaurant-line',
  culture: 'bank-line',
  nature: 'hand-heart-line',
  shopping: 'shopping-bag-line',
  nightlife: 'moon-line',
  other: 'map-pin-line',
};

function mapSpotTypeToCategory(spotType: string | null): HighlightCategory {
  if (!spotType) return 'other';
  const lower = spotType.toLowerCase();
  return SPOT_TYPE_TO_CATEGORY[lower] || 'other';
}

// ---------------------------------------------------------------------------
// DayDetailView Component
// ---------------------------------------------------------------------------

export function DayDetailView({ day, onRefresh, highlightedSpotId, onHighlightChange }: DayDetailViewProps) {
  const { t } = useTranslation();
  const spots = useMemo(() => day.spots || [], [day.spots]);

  // Filter state
  const [selectedCategories, setSelectedCategories] = useState<HighlightCategory[]>([]);
  const [selectedMustSee, setSelectedMustSee] = useState<boolean | null>(null);

  // Edit state
  const [editingSpot, setEditingSpot] = useState<DbSpot | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Partial<Record<HighlightCategory, number>> = {};
    spots.forEach(spot => {
      const cat = mapSpotTypeToCategory(spot.spot_type);
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [spots]);

  const availableCategories = useMemo(
    () => Object.keys(categoryCounts) as HighlightCategory[],
    [categoryCounts]
  );

  const mustSeeCount = useMemo(
    () => spots.filter(s => s.highlight).length,
    [spots]
  );

  // Filter spots
  const filteredSpots = useMemo(() => {
    let result = spots;

    if (selectedMustSee === true) {
      result = result.filter(s => s.highlight);
    }

    if (selectedCategories.length > 0) {
      result = result.filter(s =>
        selectedCategories.includes(mapSpotTypeToCategory(s.spot_type))
      );
    }

    return result;
  }, [spots, selectedCategories, selectedMustSee]);

  // Show filters only if there's meaningful data
  const showFilters = spots.length >= 3;
  const showCategoryFilters = availableCategories.length > 1;

  // Toggle functions
  const toggleCategory = useCallback((cat: HighlightCategory) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  }, []);

  const toggleMustSee = useCallback(() => {
    setSelectedMustSee(prev => (prev === true ? null : true));
  }, []);

  // Action handlers
  const handleOpenMap = useCallback((spot: DbSpot) => {
    const lat = spot.latitude;
    const lon = spot.longitude;

    if (lat && lon) {
      const label = encodeURIComponent(spot.name);
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${lat},${lon}&query_place_id=${label}`);
    } else if (spot.address) {
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spot.address)}`);
    } else {
      Alert.alert(t('cityDetail.error'), t('cityDetail.noLocationForPoint'));
    }
  }, [t]);

  const handleOpenEdit = useCallback((spot: DbSpot) => {
    setEditingSpot(spot);
    setShowEditModal(true);
  }, []);

  const handleDeleteSpot = useCallback((spotId: string) => {
    const spot = spots.find(s => s.id === spotId);
    if (!spot) return;

    Alert.alert(
      t('cityDetail.delete'),
      t('cityDetail.deleteConfirmMessage'),
      [
        { text: t('cityDetail.cancel'), style: 'cancel' },
        {
          text: t('cityDetail.deleteConfirm'),
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteSpot(spotId);
              onRefresh();
            } catch (err) {
              console.error('Delete error:', err);
              Alert.alert(t('cityDetail.error'), t('cityDetail.cannotDeletePoint'));
            }
          },
        },
      ]
    );
  }, [spots, t, onRefresh]);

  const handleSaveEdit = useCallback(async (payload: SpotUpdatePayload) => {
    if (!editingSpot) return;

    setIsSaving(true);
    try {
      await updateSpot(editingSpot.id, payload);
      setShowEditModal(false);
      setEditingSpot(null);
      onRefresh();
    } catch (err) {
      console.error('Update error:', err);
      Alert.alert(t('cityDetail.error'), t('cityDetail.cannotEditPoint'));
    } finally {
      setIsSaving(false);
    }
  }, [editingSpot, t, onRefresh]);

  // Day header
  const dayTitle = day.theme || day.location || t('tripDetail.day', { number: day.day_number });

  return (
    <View style={{ flex: 1 }}>
      {/* Day header */}
      <View className="mb-4">
        <Text
          style={{
            fontFamily: 'Righteous',
            fontSize: 18,
            color: '#FAFAFF',
          }}
        >
          {dayTitle}
        </Text>
        {day.accommodation_name && (
          <View className="flex-row items-center mt-2" style={{ gap: 6 }}>
            <Icon name="hotel-line" size={14} color="rgba(255, 255, 255, 0.5)" />
            <Text
              style={{
                fontFamily: 'DMSans',
                fontSize: 12,
                color: 'rgba(255, 255, 255, 0.5)',
              }}
            >
              {day.accommodation_name}
            </Text>
          </View>
        )}
      </View>

      {/* Category Filters */}
      {showFilters && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingBottom: 16 }}
          style={{ marginHorizontal: -16, paddingHorizontal: 16 }}
        >
          {/* Must See Filter */}
          {mustSeeCount > 0 && (
            <SecondaryButton
              title={String(mustSeeCount)}
              leftIcon="star-line"
              colorScheme="mustsee"
              active={selectedMustSee === true}
              onPress={toggleMustSee}
            />
          )}
          {/* Category Filters */}
          {showCategoryFilters && availableCategories.map((cat) => {
            const count = categoryCounts[cat];
            const isActive = selectedCategories.includes(cat);
            return (
              <SecondaryButton
                key={cat}
                title={String(count)}
                leftIcon={CATEGORY_ICONS[cat]}
                colorScheme={CATEGORY_TO_COLOR_SCHEME[cat]}
                active={isActive}
                onPress={() => toggleCategory(cat)}
              />
            );
          })}
        </ScrollView>
      )}

      {/* Spots List */}
      {filteredSpots.length === 0 ? (
        <View className="empty-state" style={{ paddingVertical: 40 }}>
          <Icon name="map-pin-line" size={32} color="#52525b" style={{ opacity: 0.4 }} />
          <Text className="text-sm text-zinc-500 mt-2 font-dmsans">
            {t('cityDetail.noPointsFound')}
          </Text>
        </View>
      ) : (
        <View style={{ gap: 12 }}>
          {filteredSpots.map((spot) => {
            const category = mapSpotTypeToCategory(spot.spot_type) as CategoryType;
            const isHighlighted = highlightedSpotId === spot.id;

            return (
              <TouchableOpacity
                key={spot.id}
                activeOpacity={0.8}
                onPress={() => onHighlightChange(isHighlighted ? null : spot.id)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'stretch',
                  gap: 8,
                  borderRadius: 12,
                  borderWidth: isHighlighted ? 1.5 : 0,
                  borderColor: isHighlighted ? 'rgba(82, 72, 212, 0.6)' : 'transparent',
                  backgroundColor: isHighlighted ? 'rgba(82, 72, 212, 0.15)' : 'transparent',
                  padding: isHighlighted ? 4 : 0,
                }}
              >
                <View style={{ flex: 1 }}>
                  <TicketCard
                    category={category}
                    title={spot.name}
                    price={
                      spot.price_range === 'free' || spot.price_range === 'gratuit'
                        ? 'free'
                        : spot.price_range
                          ? parseInt(spot.price_range.replace(/[^0-9]/g, '')) || 0
                          : 0
                    }
                    tags={spot.spot_type ? [spot.spot_type] : []}
                    description={spot.tips || t('cityDetail.noDescription')}
                    tip={spot.duration_minutes ? `${spot.duration_minutes} min` : undefined}
                    isMustSee={spot.highlight}
                    colorScheme={CATEGORY_TO_COLOR_SCHEME[mapSpotTypeToCategory(spot.spot_type)]}
                  />
                </View>

                {/* Action buttons */}
                <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'space-evenly' }}>
                  <TouchableOpacity
                    onPress={() => handleOpenMap(spot)}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Icon name="navigation-line" size={17} color="#1084FE" style={{ transform: [{ scaleX: -1 }] }} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleOpenEdit(spot)}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Icon name="pencil-line" size={17} color="rgba(255, 255, 255, 0.4)" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeleteSpot(spot.id)}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Icon name="delete-bin-line" size={17} color="rgba(255, 144, 144, 0.4)" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Edit Modal */}
      {showEditModal && editingSpot && (
        <SpotFormModal
          visible={showEditModal}
          spot={editingSpot}
          onClose={() => {
            setShowEditModal(false);
            setEditingSpot(null);
          }}
          onSave={handleSaveEdit}
          isSaving={isSaving}
        />
      )}
    </View>
  );
}
