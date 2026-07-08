package expo.modules.vkads

import android.content.Context
import android.util.Log
import android.view.ViewGroup
import android.widget.FrameLayout
import com.my.target.ads.MyTargetView
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.views.ExpoView

class VKAdsBannerView(context: Context, appContext: AppContext) : ExpoView(context, appContext) {
    companion object {
        const val TAG = "VKAdsBannerView"
    }

    private var myTargetView: MyTargetView? = null
    private var slotId: Int = 0
    private var adSize: MyTargetView.AdSize = MyTargetView.AdSize.ADSIZE_320x50
    private var refreshAd: Boolean = false

    init {
        layoutParams = FrameLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.WRAP_CONTENT
        )
    }

    // --- Props setters called from React Native ---

    fun setSlotId(id: Int) {
        this.slotId = id
        Log.d(TAG, "setSlotId: $id")
        createAndLoadBanner()
    }

    fun setAdSize(size: String) {
        this.adSize = when (size) {
            "BANNER_320x50" -> MyTargetView.AdSize.ADSIZE_320x50
            "BANNER_300x250" -> MyTargetView.AdSize.ADSIZE_300x250
            "BANNER_728x90" -> MyTargetView.AdSize.ADSIZE_728x90
            "ADAPTIVE" -> MyTargetView.AdSize.ADSIZE_320x50 // default; adaptive handled via MATCH_PARENT
            else -> MyTargetView.AdSize.ADSIZE_320x50
        }
        Log.d(TAG, "setAdSize: $size -> $adSize")
        createAndLoadBanner()
    }

    fun setRefreshAd(refresh: Boolean) {
        this.refreshAd = refresh
        myTargetView?.refreshAd = refresh
    }

    // --- Lifecycle ---

    private fun createAndLoadBanner() {
        if (slotId <= 0) {
            Log.w(TAG, "slotId not set, skipping banner creation")
            return
        }

        // Remove old view if exists
        myTargetView?.let {
            removeView(it)
            it.destroy()
        }

        val reactContext = appContext.reactContext ?: run {
            Log.e(TAG, "reactContext is null, cannot create banner")
            return
        }

        val banner = MyTargetView(reactContext).apply {
            this.slotId = this@VKAdsBannerView.slotId
            this.adSize = this@VKAdsBannerView.adSize
            this.refreshAd = this@VKAdsBannerView.refreshAd

            setListener(object : MyTargetView.MyTargetViewListener {
                override fun onLoad(view: MyTargetView) {
                    Log.d(TAG, "Banner loaded: slotId=$slotId")
                    // Add the banner to the layout once loaded
                    post {
                        // Notify JS
                    }
                }

                override fun onNoAd(reason: String, view: MyTargetView) {
                    Log.d(TAG, "Banner no ad: $reason")
                }

                override fun onClick(view: MyTargetView) {
                    Log.d(TAG, "Banner clicked")
                }

                override fun onShow(view: MyTargetView) {
                    Log.d(TAG, "Banner shown")
                }
            })
        }

        val layoutParams = FrameLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.WRAP_CONTENT
        )

        myTargetView = banner
        addView(banner, layoutParams)

        banner.load()

        Log.d(TAG, "Banner created and loading: slotId=$slotId")
    }

    override fun onDetachedFromWindow() {
        super.onDetachedFromWindow()
        myTargetView?.destroy()
        myTargetView = null
    }
}
