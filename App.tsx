import React, { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DefaultTheme, Text as PaperTxt } from 'react-native-paper';
import Login from './src/screens/auth/Login';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from "expo-font";
import * as SplashScreen from 'expo-splash-screen';
import { appTheme } from './config';
import { configureFonts, MD2LightTheme, PaperProvider } from 'react-native-paper';
import CustomText from './src/components/global/CustomTxt';

SplashScreen.preventAutoHideAsync();

const App: React.FC = () => {
  const [fontsLoaded, fontError] = useFonts({
    'Lexend-Regular': require('./assets/fonts/Lexend-Regular.ttf'),
    'Lexend-Medium': require('./assets/fonts/Lexend-Medium.ttf'),
    'Lexend-Light': require('./assets/fonts/Lexend-Light.ttf'),
    'Lexend-Thin': require('./assets/fonts/Lexend-Thin.ttf'),
    'Montserrat': require('./assets/fonts/Montserrat-VariableFont_wght.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }
  const fontConfig = {
    web: {
      regular: {
        fontFamily: 'Lexend-Light',
        fontWeight: 'normal',
        color: '#1A1F36' //grey color
      },
      medium: {
        fontFamily: 'Lexend-Medium',
        fontWeight: 'normal',
        color: '#1A1F36'
      },
      light: {
        fontFamily: 'Lexend-Light',
        fontWeight: 'normal',
        color: '#1A1F36'
      },
      thin: {
        fontFamily: 'Lexend-Thin',
        fontWeight: 'normal',
        color: '#1A1F36'
      },
    },
    ios: {
      regular: {
        fontFamily: 'Lexend-Light',
        fontWeight: 'normal',
        color: '#1A1F36'
      },
      medium: {
        fontFamily: 'Lexend-Medium',
        fontWeight: 'normal',
        color: '#1A1F36'
      },
      light: {
        fontFamily: 'Lexend-Light',
        fontWeight: 'normal',
        color: '#1A1F36'
      },
      thin: {
        fontFamily: 'Lexend-Thin',
        fontWeight: 'normal',
        color: '#1A1F36'
      },
    },
    android: {
      regular: {
        fontFamily: 'Lexend-Light',
        fontWeight: 'normal',
        color: '#1A1F36'
      },
      medium: {
        fontFamily: 'Lexend-Medium',
        fontWeight: 'normal',
        color: '#1A1F36'
      },
      light: {
        fontFamily: 'Lexend-Light',
        fontWeight: 'normal',
        color: '#1A1F36'
      },
      thin: {
        fontFamily: 'Lexend-Thin',
        fontWeight: 'normal',
        color: '#1A1F36'
      },
    }
  };

  const theme = {
    ...MD2LightTheme,
    myOwnProperty: true,
    fonts: configureFonts({ config: fontConfig, isV3: false }),
    colors: {
      ...DefaultTheme.colors,
      primary: '#2563EB',
    },
  };

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={styles.container} onLayout={onLayoutRootView}>
        <Login />
      </SafeAreaView>
    </PaperProvider>
  );
};
export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
