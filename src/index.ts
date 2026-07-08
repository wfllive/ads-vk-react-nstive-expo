import { Platform } from 'react-native';

import VKAdsModule from './VKAdsModule';
import { VKAdGender } from './VKAds.types';

// Export all types
export {
  VKAdSize,
  VKAdGender,
  VKAdsCustomParams,
  VKAdsBannerEvents,
  VKAdsInterstitialEvents,
  VKAdsRewardedEvents,
  VKAdsBannerViewProps,
} from './VKAds.types';

// Export components
export { VKAdsBannerView } from './VKAdsBannerView';
export { VKAdsInterstitial } from './VKAdsInterstitial';
export { VKAdsRewarded } from './VKAdsRewarded';

/**
 * VK Ads SDK initialization and configuration methods.
 */
export const VKAds = {
  /**
   * Initialize the VK Ads SDK.
   * Call this once at app startup, before loading any ads.
   *
   * @example
   * ```ts
   * useEffect(() => {
   *   VKAds.initialize();
   * }, []);
   * ```
   */
  initialize(): void {
    if (Platform.OS !== 'android') {
      console.log('[VKAds] SDK only available on Android.');
      return;
    }
    VKAdsModule.initialize();
  },

  /**
   * Enable or disable debug mode.
   * Debug mode shows test ads and logs additional info.
   * Disable in production builds.
   *
   * @example
   * ```ts
   * if (__DEV__) {
   *   VKAds.setDebugMode(true);
   * }
   * ```
   */
  setDebugMode(enabled: boolean): void {
    if (Platform.OS !== 'android') return;
    VKAdsModule.setDebugMode(enabled);
  },
};
