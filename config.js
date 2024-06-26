import * as React from 'react';
import { Platform } from 'react-native';
import { configureFonts, MD3LightTheme } from 'react-native-paper';

const fontConfig = {
  customVariant: {
    fontFamily: Platform.select({
      web: 'Lexend-Light, sans-serif',
      ios: 'Lexend-Light, System',
      android: 'Lexend-Light, sans-serif',
      default: 'Lexend-Light, sans-serif',
    }),
    fontWeight: '400',
    letterSpacing: 0.5,
    lineHeight: 22,
    fontSize: 20,
  },
};

export const appTheme = {
  ...MD3LightTheme,
  fonts: configureFonts({ config: fontConfig }),
};
