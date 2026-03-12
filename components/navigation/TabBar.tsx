import React, { useCallback } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { Navbar, type NavbarTab, type NavbarAction } from '@/components/navigation/Navbar';
import { PrimaryButton } from '@/components/PrimaryButton';
import Icon from 'react-native-remix-icon';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TabBarProps {
  /** Tab items for the Navbar */
  tabs: NavbarTab[];
  /** Index of active tab */
  activeIndex?: number;
  /** Called when tab changes */
  onTabChange?: (index: number) => void;
  /** Whether the navbar is expanded */
  expanded?: boolean;
  /** Called when expanded state changes */
  onExpandedChange?: (expanded: boolean) => void;
  /** Action buttons shown in expanded mode */
  actions?: NavbarAction[];
  /** Input placeholder in expanded mode */
  inputPlaceholder?: string;
  /** Input value in expanded mode */
  inputValue?: string;
  /** Called when input value changes */
  onInputChange?: (value: string) => void;
  /**
   * Called when the user presses an action button with a valid URL.
   * Receives the URL and the action that was triggered.
   * The TabBar will also collapse automatically after this fires.
   */
  onSubmit?: (url: string, action: NavbarAction) => void;
  /** Container style */
  style?: StyleProp<ViewStyle>;
}


// ---------------------------------------------------------------------------
// TabBar
// ---------------------------------------------------------------------------

export function TabBar({
                         tabs,
                         activeIndex = 0,
                         onTabChange,
                         expanded = false,
                         onExpandedChange,
                         actions,
                         inputPlaceholder,
                         inputValue,
                         onInputChange,
                         onSubmit,
                         style,
                       }: TabBarProps) {
  const expandProgress = useSharedValue(expanded ? 1 : 0);

  const timingConfig = {
    duration: 300,
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  };

  React.useEffect(() => {
    expandProgress.value = withTiming(expanded ? 1 : 0, timingConfig);
  }, [expanded]);

  const handleToggle = useCallback(() => {
    onExpandedChange?.(!expanded);
  }, [expanded, onExpandedChange]);

  const handleSubmit = useCallback(
    (url: string, action: NavbarAction) => {
      onSubmit?.(url, action);
      // Auto-collapse after submitting
      onExpandedChange?.(false);
    },
    [onSubmit, onExpandedChange]
  );

  const rotateStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${interpolate(expandProgress.value, [0, 1], [0, 45])}deg` },
    ],
  }));

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'flex-end',
          gap: 17,
        },
        style,
      ]}
    >
      <Navbar
        tabs={tabs}
        activeIndex={activeIndex}
        onTabChange={onTabChange}
        expanded={expanded}
        actions={actions}
        inputPlaceholder={inputPlaceholder}
        inputValue={inputValue}
        onInputChange={onInputChange}
        onSubmit={handleSubmit}
        style={{ flex: 1 }}
      />

      {/* Toggle button */}
      <View style={{ width: 61, height: 61 }}>
        <PrimaryButton
          size="pill"
          onPress={handleToggle}
          style={{ width: 61, height: 61 }}
        />

        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              alignItems: 'center',
              justifyContent: 'center',
            },
            rotateStyle,
          ]}
        >
          <Icon name="add-line" size={32} color="#FAFAFF" />
        </Animated.View>
      </View>
    </View>
  );
}