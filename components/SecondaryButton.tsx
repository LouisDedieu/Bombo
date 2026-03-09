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

export interface SecondaryButtonProps extends Omit<PressableProps, 'style'> {
  /** Button text */
  title: string;
  /** Active state (changes background and text color) */
  active?: boolean;
  /** Shape variant */
  variant?: 'pill' | 'square';
  /** Size variant */
  size?: 'default' | 'sm';
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
  leftIcon,
  rightIcon,
  showChevron = false,
  style,
  ...props
}: SecondaryButtonProps) {
  const sizeConfig = SIZE_CONFIG[size];
  const isPill = variant === 'pill';

  // Get color scheme based on state and variant
  const colorScheme = active
    ? COLORS.active
    : isPill
    ? COLORS.inactivePill
    : COLORS.inactiveSquare;

  // Border radius based on variant
  const borderRadius = isPill ? 16 : 5;

  // Shadow blur values from Figma
  const topShadowBlur = 0.5;
  const bottomShadowBlur = active ? 6.3 : 2.1;

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
      style={[animatedStyle, style]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      {...props}
    >
      <View
        style={{
          height: sizeConfig.height,
          borderRadius,
          overflow: 'hidden',
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
            backgroundColor: colorScheme.background,
            borderRadius,
          }}
          shadowColor={colorScheme.shadowBottom}
          shadowOffset={{ width: 0, height: -1 }}
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
          shadowColor={colorScheme.shadowTop}
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
            <Icon name={leftIcon} size={sizeConfig.iconSize} color={colorScheme.text} />
          )}

          {/* Title */}
          <Text
            style={{
              fontFamily: 'Righteous',
              fontSize: sizeConfig.fontSize,
              lineHeight: sizeConfig.lineHeight,
              color: colorScheme.text,
              textAlign: 'center',
            }}
          >
            {title}
          </Text>

          {/* Right Icon */}
          {rightIcon && (
            <Icon name={rightIcon} size={sizeConfig.iconSize} color={colorScheme.text} />
          )}

          {/* Chevron */}
          {showChevron && (
            <Icon name="arrow-down-s-line" size={sizeConfig.iconSize} color={colorScheme.text} />
          )}
        </View>
      </View>
    </AnimatedPressable>
  );
}

export default SecondaryButton;
