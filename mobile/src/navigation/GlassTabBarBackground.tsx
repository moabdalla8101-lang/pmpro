import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { requireOptionalNativeModule } from 'expo';

type GlassKind = 'liquid' | 'blur' | 'none';

let cachedKind: GlassKind | undefined;
let LiquidGlassView: React.ComponentType<any> | null = null;
let NativeBlurView: React.ComponentType<any> | null = null;

/**
 * OTA bundles can land on binaries built before a native module was added,
 * so each module is required lazily and only after confirming it is linked.
 */
function resolveGlassKind(): GlassKind {
  if (cachedKind) return cachedKind;
  cachedKind = 'none';
  if (Platform.OS !== 'ios') return cachedKind;

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

  try {
    if (requireOptionalNativeModule('ExpoBlur')) {
      NativeBlurView = require('expo-blur').BlurView;
      cachedKind = 'blur';
    }
  } catch {}

  return cachedKind;
}

export default function GlassTabBarBackground({ radius }: { radius: number }) {
  const kind = resolveGlassKind();
  const shape = { borderRadius: radius };

  return (
    <View style={[StyleSheet.absoluteFill, shape, styles.clip]}>
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

      {kind === 'none' ? (
        <View style={[StyleSheet.absoluteFill, styles.solidFallback]} />
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
  blurSheen: {
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
  },
  solidFallback: {
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
  },
  rim: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },
});
