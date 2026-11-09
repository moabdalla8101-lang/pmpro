import * as Sentry from '@sentry/react-native';
import Constants from 'expo-constants';
import * as Updates from 'expo-updates';

const dsn =
  process.env.EXPO_PUBLIC_SENTRY_DSN ||
  (Constants.expoConfig?.extra as { sentryDsn?: string } | undefined)?.sentryDsn;

let initialized = false;

export function initSentry() {
  if (initialized) return;
  initialized = true;

  if (!dsn) {
    if (__DEV__) {
      console.log('[sentry] EXPO_PUBLIC_SENTRY_DSN not set — skipping init');
    }
    return;
  }

  const buildNumber =
    Constants.expoConfig?.ios?.buildNumber ??
    String(Constants.expoConfig?.android?.versionCode ?? '');
  const appVersion = Constants.expoConfig?.version ?? '1.0.0';
  const updateId = Updates.updateId ?? 'embedded';

  Sentry.init({
    dsn,
    enabled: !__DEV__,
    tracesSampleRate: 0.2,
    enableAutoSessionTracking: true,
    environment: __DEV__ ? 'development' : 'production',
    release: `pmp-exam-prep@${appVersion}+${buildNumber || 'local'}`,
    dist: String(updateId),
    ignoreErrors: [
      'Network Error',
      'Network request failed',
      'timeout of',
      'Request aborted',
    ],
  });

  Sentry.setTag('otaUpdateId', String(updateId));
  Sentry.setTag('runtimeVersion', Updates.runtimeVersion ?? 'unknown');
}

export function setSentryUser(user: { id: string; email?: string | null } | null) {
  if (!dsn) return;
  if (!user) {
    Sentry.setUser(null);
    return;
  }
  Sentry.setUser({
    id: user.id,
    email: user.email || undefined,
  });
}

export function captureApiError(error: unknown, context?: Record<string, unknown>) {
  if (!dsn) return;
  Sentry.withScope((scope) => {
    if (context) {
      scope.setContext('api', context);
    }
    Sentry.captureException(error);
  });
}

export { Sentry };
