import { Platform } from 'react-native';

import VKAdsModule from './VKAdsModule';
import type { VKAdsRewardedEvents, VKAdsCustomParams, VKAdGender } from './VKAds.types';

/**
 * VK Ads Rewarded Ad manager.
 *
 * Rewarded video ads from VK Ad Network (myTarget).
 * Users earn rewards for watching the full video ad.
 *
 * @example
 * ```ts
 * const rewarded = VKAdsRewarded.create(12345);
 * rewarded.onReward((reward) => console.log('Reward:', reward));
 * rewarded.onLoad(() => rewarded.show());
 * rewarded.load();
 * ```
 */
export class VKAdsRewarded {
  private _identifier: string | null = null;
  private _slotId: number;
  private _listeners: VKAdsRewardedEvents = {};

  private constructor(slotId: number) {
    this._slotId = slotId;
  }

  /**
   * Create a new rewarded ad instance.
   */
  static create(slotId: number): VKAdsRewarded {
    if (Platform.OS !== 'android') {
      console.warn('[VKAds] Rewarded ads are only supported on Android.');
      return new VKAdsRewarded(slotId);
    }
    return new VKAdsRewarded(slotId);
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

  /**
   * Called when the user has earned a reward.
   */
  onReward(callback: (reward: { type: string; amount: number }) => void): this {
    this._listeners.onReward = callback;
    return this;
  }

  /**
   * Set custom targeting parameters.
   */
  setCustomParams(params: VKAdsCustomParams): this {
    if (Platform.OS !== 'android') return this;
    VKAdsModule.setRewardedCustomParams(
      this._slotId.toString(),
      params.age ?? -1,
      params.gender ?? VKAdGender.UNKNOWN,
      params.email ?? '',
      params.phone ?? ''
    );
    return this;
  }

  /**
   * Load the rewarded ad.
   */
  async load(): Promise<void> {
    if (Platform.OS !== 'android') {
      console.warn('[VKAds] Rewarded ads are only supported on Android.');
      return;
    }

    try {
      const id = await VKAdsModule.loadRewarded(this._slotId);
      this._identifier = id;
      this._subscribeToEvents();
    } catch (error) {
      console.error('[VKAds] Failed to load rewarded ad:', error);
      throw error;
    }
  }

  /**
   * Show the loaded rewarded ad.
   */
  async show(): Promise<void> {
    if (Platform.OS !== 'android') {
      console.warn('[VKAds] Rewarded ads are only supported on Android.');
      return;
    }

    if (!this._identifier) {
      console.warn('[VKAds] Rewarded ad not loaded. Call load() first.');
      return;
    }

    try {
      await VKAdsModule.showRewarded(this._identifier);
    } catch (error) {
      console.error('[VKAds] Failed to show rewarded ad:', error);
      throw error;
    }
  }

  private _subscribeToEvents(): void {
    if (!this._identifier) return;

    VKAdsModule.rewardedEvents = {
      ...VKAdsModule.rewardedEvents,
      [this._identifier]: this._listeners,
    };
  }
}
