import React from 'react';
import { Platform, StyleSheet, View, ViewStyle } from 'react-native';
import { requireOptionalNativeModule } from 'expo';

type GlassKind = 'liquid' | 'blur' | 'web' | 'none';

let cachedKind: GlassKind | undefined;
let LiquidGlassView: React.ComponentType<any> | null = null;
let NativeBlurView: React.ComponentType<any> | null = null;

/**
 * OTA bundles can land on binaries built before a native module was added,
 * so each module is required lazily and only after confirming it is linked.
 */
function resolveGlassKind(): GlassKind {
  if (cachedKind) return cachedKind;

  // Web: CSS backdrop-filter. Avoid wrapping it in overflow:hidden parents.
  if (Platform.OS === 'web') {
    cachedKind = 'web';
    return cachedKind;
  }

  cachedKind = 'none';

  // Liquid glass is iOS-only; BlurView covers native iOS + Android.
  if (Platform.OS === 'ios') {
    try {
      if (requireOptionalNativeModule('ExpoGlassEffect')) {
        const glass = require('expo-glass-effect');
        if (glass.isGlassEffectAPIAvailable() && glass.isLiquidGlassAvailable()) {
          LiquidGlassView = glass.GlassView;
          cachedKind = 'liquid';
          return cachedKind;
        }
      }
    } catch {}
  }

  try {
    if (requireOptionalNativeModule('ExpoBlur')) {
      NativeBlurView = require('expo-blur').BlurView;
      cachedKind = 'blur';
    }
  } catch {}

  return cachedKind;
}

/** RN Web accepts these CSS props even though they are not in ViewStyle. */
const webGlassFill: ViewStyle = {
  ...StyleSheet.absoluteFillObject,
  backgroundColor: 'rgba(255, 255, 255, 0.38)',
  // @ts-expect-error RN Web CSS
  backdropFilter: 'saturate(180%) blur(18px)',
  // @ts-expect-error RN Web CSS
  WebkitBackdropFilter: 'saturate(180%) blur(18px)',
};

export default function GlassTabBarBackground({ radius }: { radius: number }) {
  const kind = resolveGlassKind();
  const shape = { borderRadius: radius };

  return (
    <View
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFill,
        shape,
        kind === 'web' ? null : styles.clip,
      ]}
    >
      {kind === 'liquid' && LiquidGlassView ? (
        <LiquidGlassView
          glassEffectStyle="regular"
          colorScheme="light"
          style={[StyleSheet.absoluteFill, shape]}
        />
      ) : null}

      {kind === 'blur' && NativeBlurView ? (
        <>
          <NativeBlurView
            tint="systemThinMaterialLight"
            intensity={80}
            style={StyleSheet.absoluteFill}
          />
          <View style={[StyleSheet.absoluteFill, styles.blurSheen]} />
        </>
      ) : null}

      {kind === 'web' ? (
        <View style={[webGlassFill, shape, styles.webClip]} />
      ) : null}

      {kind === 'none' ? (
        <View style={[StyleSheet.absoluteFill, shape, styles.solidFallback]} />
      ) : null}

      {kind !== 'liquid' ? (
        <View style={[StyleSheet.absoluteFill, shape, styles.rim]} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  clip: {
    overflow: 'hidden',
  },
  webClip: {
    overflow: 'hidden',
  },
  blurSheen: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },
  solidFallback: {
    // Last-resort translucent fill when native blur/glass is unavailable.
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
  },
  rim: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },
});
