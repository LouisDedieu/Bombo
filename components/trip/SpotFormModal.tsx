/**
 * SpotFormModal - Modal for creating and editing trip spots
 * Similar to HighlightFormModal but for DbSpot
 */
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, StyleSheet, Switch } from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-remix-icon';
import { HighlightCategory, HIGHLIGHT_CATEGORIES } from '@/types/api';
import { PrimaryButton } from '@/components/PrimaryButton';
import { SecondaryButton, type ColorScheme } from '@/components/SecondaryButton';
import type { SpotUpdatePayload, CreateSpotPayload } from '@/services/reviewService';
import { CATEGORY_TO_SPOT_TYPE, SPOT_TYPE_TO_CATEGORY } from '@/constants/spotTypes';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface DbSpot {
  id: string;
  name: string;
  spot_type: string | null;
  address: string | null;
  duration_minutes: number | null;
  price_range: string | null;
  tips: string | null;
  highlight: boolean;
}

interface SpotFormModalProps {
  visible: boolean;
  spot?: DbSpot; // Optional for create mode
  onClose: () => void;
  onSave: (payload: SpotUpdatePayload) => Promise<void>;
  onCreate?: (payload: Omit<CreateSpotPayload, 'day_id'>) => Promise<void>;
  isSaving: boolean;
  mode?: 'edit' | 'create';
}

// ---------------------------------------------------------------------------
// Category Mapping (uses shared constants from @/constants/spotTypes)
// ---------------------------------------------------------------------------

const CATEGORY_TO_COLOR_SCHEME: Record<HighlightCategory, ColorScheme> = {
  food: 'restaurant',
  culture: 'culture',
  nature: 'nature',
  shopping: 'shopping',
  nightlife: 'nightlife',
  other: 'default',
};

// Note: CATEGORY_TO_SPOT_TYPE and SPOT_TYPE_TO_CATEGORY are imported from @/constants/spotTypes

const getCategoryLabel = (cat: HighlightCategory, t: (key: string) => string): string => {
  switch (cat) {
    case 'food': return t('spotReview.restaurant');
    case 'culture': return t('spotReview.attraction');
    case 'nature': return t('spotReview.activity');
    case 'shopping': return t('spotReview.shopping');
    case 'nightlife': return t('spotReview.bar');
    case 'other': return t('spotReview.other');
    default: return cat;
  }
};

function getCategory(spotType: string | null): HighlightCategory {
  if (!spotType) return 'other';
  const category = SPOT_TYPE_TO_CATEGORY[spotType.toLowerCase()];
  return (category as HighlightCategory) || 'other';
}

// ---------------------------------------------------------------------------
// SpotFormModal Component
// ---------------------------------------------------------------------------

