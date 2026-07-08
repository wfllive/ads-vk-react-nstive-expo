import type { NativeModule } from 'expo';

/**
 * Supported banner ad sizes
 */
export enum VKAdSize {
  /** 320x50 banner */
  BANNER_320x50 = 'BANNER_320x50',
  /** 300x250 banner (MREC) */
  BANNER_300x250 = 'BANNER_300x250',
  /** 728x90 banner (leaderboard) */
  BANNER_728x90 = 'BANNER_728x90',
  /** Adaptive banner — auto-sizes based on screen width */
  ADAPTIVE = 'ADAPTIVE',
}

/**
 * User gender for ad targeting
 */
export enum VKAdGender {
  UNKNOWN = 0,
  MALE = 1,
  FEMALE = 2,
}

/**
 * Banner ad event callbacks
 */
export interface VKAdsBannerEvents {
  /** Called when the banner ad is successfully loaded */
  onLoad?: () => void;
  /** Called when no ad is available */
  onNoAd?: (reason: string) => void;
  /** Called when the banner is clicked */
  onClick?: () => void;
  /** Called when the banner is displayed */
  onShow?: () => void;
}

/**
 * Interstitial ad event callbacks
 */
export interface VKAdsInterstitialEvents {
  /** Called when the interstitial ad is loaded */
  onLoad?: () => void;
  /** Called when no ad is available */
  onNoAd?: (reason: string) => void;
  /** Called when the interstitial is clicked */
  onClick?: () => void;
  /** Called when the interstitial is displayed */
  onShow?: () => void;
  /** Called when the interstitial is dismissed */
  onDismiss?: () => void;
  /** Called when a video ad playback completes */
  onVideoCompleted?: () => void;
}

/**
 * Rewarded ad event callbacks
 */
export interface VKAdsRewardedEvents {
  /** Called when the rewarded ad is loaded */
  onLoad?: () => void;
  /** Called when no ad is available */
  onNoAd?: (reason: string) => void;
  /** Called when the rewarded ad is clicked */
  onClick?: () => void;
  /** Called when the rewarded ad is displayed */
  onShow?: () => void;
  /** Called when the rewarded ad is dismissed */
  onDismiss?: () => void;
  /** Called when the reward should be granted */
  onReward?: (reward: { type: string; amount: number }) => void;
}

/**
 * Custom parameters for ad targeting
 */
export interface VKAdsCustomParams {
  /** User age */
  age?: number;
  /** User gender */
  gender?: VKAdGender;
  /** User email */
  email?: string;
  /** User phone */
  phone?: string;
}

/**
 * Banner view props
 */
export interface VKAdsBannerViewProps {
  /** Slot ID from your VK Ads partner account */
  slotId: number;
  /** Ad size */
  adSize?: VKAdSize;
  /** Whether to auto-refresh the banner */
  refreshAd?: boolean;
  /** Event callbacks */
  onLoad?: () => void;
  onNoAd?: (reason: string) => void;
  onClick?: () => void;
  onShow?: () => void;
  /** Custom targeting params */
  customParams?: VKAdsCustomParams;
  /** Container style */
  style?: any;
}
