import { useWindowDimensions } from 'react-native';

/** Content column cap so iPad (any orientation or window size) keeps phone-like proportions. */
export const CONTENT_MAX_WIDTH = 760;

export function useContentWidth() {
  const { width } = useWindowDimensions();
  return Math.min(width, CONTENT_MAX_WIDTH);
}
