export default {
  expo: {
    name: 'sams',
    slug: 'sams',
    version: '1.0.2',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    platforms: ['ios', 'android'],
    ios: {
      supportsTablet: true,
    },
    android: {
      permissions: [
        'ACCESS_WIFI_STATE',
        'CHANGE_WIFI_STATE',
        'ACCESS_FINE_LOCATION',
      ],
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      package: 'com.sams.android',
      googleServicesFile: process.env.GOOGLE_SERVICES,
    },
    web: {
      favicon: './assets/favicon.png',
    },
    plugins: [
      'expo-font',
      [
        'expo-build-properties',
        {
          android: {
            usesCleartextTraffic: true,
          },
        },
      ],
    ],
    extra: {
      eas: {
        projectId: '6e8d057c-a1ad-4e9f-ad2e-360fc2c346aa',
      },
    },
  },
};
