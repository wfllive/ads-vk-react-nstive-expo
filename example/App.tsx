import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';

import {
  VKAds,
  VKAdsBannerView,
  VKAdsInterstitial,
  VKAdsRewarded,
  VKAdSize,
  VKAdGender,
} from 'ads-vk-react-native-expo';

// ==================== CONFIGURATION ====================
// Replace these with your real slot IDs from VK Ads partner account:
// https://ads.vk.com/en/partner
const SLOT_IDS = {
  BANNER_320x50: 12345,    // Replace with your banner slot ID
  BANNER_300x250: 12346,   // Replace with your MREC slot ID
  INTERSTITIAL: 12347,     // Replace with your interstitial slot ID
  REWARDED: 12348,         // Replace with your rewarded slot ID
};

// ==================== APP ====================

export default function App() {
  const [interstitialReady, setInterstitialReady] = useState(false);
  const [rewardedReady, setRewardedReady] = useState(false);

  useEffect(() => {
    // Initialize VK Ads SDK
    VKAds.initialize();

    // Enable debug mode in development
    if (__DEV__) {
      VKAds.setDebugMode(true);
      console.log('[Demo] VK Ads SDK initialized in debug mode');
    }
  }, []);

  // --- Interstitial ---
  const handleLoadInterstitial = useCallback(() => {
    const interstitial = VKAdsInterstitial.create(SLOT_IDS.INTERSTITIAL);

    interstitial
      .setCustomParams({
        age: 25,
        gender: VKAdGender.MALE,
      })
      .onLoad(() => {
        console.log('[Demo] Interstitial loaded');
        setInterstitialReady(true);
      })
      .onNoAd((reason) => {
        console.warn('[Demo] Interstitial no ad:', reason);
        Alert.alert('No Ad', `No interstitial available: ${reason}`);
      })
      .onShow(() => {
        console.log('[Demo] Interstitial shown');
      })
      .onDismiss(() => {
        console.log('[Demo] Interstitial dismissed');
        setInterstitialReady(false);
      })
      .load()
      .catch((error) => {
        console.error('[Demo] Interstitial load error:', error);
      });
  }, []);

  const handleShowInterstitial = useCallback(() => {
    // Interstitial is shown inside the load callback via onLoad
    // Re-create and load if needed
    const interstitial = VKAdsInterstitial.create(SLOT_IDS.INTERSTITIAL);

    interstitial
      .onLoad(() => {
        interstitial.show().catch(console.error);
      })
      .onDismiss(() => {
        console.log('[Demo] Interstitial dismissed');
      })
      .load()
      .catch(console.error);
  }, []);

  // --- Rewarded ---
  const handleLoadRewarded = useCallback(() => {
    const rewarded = VKAdsRewarded.create(SLOT_IDS.REWARDED);

    rewarded
      .onLoad(() => {
        console.log('[Demo] Rewarded ad loaded');
        setRewardedReady(true);
      })
      .onNoAd((reason) => {
        console.warn('[Demo] Rewarded no ad:', reason);
        Alert.alert('No Ad', `No rewarded ad available: ${reason}`);
      })
      .onReward((reward) => {
        console.log('[Demo] Reward granted:', reward);
        Alert.alert(
          'Reward! 🎉',
          `You earned: ${reward.amount} ${reward.type}`
        );
      })
      .onDismiss(() => {
        console.log('[Demo] Rewarded dismissed');
        setRewardedReady(false);
      })
      .load()
      .catch((error) => {
        console.error('[Demo] Rewarded load error:', error);
      });
  }, []);

  const handleShowRewarded = useCallback(() => {
    const rewarded = VKAdsRewarded.create(SLOT_IDS.REWARDED);

    rewarded
      .onLoad(() => {
        rewarded.show().catch(console.error);
      })
      .onReward((reward) => {
        Alert.alert('Reward!', `You earned: ${reward.amount} ${reward.type}`);
      })
      .load()
      .catch(console.error);
  }, []);

  // ==================== RENDER ====================

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>VK Ads Demo</Text>
          <Text style={styles.subtitle}>
            React Native Expo • myTarget SDK {Platform.OS}
          </Text>
          {Platform.OS !== 'android' && (
            <Text style={styles.warning}>
              ⚠️ VK Ads SDK is only available on Android.{'\n'}
              Run this example on an Android device.
            </Text>
          )}
        </View>

        {/* Banner Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📢 Banner Ad (320x50)</Text>
          <Text style={styles.sectionDesc}>
            Standard banner displayed at the bottom
          </Text>
          <VKAdsBannerView
            slotId={SLOT_IDS.BANNER_320x50}
            adSize={VKAdSize.BANNER_320x50}
            refreshAd={false}
            onLoad={() => console.log('[Demo] 320x50 Banner loaded')}
            onNoAd={(reason) =>
              console.warn('[Demo] 320x50 Banner no ad:', reason)
            }
            onClick={() => console.log('[Demo] 320x50 Banner clicked')}
            style={styles.banner}
          />
        </View>

        {/* MREC Banner Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📢 MREC Banner (300x250)</Text>
          <Text style={styles.sectionDesc}>
            Medium rectangle — great for in-feed placements
          </Text>
          <View style={styles.mrecContainer}>
            <VKAdsBannerView
              slotId={SLOT_IDS.BANNER_300x250}
              adSize={VKAdSize.BANNER_300x250}
              refreshAd={false}
              onLoad={() => console.log('[Demo] 300x250 Banner loaded')}
              onNoAd={(reason) =>
                console.warn('[Demo] 300x250 Banner no ad:', reason)
              }
              onClick={() => console.log('[Demo] 300x250 Banner clicked')}
              style={styles.mrecBanner}
            />
          </View>
        </View>

        {/* Interstitial Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🖼️ Interstitial Ad</Text>
          <Text style={styles.sectionDesc}>
            Full-screen ad between content transitions
          </Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.button}
              onPress={handleLoadInterstitial}
            >
              <Text style={styles.buttonText}>Load Interstitial</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonSecondary]}
              onPress={handleShowInterstitial}
            >
              <Text style={styles.buttonTextSecondary}>
                Show (Auto-load)
              </Text>
            </TouchableOpacity>
          </View>
          {interstitialReady && (
            <Text style={styles.statusReady}>✅ Interstitial loaded</Text>
          )}
        </View>

        {/* Rewarded Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎁 Rewarded Ad</Text>
          <Text style={styles.sectionDesc}>
            Users watch a video and earn a reward
          </Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.button}
              onPress={handleLoadRewarded}
            >
              <Text style={styles.buttonText}>Load Rewarded</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonSecondary]}
              onPress={handleShowRewarded}
            >
              <Text style={styles.buttonTextSecondary}>
                Show (Auto-load)
              </Text>
            </TouchableOpacity>
          </View>
          {rewardedReady && (
            <Text style={styles.statusReady}>✅ Rewarded ad loaded</Text>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            VK Ads React Native Expo • v0.1.0
          </Text>
          <Text style={styles.footerText}>
            github.com/wfllive/ads-vk-react-native-expo
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ==================== STYLES ====================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  warning: {
    fontSize: 12,
    color: '#e67e22',
    marginTop: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  sectionDesc: {
    fontSize: 13,
    color: '#888',
    marginBottom: 12,
  },
  banner: {
    height: 50,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  mrecContainer: {
    alignItems: 'center',
  },
  mrecBanner: {
    width: 300,
    height: 250,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
    backgroundColor: '#4a90d9',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#4a90d9',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  buttonTextSecondary: {
    color: '#4a90d9',
    fontWeight: '600',
    fontSize: 14,
  },
  statusReady: {
    marginTop: 10,
    color: '#27ae60',
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 2,
  },
});
