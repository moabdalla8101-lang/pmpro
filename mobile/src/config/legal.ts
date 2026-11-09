import { Alert, Linking } from 'react-native';

export const WEBSITE_URL = 'https://www.pmproapp.com';
export const SUPPORT_EMAIL = 'info@pmproapp.com';
export const APPLE_EULA_URL =
  'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/';
export const MANAGE_SUBSCRIPTIONS_URL = 'https://apps.apple.com/account/subscriptions';

export const PMI_DISCLAIMER =
  'PMP Exam Prep is not affiliated with, endorsed by, or sponsored by the Project Management Institute (PMI). PMP and PMI are registered marks of the Project Management Institute, Inc.';

export const privacyPolicyUrl = () => `${WEBSITE_URL}/privacy`;
export const termsOfUseUrl = () => `${WEBSITE_URL}/terms`;
export const supportUrl = () => `${WEBSITE_URL}/support`;

export async function openExternalUrl(url: string, fallbackMessage = url) {
  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert('Unable to open link', fallbackMessage);
  }
}

export function emailSupport() {
  return openExternalUrl(
    `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('PMP Exam Prep support')}`,
    `Email us at ${SUPPORT_EMAIL}`
  );
}
