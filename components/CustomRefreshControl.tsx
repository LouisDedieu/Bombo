import React, { useCallback, useState } from 'react';
import { View, Animated, PanResponder, StyleSheet } from 'react-native';
import Loader from './Loader';
import { colors } from '@/constants/colors';

const REFRESH_THRESHOLD = 80;
const MAX_PULL = 120;

interface CustomRefreshControlProps {
  refreshing: boolean;
  onRefresh: () => void;
  children: React.ReactNode;
  progressViewOffset?: number;
}

export default function CustomRefreshControl({
  refreshing,
  onRefresh,
  children,
  progressViewOffset = 0,
}: CustomRefreshControlProps) {
  const [pullDistance] = useState(new Animated.Value(0));
  const [isRefreshTriggered, setIsRefreshTriggered] = useState(false);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return gestureState.dy > 0 && !refreshing;
    },
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dy > 0 && !refreshing) {
        const distance = Math.min(gestureState.dy * 0.5, MAX_PULL);
        pullDistance.setValue(distance);

        if (distance >= REFRESH_THRESHOLD && !isRefreshTriggered) {
          setIsRefreshTriggered(true);
        }
      }
    },
    onPanResponderRelease: () => {
      if (isRefreshTriggered && !refreshing) {
        onRefresh();
        Animated.timing(pullDistance, {
          toValue: REFRESH_THRESHOLD,
          duration: 200,
          useNativeDriver: false,
        }).start();
      } else {
        Animated.timing(pullDistance, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }).start();
      }
      setIsRefreshTriggered(false);
    },
  });

  // Reset pull distance when refresh completes
  React.useEffect(() => {
    if (!refreshing) {
      Animated.timing(pullDistance, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  }, [refreshing]);

  const loaderOpacity = pullDistance.interpolate({
    inputRange: [0, REFRESH_THRESHOLD / 2, REFRESH_THRESHOLD],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp',
  });

  const loaderScale = pullDistance.interpolate({
    inputRange: [0, REFRESH_THRESHOLD],
    outputRange: [0.5, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {/* Custom loader */}
      <Animated.View
        style={[
          styles.loaderContainer,
          {
            top: progressViewOffset,
            opacity: loaderOpacity,
            transform: [
              { scale: loaderScale },
              {
                translateY: pullDistance.interpolate({
                  inputRange: [0, MAX_PULL],
                  outputRange: [-40, 20],
                  extrapolate: 'clamp',
                }),
              },
            ],
          },
        ]}
      >
        <Loader size={36} color={colors.textPrimary} />
      </Animated.View>

      {/* Content with pull translation */}
      <Animated.View
        style={[
          styles.content,
          {
            transform: [
              {
                translateY: pullDistance,
              },
            ],
          },
        ]}
      >
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loaderContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  content: {
    flex: 1,
  },
});
