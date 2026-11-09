import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ExpoSplashScreen from 'expo-splash-screen';
import { Text } from 'react-native-paper';

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

const STATUS_PHRASES = [
  'Analyzing diagnostic baseline...',
  'Calibrating Agile & Predictive mix...',
  'Preparing your personalized study plan...',
];

export default function SplashScreen() {
  const progress = useRef(new Animated.Value(0.15)).current;
  const [percent, setPercent] = useState(15);
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    ExpoSplashScreen.hideAsync().catch(() => {});
  }, []);

  useEffect(() => {
    const listenerId = progress.addListener(({ value }) => {
      setPercent(Math.round(value * 100));
    });

    Animated.sequence([
      Animated.timing(progress, {
        toValue: 0.85,
        duration: 4200,
        easing: Easing.bezier(0.16, 1, 0.3, 1),
        useNativeDriver: false,
      }),
      Animated.timing(progress, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
    ]).start();

    const phraseTimer = setInterval(() => {
      setPhraseIndex((i) => Math.min(i + 1, STATUS_PHRASES.length - 1));
    }, 1600);

    return () => {
      progress.removeListener(listenerId);
      clearInterval(phraseTimer);
    };
  }, [progress]);

  const barWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.ambientTop} />
      <View style={styles.ambientRight} />
      <View style={styles.ambientBottom} />

      <View style={styles.brandBlock}>
        <View style={styles.iconAura}>
          <View style={styles.iconWrap}>
            <Image
              source={require('../../assets/icon.png')}
              style={styles.icon}
              resizeMode="cover"
            />
          </View>
          <View style={styles.liveDotOuter}>
            <View style={styles.liveDot} />
          </View>
        </View>

        <View style={styles.badge}>
          <View style={styles.badgeDot} />
          <Text style={styles.badgeText}>EXAM SIMULATOR</Text>
        </View>

        <Text style={styles.title}>PMPro</Text>
        <Text style={styles.tagline}>
          Master the mindset. Pass with confidence.
        </Text>

        <View style={styles.domainRow}>
          <Text style={styles.domainPill}>People</Text>
          <View style={styles.domainSep} />
          <Text style={styles.domainPill}>Process</Text>
          <View style={styles.domainSep} />
          <Text style={styles.domainPill}>Business</Text>
        </View>
      </View>

      <View style={styles.bottomBlock}>
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel} numberOfLines={1}>
              {STATUS_PHRASES[phraseIndex]}
            </Text>
            <Text style={styles.progressPercent}>{percent}%</Text>
          </View>

          <View style={styles.track}>
            <AnimatedGradient
              colors={['#6D28D9', '#7C3AED', '#00D2B4']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={[styles.fill, { width: barWidth }]}
            />
          </View>

          <View style={styles.checkpointRow}>
            <Text style={styles.checkpointDone}>✓ ECO Weighting</Text>
            <Text style={styles.checkpointDone}>✓ Agile Matrix</Text>
            <Text style={styles.checkpointActive}>… Daily Quotas</Text>
          </View>
        </View>

        <Text style={styles.footer}>
          Aligned with PMI PMBOK® Guide & ECO
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FF',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 72,
    paddingBottom: 36,
  },
  ambientTop: {
    position: 'absolute',
    top: -80,
    left: -60,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(124, 58, 237, 0.18)',
  },
  ambientRight: {
    position: 'absolute',
    top: '32%',
    right: -90,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(0, 210, 180, 0.14)',
  },
  ambientBottom: {
    position: 'absolute',
    bottom: -40,
    left: '20%',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  brandBlock: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 24,
  },
  iconAura: {
    marginBottom: 18,
    position: 'relative',
  },
  iconWrap: {
    width: 112,
    height: 112,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#004AC6',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  icon: {
    width: '100%',
    height: '100%',
  },
  liveDotOuter: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00D2B4',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(245, 243, 255, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(196, 181, 253, 0.8)',
    marginBottom: 10,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00D2B4',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: '#6D28D9',
  },
  title: {
    fontSize: 30,
    lineHeight: 38,
    fontWeight: '800',
    letterSpacing: -0.6,
    color: '#6D28D9',
  },
  tagline: {
    marginTop: 6,
    fontSize: 15,
    lineHeight: 22,
    color: '#565e74',
    textAlign: 'center',
    maxWidth: 260,
  },
  domainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    gap: 6,
  },
  domainPill: {
    fontSize: 11,
    fontWeight: '600',
    color: '#565e74',
    backgroundColor: 'rgba(255,255,255,0.85)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(195, 198, 215, 0.5)',
  },
  domainSep: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#c3c6d7',
  },
  bottomBlock: {
    gap: 12,
  },
  progressCard: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(195, 198, 215, 0.45)',
    shadowColor: '#0f172a',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    gap: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  progressLabel: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#0d1c2e',
  },
  progressPercent: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6D28D9',
  },
  track: {
    height: 8,
    borderRadius: 999,
    backgroundColor: '#e6eeff',
    overflow: 'hidden',
    padding: 1,
  },
  fill: {
    height: '100%',
    borderRadius: 999,
  },
  checkpointRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 4,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#eff4ff',
  },
  checkpointDone: {
    fontSize: 10,
    color: '#565e74',
  },
  checkpointActive: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6D28D9',
  },
  footer: {
    textAlign: 'center',
    fontSize: 11,
    color: '#434655',
  },
});
