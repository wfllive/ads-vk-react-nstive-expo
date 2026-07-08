import { requireNativeViewManager } from 'expo-modules-core';
import React, { useEffect, useRef } from 'react';
import { Platform, ViewProps, StyleSheet } from 'react-native';

import VKAdsModule from './VKAdsModule';
import type { VKAdsBannerViewProps, VKAdSize } from './VKAds.types';

const NativeBannerView = Platform.OS === 'android'
  ? requireNativeViewManager('VKAdsBannerView')
  : null;

/**
 * VK Ads Banner View component.
 *
 * Displays a banner ad from VK Ad Network (myTarget).
 *
 * @example
 * ```tsx
 * <VKAdsBannerView
 *   slotId={12345}
 *   adSize={VKAdSize.BANNER_320x50}
 *   onLoad={() => console.log('Banner loaded')}
 *   onNoAd={(reason) => console.log('No ad:', reason)}
 * />
 * ```
 */
export function VKAdsBannerView({
  slotId,
  adSize,
  refreshAd = false,
  onLoad,
  onNoAd,
  onClick,
  onShow,
  customParams,
  style,
}: VKAdsBannerViewProps) {
  const identifierRef = useRef<string | null>(null);

  useEffect(() => {
    // Load the banner through the module
    const size = adSize ?? 'ADAPTIVE';
    const id = VKAdsModule.loadBanner(slotId, size, refreshAd);
    identifierRef.current = id;

    return () => {
      // Cleanup handled by native view destroy
    };
  }, [slotId, adSize, refreshAd]);

  if (Platform.OS !== 'android' || !NativeBannerView) {
    // Return empty view on non-Android platforms (no myTarget SDK available)
    return null;
  }

  const adSizeValue: VKAdSize = adSize ?? 'ADAPTIVE' as VKAdSize;

  return (
    <NativeBannerView
      slotId={slotId}
      adSize={adSizeValue}
      refreshAd={refreshAd}
      onLoad={onLoad ? () => onLoad() : undefined}
      onNoAd={
        onNoAd
          ? (event: any) => onNoAd(event.nativeEvent?.reason ?? '')
          : undefined
      }
      onClick={onClick ? () => onClick() : undefined}
      onShow={onShow ? () => onShow() : undefined}
      style={[styles.default, style]}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    width: '100%',
    alignSelf: 'center',
  },
});
