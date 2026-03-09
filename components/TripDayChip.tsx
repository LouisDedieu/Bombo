import React from 'react';
import { View, Text, type StyleProp, type ViewStyle } from 'react-native';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CategoryType =
  | 'food'
  | 'culture'
  | 'nightlife'
  | 'shopping'
  | 'nature'
  | 'other';

interface CategoryChipProps {
  variant: 'category';
  category: CategoryType;
  count: number;
  style?: StyleProp<ViewStyle>;
}

interface DayChipProps {
  variant: 'day';
  dayNumber: number;
  count: number;
  style?: StyleProp<ViewStyle>;
}

interface MoreDaysChipProps {
  variant: 'moreDays';
  daysCount: number;
  style?: StyleProp<ViewStyle>;
}

export type TripDayChipProps = CategoryChipProps | DayChipProps | MoreDaysChipProps;

// ---------------------------------------------------------------------------
// Category Configuration
// ---------------------------------------------------------------------------

const CATEGORY_CONFIG = {
  food: {
    label: 'Food',
    emoji: '🍽️',
    overlayColor: 'rgba(255, 88, 5, 0.2)',
    textColor: '#C1755E',
  },
  culture: {
    label: 'Culture',
    emoji: '🏛️',
    overlayColor: 'rgba(113, 5, 255, 0.2)',
    textColor: '#A35EC1',
  },
  nightlife: {
    label: 'Nightlife',
    emoji: '🍸',
    overlayColor: 'rgba(5, 76, 255, 0.2)',
    textColor: '#5E87C1',
  },
  shopping: {
    label: 'Shopping',
    emoji: '🛍️',
    overlayColor: 'rgba(255, 5, 238, 0.2)',
    textColor: '#BE5EC1',
  },
  nature: {
    label: 'Nature',
    emoji: '🌿',
    overlayColor: 'rgba(5, 255, 88, 0.2)',
    textColor: '#5EC17A',
  },
  other: {
    label: 'Other',
    emoji: '📍',
    overlayColor: 'rgba(150, 150, 150, 0.2)',
    textColor: '#8C92B5',
  },
} as const;

// ---------------------------------------------------------------------------
// Base Colors
// ---------------------------------------------------------------------------

const BASE_BG = '#49447D';
const BADGE_BG = '#292461';
const LABEL_COLOR = 'rgba(255, 255, 255, 0.6)';

// ---------------------------------------------------------------------------
// TripDayChip Component
// ---------------------------------------------------------------------------

export function TripDayChip(props: TripDayChipProps) {
  const { variant, style } = props;

  // ── More Days Variant ─────────────────────────────────────────────────────
  if (variant === 'moreDays') {
    return (
      <View className="flex-row items-center" style={style}>
        <View
          className="flex-row justify-center items-center"
          style={{
            paddingHorizontal: 5,
            height: 10,
            backgroundColor: BASE_BG,
            borderRadius: 3,
          }}
        >
          <Text
            style={{
              fontFamily: 'DMSans-SemiBold',
              fontSize: 7,
              lineHeight: 9,
              color: LABEL_COLOR,
            }}
          >
            + {props.daysCount} jours
          </Text>
        </View>
      </View>
    );
  }

  // ── Category Variant ──────────────────────────────────────────────────────
  if (variant === 'category') {
    const config = CATEGORY_CONFIG[props.category];

    return (
      <View className="flex-row items-center" style={style}>
        {/* Main chip with icon and label */}
        <View
          className="flex-row justify-center items-center overflow-hidden"
          style={{
            paddingLeft: 3,
            height: 10,
            backgroundColor: BASE_BG,
            borderRadius: 3,
          }}
        >
          {/* Overlay */}
          <View
            className="absolute inset-0"
            style={{ backgroundColor: config.overlayColor }}
          />
          <Text style={{ fontSize: 6, lineHeight: 8 }}>{config.emoji}</Text>
          <Text
            style={{
              fontFamily: 'DMSans-SemiBold',
              fontSize: 7,
              lineHeight: 9,
              color: LABEL_COLOR,
              marginLeft: 2,
            }}
          >
            {config.label}
          </Text>
          {/* Count badge */}
          <View
            className="justify-center items-center"
            style={{
              paddingHorizontal: 2,
              marginLeft: 3,
              height: 10,
              backgroundColor: BADGE_BG,
            }}
          >
            {/* Badge overlay */}
            <View
              className="absolute inset-0"
              style={{ backgroundColor: config.overlayColor }}
            />
            <Text
              style={{
                fontFamily: 'DMSans-SemiBold',
                fontSize: 6,
                lineHeight: 8,
                color: config.textColor,
              }}
            >
              {props.count}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  // ── Day Variant ───────────────────────────────────────────────────────────
  if (variant === 'day') {
    return (
      <View className="flex-row items-center" style={style}>
        {/* Main chip with day label */}
        <View
          className="flex-row justify-center items-center overflow-hidden"
          style={{
            paddingLeft: 5,
            height: 10,
            backgroundColor: BASE_BG,
            borderRadius: 3,
          }}
        >
          <Text
            style={{
              fontFamily: 'DMSans-SemiBold',
              fontSize: 7,
              lineHeight: 9,
              color: LABEL_COLOR,
            }}
          >
            Jour {props.dayNumber}
          </Text>
          {/* Count badge */}
          <View
            className="justify-center items-center"
            style={{
              paddingHorizontal: 2,
              marginLeft: 3,
              height: 10,
              backgroundColor: BADGE_BG,
            }}
          >
            <Text
              style={{
                fontFamily: 'DMSans-SemiBold',
                fontSize: 6,
                lineHeight: 8,
                color: '#8E6DE8',
              }}
            >
              {props.count}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return null;
}
