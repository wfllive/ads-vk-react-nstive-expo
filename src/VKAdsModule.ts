import { NativeModule, requireNativeModule } from 'expo';

import type { VKAdsBannerEvents, VKAdsCustomParams, VKAdSize } from './VKAds.types';

declare class VKAdsModule extends NativeModule {
  /**
   * Initialize the VK Ads SDK. Call this once at app startup.
   */
  initialize(): void;

  /**
   * Set debug mode for testing. Disable in production.
   */
  setDebugMode(enabled: boolean): void;

  // --- Banner ---
  /**
   * Load a banner ad for the given slot ID and size.
   * Returns a unique identifier for the banner.
   */
  loadBanner(slotId: number, adSize: string, refreshAd: boolean): string;

  /**
   * Reload an existing banner.
   */
  reloadBanner(identifier: string): void;

  /**
   * Set custom targeting params for a banner.
   */
  setBannerCustomParams(
    identifier: string,
    age: number,
    gender: number,
    email: string,
    phone: string
  ): void;

  // --- Interstitial ---
  /**
   * Create and load an interstitial ad.
   */
  loadInterstitial(slotId: number): Promise<string>;

  /**
   * Show a loaded interstitial ad.
   */
  showInterstitial(identifier: string): Promise<void>;

  /**
   * Set custom targeting params for an interstitial.
   */
  setInterstitialCustomParams(
    identifier: string,
    age: number,
    gender: number,
    email: string,
    phone: string
  ): void;

  // --- Rewarded ---
  /**
   * Create and load a rewarded video ad.
   */
  loadRewarded(slotId: number): Promise<string>;

  /**
   * Show a loaded rewarded ad.
   */
  showRewarded(identifier: string): Promise<void>;

  /**
   * Set custom targeting params for a rewarded ad.
   */
  setRewardedCustomParams(
    identifier: string,
    age: number,
    gender: number,
    email: string,
    phone: string
  ): void;

  // --- Events ---
  /** Events for banner ads (identifier-based) */
  bannerEvents: Record<string, VKAdsBannerEvents>;
  /** Events for interstitial ads */
  interstitialEvents: Record<string, VKAdsBannerEvents>;
  /** Events for rewarded ads */
  rewardedEvents: Record<string, VKAdsBannerEvents>;
}

export default requireNativeModule<VKAdsModule>('VKAdsModule');
