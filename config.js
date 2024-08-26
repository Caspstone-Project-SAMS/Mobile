import * as React from 'react';
import {
  configureFonts,
  DefaultTheme,
  MD2LightTheme,
} from 'react-native-paper';
import { COLORS } from './src/assets/styles/variables';

const fontConfig = {
  web: {
    regular: {
      fontFamily: 'Lexend-Light',
      fontWeight: 'normal',
      color: '#1A1F36', //grey color
    },
    medium: {
      fontFamily: 'Lexend-Medium',
      fontWeight: 'normal',
      color: '#1A1F36',
    },
    light: {
      fontFamily: 'Lexend-Light',
      fontWeight: 'normal',
      color: '#1A1F36',
    },
    thin: {
      fontFamily: 'Lexend-Thin',
      fontWeight: 'normal',
      color: '#1A1F36',
    },
  },
  ios: {
    regular: {
      fontFamily: 'Lexend-Light',
      fontWeight: 'normal',
      color: '#1A1F36',
    },
    medium: {
      fontFamily: 'Lexend-Medium',
      fontWeight: 'normal',
      color: '#1A1F36',
    },
    light: {
      fontFamily: 'Lexend-Light',
      fontWeight: 'normal',
      color: '#1A1F36',
    },
    thin: {
      fontFamily: 'Lexend-Thin',
      fontWeight: 'normal',
      color: '#1A1F36',
    },
  },
  android: {
    regular: {
      fontFamily: 'Lexend-Light',
      fontWeight: 'normal',
      color: '#1A1F36',
    },
    medium: {
      fontFamily: 'Lexend-Medium',
      fontWeight: 'normal',
      color: '#1A1F36',
    },
    light: {
      fontFamily: 'Lexend-Light',
      fontWeight: 'normal',
      color: '#1A1F36',
    },
    thin: {
      fontFamily: 'Lexend-Thin',
      fontWeight: 'normal',
      color: '#1A1F36',
    },
  },
};

export const appTheme = {
  ...MD2LightTheme,
  myOwnProperty: true,
  fonts: configureFonts({ config: fontConfig, isV3: false }),
  colors: {
    ...DefaultTheme.colors,
    primary: '#2563EB',
  },
};
