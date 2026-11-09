import React, { useCallback, useEffect, useRef } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '../theme';
import GlassTabBarBackground from './GlassTabBarBackground';
import {
  TAB_BAR_HEIGHT,
  TAB_BAR_MIN_BOTTOM_GAP,
  TAB_BAR_SIDE_INSET,
} from './tabBarLayout';

const BAR_PADDING = 6;
const LENS_VERTICAL_INSET = 5;
const ICON_SIZE = 24;
const MAGNIFY = 0.3;
const SPRING = { damping: 17, stiffness: 210, mass: 0.8 };

export default function GlassTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const count = state.routes.length;

  const itemWidth = useSharedValue(0);
  const lensCenter = useSharedValue(0);
  // 0 = resting capsule, 1 = lifted magnifying lens
  const lift = useSharedValue(0);
  const dragging = useSharedValue(0);
  const hasLaidOut = useRef(false);
  const settledByDrag = useRef(false);

  const selectTab = useCallback(
    (index: number) => {
      const route = state.routes[index];
      if (!route) return;
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });
      if (state.index !== index && !event.defaultPrevented) {
        navigation.navigate({ name: route.name, merge: true } as never);
      }
    },
    [navigation, state.index, state.routes]
  );

  const finishDrag = useCallback(
    (index: number) => {
      settledByDrag.current = index !== state.index;
      selectTab(index);
    },
    [selectTab, state.index]
  );

  const onLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const width = (e.nativeEvent.layout.width - BAR_PADDING * 2) / count;
      itemWidth.value = width;
      lensCenter.value = BAR_PADDING + width * (state.index + 0.5);
      hasLaidOut.current = true;
    },
    [count, itemWidth, lensCenter, state.index]
  );

  useEffect(() => {
    if (!hasLaidOut.current || dragging.value) return;
    if (settledByDrag.current) {
      settledByDrag.current = false;
      return;
    }
    lensCenter.value = withSpring(
      BAR_PADDING + itemWidth.value * (state.index + 0.5),
      SPRING
    );
    lift.value = withSequence(
      withTiming(1, { duration: 140 }),
      withTiming(0, { duration: 320 })
    );
  }, [state.index, dragging, itemWidth, lensCenter, lift]);

  const pan = Gesture.Pan()
    .activeOffsetX([-6, 6])
    .onStart(() => {
      dragging.value = 1;
      lift.value = withTiming(1, { duration: 120 });
    })
    .onUpdate((e) => {
      const min = BAR_PADDING + itemWidth.value / 2;
      const max = BAR_PADDING + itemWidth.value * (count - 0.5);
      lensCenter.value = Math.min(Math.max(e.x, min), max);
    })
    .onFinalize(() => {
      if (!dragging.value) return;
      const raw = (lensCenter.value - BAR_PADDING) / itemWidth.value - 0.5;
      const index = Math.min(Math.max(Math.round(raw), 0), count - 1);
      lensCenter.value = withSpring(
        BAR_PADDING + itemWidth.value * (index + 0.5),
        SPRING
      );
      lift.value = withTiming(0, { duration: 260 });
      dragging.value = 0;
      runOnJS(finishDrag)(index);
    });

  const lensStyle = useAnimatedStyle(() => {
    const width = Math.max(itemWidth.value - 2, 0);
    return {
      width,
      left: lensCenter.value - width / 2,
      transform: [
        { scaleX: 1 + 0.2 * lift.value },
        { scaleY: 1 + 0.34 * lift.value },
      ],
    };
  });
  const restFillStyle = useAnimatedStyle(() => ({ opacity: 1 - lift.value }));
  const liftedFillStyle = useAnimatedStyle(() => ({ opacity: lift.value }));

  const bottom = Math.max(insets.bottom - 6, TAB_BAR_MIN_BOTTOM_GAP);

  return (
    <View pointerEvents="box-none" style={[styles.wrapper, { bottom }]}>
      <GestureDetector gesture={pan}>
        <View style={styles.bar} onLayout={onLayout}>
          <GlassTabBarBackground radius={TAB_BAR_HEIGHT / 2} />

          <Animated.View pointerEvents="none" style={[styles.lens, lensStyle]}>
            <Animated.View style={[StyleSheet.absoluteFill, styles.lensRest, restFillStyle]} />
            <Animated.View style={[StyleSheet.absoluteFill, styles.lensLifted, liftedFillStyle]} />
          </Animated.View>

          <View style={styles.row} accessibilityRole="tablist">
            {state.routes.map((route, index) => {
              const { options } = descriptors[route.key];
              const focused = state.index === index;
              const color = focused
                ? options.tabBarActiveTintColor ?? colors.primary
                : options.tabBarInactiveTintColor ?? colors.gray500;
              const label =
                typeof options.tabBarLabel === 'string'
                  ? options.tabBarLabel
                  : options.title ?? route.name;

              return (
                <TabItem
                  key={route.key}
                  index={index}
                  label={label}
                  color={color}
                  focused={focused}
                  icon={options.tabBarIcon?.({ focused, color, size: ICON_SIZE })}
                  itemWidth={itemWidth}
                  lensCenter={lensCenter}
                  lift={lift}
                  onPress={() => selectTab(index)}
                  onLongPress={() =>
                    navigation.emit({ type: 'tabLongPress', target: route.key })
                  }
                />
              );
            })}
          </View>
        </View>
      </GestureDetector>
    </View>
  );
}

interface TabItemProps {
  index: number;
  label: string;
  color: string;
  focused: boolean;
  icon: React.ReactNode;
  itemWidth: SharedValue<number>;
  lensCenter: SharedValue<number>;
  lift: SharedValue<number>;
  onPress: () => void;
  onLongPress: () => void;
}

function TabItem({
  index,
  label,
  color,
  focused,
  icon,
  itemWidth,
  lensCenter,
  lift,
  onPress,
  onLongPress,
}: TabItemProps) {
  const magnifyStyle = useAnimatedStyle(() => {
    if (!itemWidth.value) return {};
    const center = BAR_PADDING + itemWidth.value * (index + 0.5);
    const proximity = Math.max(
      0,
      1 - Math.abs(lensCenter.value - center) / itemWidth.value
    );
    return { transform: [{ scale: 1 + MAGNIFY * proximity * lift.value }] };
  });

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: focused }}
      accessibilityLabel={label}
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.item}
    >
      <Animated.View style={[styles.itemContent, magnifyStyle]}>
        {icon}
        <Text numberOfLines={1} style={[styles.label, { color }]}>
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: TAB_BAR_SIDE_INSET,
    right: TAB_BAR_SIDE_INSET,
    height: TAB_BAR_HEIGHT,
    borderRadius: TAB_BAR_HEIGHT / 2,
    shadowColor: '#0b1437',
    shadowOpacity: 0.16,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  bar: {
    flex: 1,
    borderRadius: TAB_BAR_HEIGHT / 2,
    paddingHorizontal: BAR_PADDING,
  },
  lens: {
    position: 'absolute',
    top: LENS_VERTICAL_INSET,
    bottom: LENS_VERTICAL_INSET,
    borderRadius: (TAB_BAR_HEIGHT - LENS_VERTICAL_INSET * 2) / 2,
  },
  lensRest: {
    borderRadius: (TAB_BAR_HEIGHT - LENS_VERTICAL_INSET * 2) / 2,
    backgroundColor: 'rgba(118, 118, 128, 0.16)',
  },
  lensLifted: {
    borderRadius: (TAB_BAR_HEIGHT - LENS_VERTICAL_INSET * 2) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: '#000',
    shadowOpacity: 0.14,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: '600',
  },
});
