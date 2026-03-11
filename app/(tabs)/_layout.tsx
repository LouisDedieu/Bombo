import { useState, useEffect } from 'react';
import { Tabs } from 'expo-router';
import { View, Keyboard, Platform } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TabBar } from '@/components/navigation/TabBar';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import type { NavbarTab, NavbarAction } from '@/components/navigation/Navbar';
import { useAnalysis } from '@/context/AnalysisContext';

const TABS: NavbarTab[] = [
  { icon: 'inbox-line', label: 'Inbox' },
  { icon: 'bookmark-line', label: 'Saved' },
  { icon: 'user3-line', label: 'Profile' },
];

const ACTIONS: NavbarAction[] = [
  { icon: 'sparkling-fill', label: 'Auto', color: 'default' as const },
  { icon: 'signpost-fill', label: 'Trip', color: 'green' as const },
  { icon: 'building-fill', label: 'City', color: 'blue' as const },
];

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const [expanded, setExpanded] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const keyboardHeight = useSharedValue(0);
  const { triggerAnalysis } = useAnalysis();

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showListener = Keyboard.addListener(showEvent, (e) => {
      keyboardHeight.value = withTiming(e.endCoordinates.height - insets.bottom, {
        duration: Platform.OS === 'ios' ? 250 : 200,
        easing: Easing.out(Easing.ease),
      });
    });

    const hideListener = Keyboard.addListener(hideEvent, () => {
      keyboardHeight.value = withTiming(0, {
        duration: Platform.OS === 'ios' ? 250 : 200,
        easing: Easing.out(Easing.ease),
      });
    });

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, [insets.bottom]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -keyboardHeight.value }],
  }));

  const handleTabChange = (index: number) => {
    const route = state.routes[index];
    navigation.navigate(route.name);
  };

  const handleSubmit = (url: string, _action: NavbarAction) => {
    // Clear the input after submission
    setInputValue('');
    // Delegate to whatever page has registered its handler
    triggerAnalysis(url);
  };

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 16,
          paddingBottom: insets.bottom + 8,
        },
        animatedStyle,
      ]}
    >
      <TabBar
        tabs={TABS}
        activeIndex={state.index}
        onTabChange={handleTabChange}
        expanded={expanded}
        onExpandedChange={setExpanded}
        actions={ACTIONS}
        inputPlaceholder="Coller votre lien ici..."
        inputValue={inputValue}
        onInputChange={setInputValue}
        onSubmit={handleSubmit}
      />
    </Animated.View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
        sceneStyle: { backgroundColor: 'transparent' },
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="trips" />
      <Tabs.Screen name="profile" />
      <Tabs.Screen name="review" options={{ href: null }} />
    </Tabs>
  );
}