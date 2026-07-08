package expo.modules.vkads

import android.app.Activity
import android.util.Log
import com.my.target.common.MyTargetManager
import com.my.target.common.CustomParams
import com.my.target.ads.InterstitialAd
import com.my.target.ads.RewardedAd
import expo.modules.kotlin.Promise
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.util.UUID

class VKAdsModule : Module() {
    companion object {
        const val TAG = "VKAdsModule"

        // Store active ad instances
        private val bannerAds = mutableMapOf<String, BannerAdWrapper>()
        private val interstitialAds = mutableMapOf<String, InterstitialAdWrapper>()
        private val rewardedAds = mutableMapOf<String, RewardedAdWrapper>()
    }

    override fun definition() = ModuleDefinition {
        Name("VKAdsModule")

        // --- Initialization ---
        Function("initialize") {
            Log.d(TAG, "VK Ads SDK initialized")
        }

        Function("setDebugMode") { enabled: Boolean ->
            MyTargetManager.setDebugMode(enabled)
            Log.d(TAG, "VK Ads SDK debug mode: $enabled")
        }

        // --- Banner ---
        Function("loadBanner") { slotId: Int, adSize: String, refreshAd: Boolean ->
            val identifier = "banner_${UUID.randomUUID()}"
            val size = parseAdSize(adSize)
            val context = appContext.reactContext ?: return@Function ""

            val bannerWrapper = BannerAdWrapper(context, slotId, size, refreshAd)
            bannerAds[identifier] = bannerWrapper
            bannerWrapper.load()

            Log.d(TAG, "Banner created: $identifier, slotId=$slotId, size=$adSize")
            identifier
        }

        Function("reloadBanner") { identifier: String ->
            bannerAds[identifier]?.reload()
        }

        Function("setBannerCustomParams") {
            identifier: String, age: Int, gender: Int, email: String, phone: String ->
            bannerAds[identifier]?.setCustomParams(age, gender, email, phone)
        }

        // --- Interstitial ---
        AsyncFunction("loadInterstitial") { slotId: Int, promise: Promise ->
            val identifier = "interstitial_${UUID.randomUUID()}"
            val activity = appContext.currentActivity
                ?: throw IllegalStateException("No current activity")

            val interstitialWrapper = InterstitialAdWrapper(slotId, activity)
            interstitialAds[identifier] = interstitialWrapper

            interstitialWrapper.load(
                onLoad = { promise.resolve(identifier) },
                onNoAd = { reason -> promise.reject("NO_AD", reason, null) }
            )

            Log.d(TAG, "Interstitial loading: $identifier, slotId=$slotId")
        }

        AsyncFunction("showInterstitial") { identifier: String, promise: Promise ->
            val ad = interstitialAds[identifier]
            if (ad != null) {
                ad.show()
                promise.resolve(null)
            } else {
                promise.reject("NOT_FOUND", "Interstitial $identifier not found", null)
            }
        }

        Function("setInterstitialCustomParams") {
            identifier: String, age: Int, gender: Int, email: String, phone: String ->
            interstitialAds[identifier]?.setCustomParams(age, gender, email, phone)
        }

        // --- Rewarded ---
        AsyncFunction("loadRewarded") { slotId: Int, promise: Promise ->
            val identifier = "rewarded_${UUID.randomUUID()}"
            val activity = appContext.currentActivity
                ?: throw IllegalStateException("No current activity")

            val rewardedWrapper = RewardedAdWrapper(slotId, activity)
            rewardedAds[identifier] = rewardedWrapper

            rewardedWrapper.load(
                onLoad = { promise.resolve(identifier) },
                onNoAd = { reason -> promise.reject("NO_AD", reason, null) }
            )

            Log.d(TAG, "Rewarded loading: $identifier, slotId=$slotId")
        }

        AsyncFunction("showRewarded") { identifier: String, promise: Promise ->
            val ad = rewardedAds[identifier]
            if (ad != null) {
                ad.show()
                promise.resolve(null)
            } else {
                promise.reject("NOT_FOUND", "Rewarded ad $identifier not found", null)
            }
        }

        Function("setRewardedCustomParams") {
            identifier: String, age: Int, gender: Int, email: String, phone: String ->
            rewardedAds[identifier]?.setCustomParams(age, gender, email, phone)
        }
    }

