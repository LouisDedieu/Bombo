import React, { memo } from 'react';
import {
  Pressable,
  View,
  Text,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { colors } from '@/constants/colors';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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

interface BaseChipProps {
  style?: StyleProp<ViewStyle>;
}

interface CategoryChipProps extends BaseChipProps {
  variant: 'category';
  category: CategoryType;
  count: number;
}

interface DayChipProps extends BaseChipProps {
  variant: 'day';
  dayNumber: number;
  count: number;
}

interface MoreDaysChipProps extends BaseChipProps {
  variant: 'moreDays';
  daysCount: number;
}

interface SelectorChipProps extends BaseChipProps {
  variant: 'selector';
  dayNumber: number;
  count: number;
  isSelected: boolean;
  onPress: () => void;
}

export type TripDayChipProps =
  | CategoryChipProps
  | DayChipProps
  | MoreDaysChipProps
  | SelectorChipProps;

// ---------------------------------------------------------------------------
// Category Configuration
// ---------------------------------------------------------------------------

const CATEGORY_CONFIG: Record<
  CategoryType,
  { emoji: string; overlayColor: string; textColor: string }
> = {
  food: {
    emoji: '🍽️',
    overlayColor: 'rgba(255, 88, 5, 0.2)',
    textColor: '#C1755E',
  },
  culture: {
    emoji: '🏛️',
    overlayColor: 'rgba(113, 5, 255, 0.2)',
    textColor: '#A35EC1',
  },
  nightlife: {
    emoji: '🍸',
    overlayColor: 'rgba(5, 76, 255, 0.2)',
    textColor: '#5E87C1',
  },
  shopping: {
    emoji: '🛍️',
    overlayColor: 'rgba(255, 5, 238, 0.2)',
    textColor: '#BE5EC1',
  },
  nature: {
    emoji: '🌿',
    overlayColor: 'rgba(5, 255, 88, 0.2)',
    textColor: '#5EC17A',
  },
  other: {
    emoji: '📍',
    overlayColor: 'rgba(150, 150, 150, 0.2)',
    textColor: colors.social,
  },
};

// ---------------------------------------------------------------------------
// Styles (static - created once)
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  // Base containers
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chipBase: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: colors.chipBg,
  },

  // Small chips (day, category, moreDays)
  chipSmall: {
    height: 10,
    borderRadius: 3,
  },

  // Large chips (selector)
  chipLarge: {
    paddingLeft: 10,
    height: 24,
    borderRadius: 6,
  },

  // Text styles
  textSmall: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 7,
    lineHeight: 9,
    color: colors.textMuted,
  },
  textLarge: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 11,
    lineHeight: 14,
  },
  textEmoji: {
    fontSize: 6,
    lineHeight: 8,
  },

  // Badge styles
  badgeSmall: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2,
    marginLeft: 3,
    height: 10,
    backgroundColor: colors.chipBadgeBg,
  },
  badgeLarge: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 6,
    marginLeft: 6,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  badgeTextSmall: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 6,
    lineHeight: 8,
    color: colors.chipBadgeText,
  },
  badgeTextLarge: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 10,
    lineHeight: 12,
  },

  // Overlay
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

// ---------------------------------------------------------------------------
// Reusable Badge Component
// ---------------------------------------------------------------------------

interface BadgeProps {
  count: number;
  size: 'small' | 'large';
  textColor?: string;
  bgColor?: string;
  overlayColor?: string;
}

const Badge = memo(function Badge({
  count,
  size,
  textColor = colors.chipBadgeText,
  bgColor = colors.chipBadgeBg,
  overlayColor,
}: BadgeProps) {
  const isSmall = size === 'small';

  return (
    <View
      style={[
        isSmall ? styles.badgeSmall : styles.badgeLarge,
        { backgroundColor: bgColor },
      ]}
    >
      {overlayColor && (
        <View style={[styles.overlay, { backgroundColor: overlayColor }]} />
      )}
      <Text
        style={[
          isSmall ? styles.badgeTextSmall : styles.badgeTextLarge,
          { color: textColor },
        ]}
      >
        {count}
      </Text>
    </View>
  );
});

// ---------------------------------------------------------------------------
// Selector Chip (Day variant with animation + pressable)
// ---------------------------------------------------------------------------

const SelectorChip = memo(function SelectorChip({
  dayNumber,
  count,
  isSelected,
  onPress,
  style,
}: SelectorChipProps) {
  const { t } = useTranslation();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 8, stiffness: 600, mass: 0.4 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 6, stiffness: 300, mass: 0.3 });
  };

  const bgColor = isSelected ? colors.accent : colors.chipBg;
  const labelColor = isSelected ? colors.textPrimary : colors.textMuted;
  const badgeBg = isSelected ? 'rgba(255, 255, 255, 0.25)' : colors.chipBadgeBg;
  const badgeText = isSelected ? colors.textPrimary : colors.chipBadgeText;

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[animatedStyle, style]}
    >
      <View style={[styles.chipBase, styles.chipLarge, { backgroundColor: bgColor }]}>
        <Text
          style={[styles.textLarge, { color: labelColor }]}
          numberOfLines={1}
          ellipsizeMode="clip"
        >
          {t('tripDayChip.day', { number: dayNumber })}
        </Text>
        <Badge count={count} size="large" textColor={badgeText} bgColor={badgeBg} />
      </View>
    </AnimatedPressable>
  );
});

// ---------------------------------------------------------------------------
// TripDayChip Component
// ---------------------------------------------------------------------------

export const TripDayChip = memo(function TripDayChip(props: TripDayChipProps) {
  const { t } = useTranslation();
  const { variant, style } = props;

  // ── Selector Variant ─────────────────────────────────────────────────────
  if (variant === 'selector') {
    return <SelectorChip {...props} />;
  }

  // ── More Days Variant ────────────────────────────────────────────────────
  if (variant === 'moreDays') {
    return (
      <View style={[styles.row, style]}>
        <View style={[styles.chipBase, styles.chipSmall, { paddingHorizontal: 5 }]}>
          <Text style={styles.textSmall}>
            + {props.daysCount} {t('tripDayChip.days')}
          </Text>
        </View>
      </View>
    );
  }

  // ── Category Variant ─────────────────────────────────────────────────────
  if (variant === 'category') {
    const config = CATEGORY_CONFIG[props.category];

    return (
      <View style={[styles.row, style]}>
        <View style={[styles.chipBase, styles.chipSmall, { paddingLeft: 3 }]}>
          <View style={[styles.overlay, { backgroundColor: config.overlayColor }]} />
          <Text style={styles.textEmoji}>{config.emoji}</Text>
          <Text style={[styles.textSmall, { marginLeft: 2 }]}>
            {t(`tripDayChip.${props.category}`)}
          </Text>
          <Badge
            count={props.count}
            size="small"
            textColor={config.textColor}
            overlayColor={config.overlayColor}
          />
        </View>
      </View>
    );
  }

  // ── Day Variant ──────────────────────────────────────────────────────────
  if (variant === 'day') {
    return (
      <View style={[styles.row, style]}>
        <View style={[styles.chipBase, styles.chipSmall, { paddingLeft: 5 }]}>
          <Text style={styles.textSmall}>
            {t('tripDayChip.day', { number: props.dayNumber })}
          </Text>
          <Badge count={props.count} size="small" />
        </View>
      </View>
    );
  }

  return null;
});
