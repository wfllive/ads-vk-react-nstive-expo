# ads-vk-react-native-expo

VK Ads (myTarget) SDK for **React Native Expo** — full support for Banner, Interstitial, and Rewarded video ads.

> ⚠️ **Platform note**: The myTarget SDK is currently only available for **Android**. iOS support stub is provided; for iOS, use [mytarget-ios](https://github.com/myTargetSDK/mytarget-ios) directly.

## Features

- ✅ **Banner Ads** — 320x50, 300x250 (MREC), 728x90, Adaptive
- ✅ **Interstitial Ads** — Full-screen ads with load/show lifecycle
- ✅ **Rewarded Video Ads** — Users earn rewards for watching
- ✅ **Custom Targeting** — Age, gender, email, phone params
- ✅ **Expo Config Plugin** — Auto-configures AndroidManifest
- ✅ **TypeScript** — Fully typed API
- ✅ **Expo Modules API** — Modern JSI-based native module

## Installation

```bash
npm install ads-vk-react-native-expo
# or
yarn add ads-vk-react-native-expo
```

### Expo Config Plugin

Add the plugin to your `app.json` or `app.config.js`:

```json
{
  "plugins": [
    ["ads-vk-react-native-expo", { "debugMode": false }]
  ]
}
```

This automatically adds:
- `INTERNET` and `ACCESS_NETWORK_STATE` permissions
- `MyTargetActivity` declaration (required by the SDK)

Then rebuild your development build:

```bash
npx expo run:android
```

## Usage

### Initialize the SDK

```tsx
import { VKAds } from 'ads-vk-react-native-expo';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    VKAds.initialize();
    
    if (__DEV__) {
      VKAds.setDebugMode(true);
    }
  }, []);
}
```

### Banner Ad

```tsx
import { VKAdsBannerView, VKAdSize } from 'ads-vk-react-native-expo';

function MyScreen() {
  return (
    <View>
      {/* Your content */}
      
      <VKAdsBannerView
        slotId={12345}                          // Your slot ID
        adSize={VKAdSize.BANNER_320x50}         // Optional: default is adaptive
        refreshAd={false}                       // Auto-refresh
        onLoad={() => console.log('Loaded')}
        onNoAd={(reason) => console.log('No ad:', reason)}
        onClick={() => console.log('Clicked')}
        onShow={() => console.log('Shown')}
        customParams={{
          age: 25,
          gender: VKAdGender.MALE,
        }}
      />
    </View>
  );
}
```

### Interstitial Ad

```tsx
import { VKAdsInterstitial, VKAdGender } from 'ads-vk-react-native-expo';

function showInterstitial() {
  const interstitial = VKAdsInterstitial.create(12347);

  interstitial
    .setCustomParams({
      age: 30,
      gender: VKAdGender.FEMALE,
    })
    .onLoad(() => {
      console.log('Interstitial ready');
      interstitial.show();
    })
    .onShow(() => console.log('Showing interstitial'))
    .onDismiss(() => console.log('Interstitial closed'))
    .onNoAd((reason) => console.warn('No ad:', reason))
    .load();
}
```

### Rewarded Ad

```tsx
import { VKAdsRewarded } from 'ads-vk-react-native-expo';

function showRewarded() {
  const rewarded = VKAdsRewarded.create(12348);

  rewarded
    .onLoad(() => {
      console.log('Rewarded ready');
      rewarded.show();
    })
    .onReward((reward) => {
      console.log('User earned:', reward.amount, reward.type);
      // Grant in-game currency, lives, etc.
    })
    .onDismiss(() => console.log('Rewarded closed'))
    .onNoAd((reason) => console.warn('No ad:', reason))
    .load();
}
```

## API Reference

### `VKAds`

| Method | Description |
|--------|-------------|
| `VKAds.initialize()` | Initialize the SDK. Call once at app startup. |
| `VKAds.setDebugMode(enabled)` | Enable test ads and verbose logging. |

### `VKAdsBannerView`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `slotId` | `number` | **Required** | Slot ID from VK Ads partner account |
| `adSize` | `VKAdSize` | `ADAPTIVE` | Banner size |
| `refreshAd` | `boolean` | `false` | Auto-refresh banner |
| `onLoad` | `() => void` | — | Banner loaded |
| `onNoAd` | `(reason: string) => void` | — | No ad available |
| `onClick` | `() => void` | — | Banner clicked |
| `onShow` | `() => void` | — | Banner displayed |
| `customParams` | `VKAdsCustomParams` | — | Targeting params |

### `VKAdSize`

| Value | Dimensions |
|-------|-----------|
| `VKAdSize.BANNER_320x50` | 320 × 50 dp |
| `VKAdSize.BANNER_300x250` | 300 × 250 dp (MREC) |
| `VKAdSize.BANNER_728x90` | 728 × 90 dp (Leaderboard) |
| `VKAdSize.ADAPTIVE` | Adaptive (auto-width) |

### `VKAdsInterstitial`

| Method | Description |
|--------|-------------|
| `VKAdsInterstitial.create(slotId)` | Create interstitial instance |
| `.load()` | Load the ad |
| `.show()` | Display the loaded ad |
| `.setCustomParams(params)` | Set targeting params |
| `.onLoad(cb)` | Ad loaded callback |
| `.onNoAd(cb)` | No ad available callback |
| `.onClick(cb)` | Ad clicked callback |
| `.onShow(cb)` | Ad displayed callback |
| `.onDismiss(cb)` | Ad dismissed callback |
| `.onVideoCompleted(cb)` | Video completed callback |

### `VKAdsRewarded`

| Method | Description |
|--------|-------------|
| `VKAdsRewarded.create(slotId)` | Create rewarded instance |
| `.load()` | Load the ad |
| `.show()` | Display the loaded ad |
| `.setCustomParams(params)` | Set targeting params |
| `.onLoad(cb)` | Ad loaded callback |
| `.onNoAd(cb)` | No ad available callback |
| `.onClick(cb)` | Ad clicked callback |
| `.onShow(cb)` | Ad displayed callback |
| `.onDismiss(cb)` | Ad dismissed callback |
| `.onReward(cb)` | Reward granted callback `({ type, amount })` |

### `VKAdsCustomParams`

| Field | Type | Description |
|-------|------|-------------|
| `age` | `number` | User age |
| `gender` | `VKAdGender` | `MALE` / `FEMALE` / `UNKNOWN` |
| `email` | `string` | User email |
| `phone` | `string` | User phone |

## Getting Slot IDs

1. Go to [VK Ads Partner Account](https://ads.vk.com/en/partner)
2. Add your app
3. Create ad units (Banner, Interstitial, Rewarded)
4. Copy the **slot_id** from each ad unit

## Requirements

- **Expo SDK 50+** (with Expo Modules API)
- **React Native 0.73+**
- **Android 5.0+** (API 23+ for the module)
- **Development Build** (not Expo Go — requires native code)

## Architecture

```
ads-vk-react-native-expo/
├── src/                          # TypeScript source
│   ├── index.ts                  # Public API exports
│   ├── VKAdsModule.ts            # Native module binding
│   ├── VKAdsBannerView.tsx       # Banner React component
│   ├── VKAdsInterstitial.ts      # Interstitial ad manager
│   ├── VKAdsRewarded.ts          # Rewarded ad manager
│   └── VKAds.types.ts            # TypeScript types & enums
├── android/                      # Android native code
│   ├── build.gradle              # Gradle config with myTarget SDK
│   └── src/main/
│       ├── AndroidManifest.xml   # Required permissions
│       └── java/expo/modules/vkads/
│           ├── VKAdsModule.kt    # Core module (banner, interstitial, rewarded)
│           ├── VKAdsBannerView.kt # Banner view component
│           └── VKAdsViewManager.kt # View manager registration
├── ios/                          # iOS stubs
│   └── VKAdsModule.swift         # No-op iOS implementation
├── example/
│   └── App.tsx                   # Full demo app
├── app.plugin.js                 # Expo Config Plugin
├── expo-module.config.json       # Module configuration
└── package.json
```

## Based On

- [myTarget Android SDK](https://github.com/myTargetSDK/mytarget-android) — `com.my.target:mytarget-sdk:5.45.2`
- [VK Ads Documentation](https://ads.vk.com/en/help/articles/partner_android_banner)

## License

MIT