    private fun parseAdSize(size: String): com.my.target.ads.MyTargetView.AdSize {
        return when (size) {
            "BANNER_320x50" -> com.my.target.ads.MyTargetView.AdSize.ADSIZE_320x50
            "BANNER_300x250" -> com.my.target.ads.MyTargetView.AdSize.ADSIZE_300x250
            "BANNER_728x90" -> com.my.target.ads.MyTargetView.AdSize.ADSIZE_728x90
            else -> com.my.target.ads.MyTargetView.AdSize.ADSIZE_320x50
        }
    }

    // --- Ad Wrappers ---

    class BannerAdWrapper(
        private val context: android.content.Context,
        private val slotId: Int,
        private val adSize: com.my.target.ads.MyTargetView.AdSize,
        private val refreshAd: Boolean
    ) {
        val view: com.my.target.ads.MyTargetView = com.my.target.ads.MyTargetView(context)

        init {
            view.slotId = slotId
            view.adSize = adSize
            view.refreshAd = refreshAd
        }

        fun load() {
            view.load()
        }

        fun reload() {
            view.reload()
        }

        fun setCustomParams(age: Int, gender: Int, email: String, phone: String) {
            val params = view.customParams
            if (age >= 0) params.setAge(age)
            if (gender >= 0) params.setGender(gender)
            if (email.isNotEmpty()) params.setEmail(email)
            if (phone.isNotEmpty()) params.setPhone(phone)
        }
    }

    class InterstitialAdWrapper(
        slotId: Int,
        activity: Activity
    ) {
        private val ad: InterstitialAd = InterstitialAd(slotId, activity)

        fun load(onLoad: () -> Unit, onNoAd: (String) -> Unit) {
            ad.setListener(object : InterstitialAd.InterstitialAdListener {
                override fun onLoad(ad: InterstitialAd) {
                    Log.d(TAG, "Interstitial loaded")
                    onLoad()
                }

                override fun onNoAd(reason: String, ad: InterstitialAd) {
                    Log.d(TAG, "Interstitial no ad: $reason")
                    onNoAd(reason)
                }

                override fun onClick(ad: InterstitialAd) {
                    Log.d(TAG, "Interstitial clicked")
                }

                override fun onDisplay(ad: InterstitialAd) {
                    Log.d(TAG, "Interstitial displayed")
                }

                override fun onDismiss(ad: InterstitialAd) {
                    Log.d(TAG, "Interstitial dismissed")
                }

                override fun onVideoCompleted(ad: InterstitialAd) {
                    Log.d(TAG, "Interstitial video completed")
                }
            })
            ad.load()
        }

        fun show() {
            ad.show()
        }

        fun setCustomParams(age: Int, gender: Int, email: String, phone: String) {
            val params = ad.customParams
            if (age >= 0) params.setAge(age)
            if (gender >= 0) params.setGender(gender)
            if (email.isNotEmpty()) params.setEmail(email)
            if (phone.isNotEmpty()) params.setPhone(phone)
        }
    }

    class RewardedAdWrapper(
        slotId: Int,
        activity: Activity
    ) {
        private val ad: RewardedAd = RewardedAd(slotId, activity)

        fun load(onLoad: () -> Unit, onNoAd: (String) -> Unit) {
            ad.setListener(object : RewardedAd.RewardedAdListener {
                override fun onLoad(ad: RewardedAd) {
                    Log.d(TAG, "Rewarded ad loaded")
                    onLoad()
                }

                override fun onNoAd(reason: String, ad: RewardedAd) {
                    Log.d(TAG, "Rewarded no ad: $reason")
                    onNoAd(reason)
                }

                override fun onClick(ad: RewardedAd) {
                    Log.d(TAG, "Rewarded clicked")
                }

                override fun onDisplay(ad: RewardedAd) {
                    Log.d(TAG, "Rewarded displayed")
                }

                override fun onDismiss(ad: RewardedAd) {
                    Log.d(TAG, "Rewarded dismissed")
                }

                override fun onReward(reward: com.my.target.common.Reward, ad: RewardedAd) {
                    Log.d(TAG, "Rewarded reward: type=${reward.type}, amount=${reward.amount}")
                }
            })
            ad.load()
        }

        fun show() {
            ad.show()
        }

        fun setCustomParams(age: Int, gender: Int, email: String, phone: String) {
            val params = ad.customParams
            if (age >= 0) params.setAge(age)
            if (gender >= 0) params.setGender(gender)
            if (phone.isNotEmpty()) params.setPhone(phone)
            if (email.isNotEmpty()) params.setEmail(email)
        }
    }
}
