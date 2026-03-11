import React from 'react';
import {
  Pressable,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { ShadowView } from 'react-native-inner-shadow';
import Icon from 'react-native-remix-icon';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ColorScheme =
  | 'default'
  | 'food'
  | 'restaurant'
  | 'culture'
  | 'nature'
  | 'shopping'
  | 'nightlife'
  | 'other'
  | 'location'
  | 'mustsee';

export interface SecondaryButtonProps extends Omit<PressableProps, 'style'> {
  /** Button text */
  title: string;
  /** Active state (changes background and text color) */
  active?: boolean;
  /** Shape variant */
  variant?: 'pill' | 'square';
  /** Size variant */
  size?: 'default' | 'sm';
  /** Color scheme for category-based styling */
  colorScheme?: ColorScheme;
  /** Left icon (Remix Icon name) */
  leftIcon?: string;
  /** Right icon (Remix Icon name) */
  rightIcon?: string;
  /** Show chevron down icon on the right */
  showChevron?: boolean;
  /** Container style */
  style?: StyleProp<ViewStyle>;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const COLORS = {
  // Active state
  active: {
    background: '#5954BF',
    text: '#FFFFFF',
    shadowTop: '#9895D8',
    shadowBottom: '#AEADC4',
  },
  // Inactive pill state
  inactivePill: {
    background: '#171450',
    text: '#CECBF5',
    shadowTop: '#5954BF',
    shadowBottom: '#5955A6',
  },
  // Inactive square state
  inactiveSquare: {
    background: '#171450',
    text: '#CECBF5',
    shadowTop: '#56538F',
    shadowBottom: '#4E4B83',
  },
};

// Category-based color schemes
const CATEGORY_COLORS: Record<
  ColorScheme,
  { active: typeof COLORS.active; inactive: typeof COLORS.inactivePill }
> = {
  default: {
    active: COLORS.active,
    inactive: COLORS.inactivePill,
  },
  // 'food' is an alias for 'restaurant' (HighlightCategory uses 'food', ColorScheme uses 'restaurant')
  food: {
    active: {
      background: '#7B322D',
      text: '#FFFFFF',
      shadowTop: '#B3724C',
      shadowBottom: '#ea9b6d',
    },
    inactive: {
      background: '#2D1A17',
      text: '#7c7c7c',
      shadowTop: '#3D2A27',
      shadowBottom: '#2D1A17',
    },
  },
  restaurant: {
    active: {
      background: '#7B322D',
      text: '#FFFFFF',
      shadowTop: '#B3724C',
      shadowBottom: '#ea9b6d',
    },
    inactive: {
      background: '#2D1A17',
      text: '#7c7c7c',
      shadowTop: '#3D2A27',
      shadowBottom: '#2D1A17',
    },
  },
  culture: {
    active: {
      background: '#10459D',
      text: '#FFFFFF',
      shadowTop: '#A0C4E8',
      shadowBottom: '#5080B0',
    },
    inactive: {
      background: '#1E3A5F',
      text: '#6B9FD4',
      shadowTop: '#2A4A6F',
      shadowBottom: '#1A3050',
    },
  },
  nature: {
    active: {
      background: '#147A2F',
      text: '#FFFFFF',
      shadowTop: '#C8E8C0',
      shadowBottom: '#80B080',
    },
    inactive: {
      background: '#2A4D2A',
      text: '#A8D8A0',
      shadowTop: '#3A5D3A',
      shadowBottom: '#204020',
    },
  },
  shopping: {
    active: {
      background: '#7B0B91',
      text: '#FFFFFF',
      shadowTop: '#E8D8F8',
      shadowBottom: '#886ba5',
    },
    inactive: {
      background: '#461351',
      text: '#D8C8E8',
      shadowTop: '#4A4060',
      shadowBottom: '#302540',
    },
  },
  nightlife: {
    active: {
      background: '#370B98',
      text: '#FFFFFF',
      shadowTop: '#F8C8D8',
      shadowBottom: '#6a539a',
    },
    inactive: {
      background: '#220d51',
      text: '#ffe1eb',
      shadowTop: '#5D3A4D',
      shadowBottom: '#180c33',
    },
  },
  location: {
    active: {
      background: '#615A76',
      text: '#FFFFFF',
      shadowTop: '#C0E8E0',
      shadowBottom: '#858585',
    },
    inactive: {
      background: '#373640',
      text: '#dddddd',
      shadowTop: '#737281',
      shadowBottom: '#3e3e47',
    },
  },
  mustsee: {
    active: {
      background: '#b1a201',
      text: '#FFFFFF',
      shadowTop: '#FDE68A',
      shadowBottom: '#D4A000',
    },
    inactive: {
      background: '#504905',
      text: '#d8c713',
      shadowTop: '#5C3A0A',
      shadowBottom: '#432a17',
    },
  },
  other: {
    active: {
      background: '#4A4870',
      text: '#FFFFFF',
      shadowTop: '#8f8cb5',
      shadowBottom: '#6b698f',
    },
    inactive: {
      background: '#2a2940',
      text: '#8f8cb5',
      shadowTop: '#3a3858',
      shadowBottom: '#1e1d30',
    },
  },
};

const SIZE_CONFIG = {
  default: {
    height: 22,
    paddingHorizontal: 10,
    fontSize: 12,
    lineHeight: 15,
    iconSize: 14,
    gap: 6,
    borderWidth: 1,
  },
  sm: {
    height: 20,
    paddingHorizontal: 6,
    fontSize: 9,
    lineHeight: 11,
    iconSize: 13,
    gap: 3,
    borderWidth: 1,
  },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SecondaryButton({
                                  title,
                                  active = false,
                                  variant = 'pill',
                                  size = 'default',
                                  colorScheme = 'default',
                                  leftIcon,
                                  rightIcon,
                                  showChevron = false,
                                  style,
                                  ...props
                                }: SecondaryButtonProps) {
  const sizeConfig = SIZE_CONFIG[size];
  const isPill = variant === 'pill';

  // Get colors based on colorScheme, state and variant
  const categoryColors = CATEGORY_COLORS[colorScheme];
  const colors = active
    ? categoryColors.active
    : colorScheme !== 'default'
      ? categoryColors.inactive
      : isPill
        ? COLORS.inactivePill
        : COLORS.inactiveSquare;

  // Border radius based on variant
  const borderRadius = isPill ? 16 : 5;

  // Shadow blur values from Figma
  const topShadowBlur = 0.5;
  const bottomShadowBlur = active ? colorScheme === 'default' ? 6 : 4 : 2;

  // Animation
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 8, stiffness: 600, mass: 0.4 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 6, stiffness: 300, mass: 0.3, overshootClamping: false });
  };

  return (
    <AnimatedPressable
      style={[animatedStyle]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      {...props}
    >
      <View
        style={{
          height: sizeConfig.height,
          borderRadius,
          overflow: 'hidden',
          ...style,
        }}
      >
        {/* Bottom shadow layer */}
        <ShadowView
          inset
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: colors.background,
            borderRadius,
          }}
          shadowColor={colors.shadowBottom}
          shadowOffset={{ width: 0, height: -2 }}
          shadowBlur={bottomShadowBlur}
        />

        {/* Top shadow layer */}
        <ShadowView
          inset
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'transparent',
            borderRadius,
          }}
          shadowColor={colors.shadowTop}
          shadowOffset={{ width: 0, height: 1 }}
          shadowBlur={topShadowBlur}
        />

        {/* Content */}
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: sizeConfig.paddingHorizontal,
            gap: sizeConfig.gap,
          }}
        >
          {/* Left Icon */}
          {leftIcon && (
            <Icon name={active ? leftIcon.replace('-line', '-fill') : leftIcon}
                  size={sizeConfig.iconSize} color={colors.text} />
          )}

          {/* Title */}
          {title && (
            <Text
              style={{
                fontFamily: 'Righteous',
                fontSize: sizeConfig.fontSize,
                lineHeight: sizeConfig.lineHeight,
                color: colors.text,
                textAlign: 'center',
              }}
            >
              {title}
            </Text>
          )}

          {/* Right Icon */}
          {rightIcon && (
            <Icon name={active ? rightIcon.replace('-line', '-fill') : rightIcon}
                  size={sizeConfig.iconSize} color={colors.text} />
          )}

          {/* Chevron */}
          {showChevron && (
            <Icon name="arrow-down-s-line" size={sizeConfig.iconSize} color={colors.text} />
          )}
        </View>
      </View>
    </AnimatedPressable>
  );
}

export default SecondaryButton;