import React from 'react';
import {
  View,
  TextInput,
  type TextInputProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Svg, { Defs, Rect, LinearGradient, Stop, ClipPath } from 'react-native-svg';
import Icon from 'react-native-remix-icon';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface InputProps extends Omit<TextInputProps, 'style'> {
  /** Left icon name (Remixicon) */
  leftIcon?: string;
  /** Color variant: 'light' for light backgrounds, 'dark' for dark backgrounds */
  variant?: InputVariant;
  /** Container style */
  style?: StyleProp<ViewStyle>;
  /** Input style */
  inputStyle?: StyleProp<ViewStyle>;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const COLOR_VARIANTS = {
  light: {
    background: 'rgba(255,255,255,0.26)',
    iconColor: 'rgba(11, 41, 160, 0.5)',
    textColor: 'rgba(11, 41, 160, 0.8)',
    placeholderColor: 'rgba(11, 41, 160, 0.5)',
    innerShadow: 'rgb(255,255,255)',
    outerHighlight: '#ffffff',
    borderRadius: 30,
  },
  dark: {
    background: '#E8E9FC',
    iconColor: 'rgba(11, 41, 160, 0.5)',
    textColor: 'rgba(11, 41, 160, 0.8)',
    placeholderColor: 'rgba(11, 41, 160, 0.5)',
    innerShadow: 'rgb(138,138,138)',
    outerHighlight: '#ffffff',
    borderRadius: 16,
  },
} as const;

type InputVariant = keyof typeof COLOR_VARIANTS;

const INPUT_HEIGHT = 51;

// ---------------------------------------------------------------------------
// InnerShadowSvg Component
// ---------------------------------------------------------------------------

interface InnerShadowSvgProps {
  width: number;
  height: number;
  colors: typeof COLOR_VARIANTS.light;
}

function InnerShadowSvg({ width, height, colors }: InnerShadowSvgProps) {
  if (width <= 0 || height <= 0) return null;

  const shadowSize = 12;
  const rx = colors.borderRadius || 30;

  return (
    <Svg
      width={width}
      height={height}
      style={{ position: 'absolute', top: 0, left: 0 }}
    >
      <Defs>
        {/* Clip path for the rounded rectangle */}
        <ClipPath id="inputClip">
          <Rect x={0} y={0} width={width} height={height} rx={rx} ry={rx} />
        </ClipPath>

        {/* Top shadow gradient */}
        <LinearGradient id="topShadow" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={colors.innerShadow} stopOpacity="0.3" />
          <Stop offset="1" stopColor={colors.innerShadow} stopOpacity="0" />
        </LinearGradient>

        {/* Left shadow gradient */}
        <LinearGradient id="leftShadow" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor={colors.innerShadow} stopOpacity="0.3" />
          <Stop offset="1" stopColor={colors.innerShadow} stopOpacity="0" />
        </LinearGradient>

        {/* Bottom highlight gradient */}
        <LinearGradient id="bottomHighlight" x1="0" y1="1" x2="0" y2="0">
          <Stop offset="0" stopColor={colors.outerHighlight} stopOpacity="0.9" />
          <Stop offset="1" stopColor={colors.outerHighlight} stopOpacity="0" />
        </LinearGradient>

        {/* Right highlight gradient */}
        <LinearGradient id="rightHighlight" x1="1" y1="0" x2="0" y2="0">
          <Stop offset="0" stopColor={colors.outerHighlight} stopOpacity="0.7" />
          <Stop offset="1" stopColor={colors.outerHighlight} stopOpacity="0" />
        </LinearGradient>
      </Defs>

      {/* Apply shadows within clip path */}
      <Rect
        x={0}
        y={0}
        width={width}
        height={height}
        rx={rx}
        ry={rx}
        fill={colors.background}
        clipPath="url(#inputClip)"
      />

      {/* Top inset shadow */}
      <Rect
        x={0}
        y={0}
        width={width}
        height={shadowSize}
        fill="url(#topShadow)"
        clipPath="url(#inputClip)"
      />

      {/* Left inset shadow */}
      <Rect
        x={0}
        y={0}
        width={shadowSize}
        height={height}
        fill="url(#leftShadow)"
        clipPath="url(#inputClip)"
      />

      {/* Bottom highlight */}
      <Rect
        x={0}
        y={height - shadowSize}
        width={width}
        height={shadowSize}
        fill="url(#bottomHighlight)"
        clipPath="url(#inputClip)"
      />

      {/* Right highlight */}
      <Rect
        x={width - shadowSize}
        y={0}
        width={shadowSize}
        height={height}
        fill="url(#rightHighlight)"
        clipPath="url(#inputClip)"
      />
    </Svg>
  );
}

// ---------------------------------------------------------------------------
// Input Component
// ---------------------------------------------------------------------------

export function Input({
  leftIcon = 'link',
  placeholder = 'Coller votre lien ici...',
  variant = 'light',
  style,
  inputStyle,
  ...props
}: InputProps) {
  const [width, setWidth] = React.useState(0);
  const colors = COLOR_VARIANTS[variant];

  return (
    <View
      style={[
        {
          height: INPUT_HEIGHT,
          borderRadius: colors.borderRadius,
          overflow: 'hidden',
        },
        style,
      ]}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
    >
      {/* SVG-based inner shadow */}
      <InnerShadowSvg width={width} height={INPUT_HEIGHT} colors={colors} />

      {/* Content container */}
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 9,
          paddingHorizontal: 12,
          gap: 10,
        }}
      >
        {/* Icon */}
        {leftIcon && (
          <View style={{ width: 26, height: 26, justifyContent: 'center', alignItems: 'center' }}>
            <Icon name={leftIcon} size={22} color={colors.iconColor} />
          </View>
        )}

        {/* Text Input */}
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={colors.placeholderColor}
          style={[
            {
              flex: 1,
              fontFamily: 'Righteous',
              fontWeight: '400',
              fontSize: 14,
              lineHeight: 17,
              color: colors.textColor,
              padding: 0,
            },
            inputStyle,
          ]}
          {...props}
        />
      </View>
    </View>
  );
}
