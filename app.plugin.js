/**
 * Expo Config Plugin for VK Ads (myTarget)
 *
 * Automatically configures the Android native project to use myTarget SDK.
 * Adds the required MyTargetActivity declaration and permissions.
 *
 * Usage in app.json/app.config.js:
 * ```json
 * {
 *   "plugins": [
 *     ["ads-vk-react-native-expo", { "debugMode": false }]
 *   ]
 * }
 * ```
 */
const { withAndroidManifest, AndroidConfig } = require('expo/config-plugins');

function withVKAdsAndroid(config, props = {}) {
  return withAndroidManifest(config, (config) => {
    const androidManifest = config.modResults;
    const mainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(androidManifest);

    // Add permissions if not present
    AndroidConfig.Permissions.ensurePermissions(androidManifest, [
      'android.permission.INTERNET',
      'android.permission.ACCESS_NETWORK_STATE',
    ]);

    // Add MyTargetActivity if not already declared
    const activities = mainApplication.activity || [];
    const hasMyTargetActivity = activities.some(
      (activity) =>
        activity.$?.['android:name'] === 'com.my.target.common.MyTargetActivity'
    );

    if (!hasMyTargetActivity) {
      const activity = {
        $: {
          'android:name': 'com.my.target.common.MyTargetActivity',
          'android:configChanges':
            'keyboard|keyboardHidden|orientation|screenLayout|uiMode|screenSize|smallestScreenSize',
          'android:exported': 'false',
        },
      };

      mainApplication.activity = [...activities, activity];
    }

    return config;
  });
}

module.exports = function withVKAds(config, props = {}) {
  // Android-only config plugin
  const { debugMode } = props;

  config = withVKAdsAndroid(config, props);

  return config;
};
