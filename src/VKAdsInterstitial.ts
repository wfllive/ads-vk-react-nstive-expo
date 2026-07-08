import { Platform } from 'react-native';

import VKAdsModule from './VKAdsModule';
import type { VKAdsInterstitialEvents, VKAdsCustomParams, VKAdGender } from './VKAds.types';

/**
 * VK Ads Interstitial Ad manager.
 *
 * Full-screen interstitial ads from VK Ad Network (myTarget).
 *
 * @example
 * ```ts
 * const interstitial = VKAdsInterstitial.create(12345);
 * interstitial.onLoad(() => interstitial.show());
 * interstitial.load();
 * ```
 */
export class VKAdsInterstitial {
  private _identifier: string | null = null;
  private _slotId: number;
  private _listeners: VKAdsInterstitialEvents = {};

  private constructor(slotId: number) {
    this._slotId = slotId;
  }

  /**
   * Create a new interstitial ad instance.
   */
  static create(slotId: number): VKAdsInterstitial {
    if (Platform.OS !== 'android') {
      console.warn('[VKAds] Interstitial ads are only supported on Android.');
      return new VKAdsInterstitial(slotId);
    }
    return new VKAdsInterstitial(slotId);
  }

  /**
   * Register event listeners.
   */
  onLoad(callback: () => void): this {
    this._listeners.onLoad = callback;
    return this;
  }

  onNoAd(callback: (reason: string) => void): this {
    this._listeners.onNoAd = callback;
    return this;
  }

  onClick(callback: () => void): this {
    this._listeners.onClick = callback;
    return this;
  }

  onShow(callback: () => void): this {
    this._listeners.onShow = callback;
    return this;
  }

  onDismiss(callback: () => void): this {
    this._listeners.onDismiss = callback;
    return this;
  }

  onVideoCompleted(callback: () => void): this {
    this._listeners.onVideoCompleted = callback;
    return this;
  }

  /**
   * Set custom targeting parameters.
   */
  setCustomParams(params: VKAdsCustomParams): this {
    if (Platform.OS !== 'android') return this;
    VKAdsModule.setInterstitialCustomParams(
      this._slotId.toString(),
      params.age ?? -1,
      params.gender ?? VKAdGender.UNKNOWN,
      params.email ?? '',
      params.phone ?? ''
    );
    return this;
  }

  /**
   * Load the interstitial ad.
   */
  async load(): Promise<void> {
    if (Platform.OS !== 'android') {
      console.warn('[VKAds] Interstitial ads are only supported on Android.');
      return;
    }

    try {
      const id = await VKAdsModule.loadInterstitial(this._slotId);
      this._identifier = id;
      this._subscribeToEvents();
    } catch (error) {
      console.error('[VKAds] Failed to load interstitial:', error);
      throw error;
    }
  }

  /**
   * Show the loaded interstitial ad.
   */
  async show(): Promise<void> {
    if (Platform.OS !== 'android') {
      console.warn('[VKAds] Interstitial ads are only supported on Android.');
      return;
    }

    if (!this._identifier) {
      console.warn('[VKAds] Interstitial not loaded. Call load() first.');
      return;
    }

    try {
      await VKAdsModule.showInterstitial(this._identifier);
    } catch (error) {
      console.error('[VKAds] Failed to show interstitial:', error);
      throw error;
    }
  }

  private _subscribeToEvents(): void {
    if (!this._identifier) return;

    // Store listeners for native event dispatch
    VKAdsModule.interstitialEvents = {
      ...VKAdsModule.interstitialEvents,
      [this._identifier]: this._listeners,
    };
  }
}
