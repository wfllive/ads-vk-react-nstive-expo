import ExpoModulesCore

/**
 * VK Ads Module — iOS stub.
 *
 * The myTarget SDK is currently only available for Android.
 * This iOS implementation is a no-op placeholder.
 *
 * For iOS VK Ads integration, use the myTarget iOS SDK directly:
 * https://github.com/myTargetSDK/mytarget-ios
 */
public class VKAdsModule: Module {
    public func definition() -> ModuleDefinition {
        Name("VKAdsModule")

        // --- Initialization (no-op on iOS) ---
        Function("initialize") {
            print("[VKAds] iOS: SDK not available. Use mytarget-ios directly.")
        }

        Function("setDebugMode") { (enabled: Bool) in
            print("[VKAds] iOS: debug mode set to \(enabled)")
        }

        // --- Banner (no-op on iOS) ---
        Function("loadBanner") { (slotId: Int, adSize: String, refreshAd: Bool) -> String in
            print("[VKAds] iOS: Banner not supported. Use mytarget-ios directly.")
            return ""
        }

        Function("reloadBanner") { (identifier: String) in
            print("[VKAds] iOS: Banner reload not supported.")
        }

        Function("setBannerCustomParams") { (identifier: String, age: Int, gender: Int, email: String, phone: String) in
            print("[VKAds] iOS: Custom params not supported.")
        }

        // --- Interstitial (no-op on iOS) ---
        AsyncFunction("loadInterstitial") { (slotId: Int, promise: Promise) in
            print("[VKAds] iOS: Interstitial not supported.")
            promise.resolve("")
        }

        AsyncFunction("showInterstitial") { (identifier: String, promise: Promise) in
            print("[VKAds] iOS: Interstitial show not supported.")
            promise.resolve(nil)
        }

        Function("setInterstitialCustomParams") { (identifier: String, age: Int, gender: Int, email: String, phone: String) in
            print("[VKAds] iOS: Custom params not supported.")
        }

        // --- Rewarded (no-op on iOS) ---
        AsyncFunction("loadRewarded") { (slotId: Int, promise: Promise) in
            print("[VKAds] iOS: Rewarded not supported.")
            promise.resolve("")
        }

        AsyncFunction("showRewarded") { (identifier: String, promise: Promise) in
            print("[VKAds] iOS: Rewarded show not supported.")
            promise.resolve(nil)
        }

        Function("setRewardedCustomParams") { (identifier: String, age: Int, gender: Int, email: String, phone: String) in
            print("[VKAds] iOS: Custom params not supported.")
        }
    }
}
