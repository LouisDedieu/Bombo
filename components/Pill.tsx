import React from 'react';
import { View, Text, type StyleProp, type ViewStyle } from 'react-native';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PillProps {
  label: string;
  backgroundColor: string;
  textColor: string;
  fontFamily?: string;
  style?: StyleProp<ViewStyle>;
}

// ---------------------------------------------------------------------------
// Pill Component
// ---------------------------------------------------------------------------

export function Pill({ label, backgroundColor, textColor, fontFamily = 'DMSans', style }: PillProps) {
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 10,
          paddingVertical: 1,
          backgroundColor,
          borderRadius: 16,
          shadowColor: backgroundColor,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.4,
          shadowRadius: 1,
        },
        style,
      ]}
    >
      <Text
        style={{
          fontFamily,
          fontSize: 8,
          lineHeight: 10,
          color: textColor,
        }}
      >
        {label}
      </Text>
    </View>
  );
}
