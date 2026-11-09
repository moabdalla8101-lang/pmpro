import Constants from 'expo-constants';
import * as Updates from 'expo-updates';
import { Platform } from 'react-native';
import { getApiUrl } from './getApiUrl';

export function getDebugInfo(userId?: string | null) {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL || getApiUrl();
  return {
    appVersion: Constants.expoConfig?.version ?? '1.0.0',
    buildNumber:
      Constants.expoConfig?.ios?.buildNumber ??
      String(Constants.expoConfig?.android?.versionCode ?? 'n/a'),
    runtimeVersion: Updates.runtimeVersion ?? 'n/a',
    updateId: Updates.updateId ?? 'embedded',
    channel: Updates.channel ?? 'n/a',
    isEmbeddedLaunch: Updates.isEmbeddedLaunch,
    platform: Platform.OS,
    platformVersion: String(Platform.Version),
    apiUrl,
    sentryConfigured: Boolean(process.env.EXPO_PUBLIC_SENTRY_DSN),
    userId: userId || 'guest',
  };
}

export function formatDebugInfo(userId?: string | null): string {
  const info = getDebugInfo(userId);
  return [
    `App: ${info.appVersion} (${info.buildNumber})`,
    `Runtime: ${info.runtimeVersion}`,
    `OTA: ${info.updateId}`,
    `Channel: ${info.channel}`,
    `Embedded: ${info.isEmbeddedLaunch}`,
    `Platform: ${info.platform} ${info.platformVersion}`,
    `API: ${info.apiUrl}`,
    `Sentry: ${info.sentryConfigured ? 'on' : 'off'}`,
    `User: ${info.userId}`,
  ].join('\n');
}