export function SpotFormModal({
  visible,
  spot,
  onClose,
  onSave,
  onCreate,
  isSaving,
  mode = 'edit',
}: SpotFormModalProps) {
  const { t } = useTranslation();
  const isCreateMode = mode === 'create';

  // Form state
  const [name, setName] = useState(spot?.name || '');
  const [category, setCategory] = useState<HighlightCategory>(getCategory(spot?.spot_type || null));
  const [address, setAddress] = useState(spot?.address || '');
  const [tips, setTips] = useState(spot?.tips || '');
  const [priceRange, setPriceRange] = useState(spot?.price_range || '');
  const [durationMinutes, setDurationMinutes] = useState(spot?.duration_minutes?.toString() || '');
  const [isHighlight, setIsHighlight] = useState(spot?.highlight || false);

  // Reset form when spot changes or modal opens
  useEffect(() => {
    if (visible) {
      if (isCreateMode) {
        setName('');
        setCategory('other');
        setAddress('');
        setTips('');
        setPriceRange('');
        setDurationMinutes('');
        setIsHighlight(false);
      } else if (spot) {
        setName(spot.name);
        setCategory(getCategory(spot.spot_type));
        setAddress(spot.address || '');
        setTips(spot.tips || '');
        setPriceRange(spot.price_range || '');
        setDurationMinutes(spot.duration_minutes?.toString() || '');
        setIsHighlight(spot.highlight);
      }
    }
  }, [spot, visible, isCreateMode]);

  const handleSave = async () => {
    if (isCreateMode && onCreate) {
      const createPayload: Omit<CreateSpotPayload, 'day_id'> = {
        name: name.trim(),
        spot_type: CATEGORY_TO_SPOT_TYPE[category],
        address: address.trim() || undefined,
        tips: tips.trim() || undefined,
        price_range: priceRange.trim() || undefined,
        duration_minutes: durationMinutes ? parseInt(durationMinutes, 10) : undefined,
        highlight: isHighlight,
      };
      await onCreate(createPayload);
    } else {
      const updatePayload: SpotUpdatePayload = {
        name: name.trim(),
        spot_type: CATEGORY_TO_SPOT_TYPE[category],
        address: address.trim() || null,
        tips: tips.trim() || null,
        price_range: priceRange.trim() || null,
        duration_minutes: durationMinutes ? parseInt(durationMinutes, 10) : null,
        highlight: isHighlight,
      };
      await onSave(updatePayload);
    }
  };

  const canSubmit = name.trim().length > 0;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {isCreateMode ? t('cityDetail.addPoint') : t('cityDetail.editPoint')}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close-line" size={22} color="rgba(255, 255, 255, 0.5)" />
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Name */}
            <View>
              <Text style={styles.label}>{t('highlightReview.name')} *</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder={t('spotReview.name')}
                placeholderTextColor="rgba(255, 255, 255, 0.3)"
                style={styles.input}
              />
            </View>

            {/* Category */}
            <View>
              <Text style={styles.label}>{t('highlightReview.category')}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.categoryRow}>
                  {(Object.keys(HIGHLIGHT_CATEGORIES) as HighlightCategory[]).map((cat) => {
                    const isSelected = category === cat;
                    return (
                      <SecondaryButton
                        key={cat}
                        title={getCategoryLabel(cat, t)}
                        active={isSelected}
                        colorScheme={CATEGORY_TO_COLOR_SCHEME[cat]}
                        variant="pill"
                        size="sm"
                        onPress={() => setCategory(cat)}
                      />
                    );
                  })}
                </View>
              </ScrollView>
            </View>

            {/* Address */}
            <View>
              <Text style={styles.label}>{t('spotReview.address')}</Text>
              <TextInput
                value={address}
                onChangeText={setAddress}
                placeholder={t('highlightReview.optional')}
                placeholderTextColor="rgba(255, 255, 255, 0.3)"
                style={styles.input}
              />
            </View>

            {/* Price Range */}
            <View>
              <Text style={styles.label}>{t('highlightReview.priceRange')}</Text>
              <TextInput
                value={priceRange}
                onChangeText={setPriceRange}
                placeholder="ex: 15-25€, free..."
                placeholderTextColor="rgba(255, 255, 255, 0.3)"
                style={styles.input}
              />
            </View>

            {/* Duration */}
            <View>
              <Text style={styles.label}>{t('highlightReview.duration')}</Text>
              <TextInput
                value={durationMinutes}
                onChangeText={setDurationMinutes}
                placeholder="30"
                placeholderTextColor="rgba(255, 255, 255, 0.3)"
                keyboardType="numeric"
                style={styles.input}
              />
            </View>

            {/* Tips */}
            <View>
              <Text style={styles.label}>{t('highlightReview.tips')}</Text>
              <TextInput
                value={tips}
                onChangeText={setTips}
                placeholder={t('highlightReview.optional')}
                placeholderTextColor="rgba(255, 255, 255, 0.3)"
                style={[styles.input, styles.textArea]}
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Must See Toggle */}
            <View style={styles.toggleRow}>
              <View style={styles.toggleLabel}>
                <Icon name="star-fill" size={16} color="#fbbf24" />
                <Text style={styles.label}>{t('highlightReview.mustSee')}</Text>
              </View>
              <Switch
                value={isHighlight}
                onValueChange={setIsHighlight}
                trackColor={{ false: '#3f3f46', true: '#5248D4' }}
                thumbColor={isHighlight ? '#fff' : '#71717a'}
              />
            </View>
          </View>

          {/* Submit Button */}
          <View style={styles.footer}>
            <PrimaryButton
              title={isCreateMode ? t('cityDetail.add') : t('cityDetail.save')}
              onPress={handleSave}
              disabled={!canSubmit}
              loading={isSaving}
              fullWidth
            />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  container: {
    maxHeight: '90%',
    backgroundColor: '#1E1A64',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontFamily: 'Righteous',
    fontSize: 20,
    color: '#FAFAFF',
  },
  closeButton: {
    padding: 4,
  },
  form: {
    gap: 20,
  },
  label: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#FAFAFF',
    fontFamily: 'DMSans',
    fontSize: 14,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  categoryRow: {
    flexDirection: 'row',
    gap: 8,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footer: {
    marginTop: 24,
  },
});
