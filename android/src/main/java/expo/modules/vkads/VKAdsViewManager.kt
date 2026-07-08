package expo.modules.vkads

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class VKAdsViewManager : Module() {
    override fun definition() = ModuleDefinition {
        Name("VKAdsBannerView")

        View(VKAdsBannerView::class) {
            Prop("slotId") { view: VKAdsBannerView, slotId: Int ->
                view.setSlotId(slotId)
            }

            Prop("adSize") { view: VKAdsBannerView, adSize: String ->
                view.setAdSize(adSize)
            }

            Prop("refreshAd") { view: VKAdsBannerView, refreshAd: Boolean ->
                view.setRefreshAd(refreshAd)
            }

            Events(
                "onLoad",
                "onNoAd",
                "onClick",
                "onShow"
            )
        }
    }
}
