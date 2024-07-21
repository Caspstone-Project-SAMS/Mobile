import 'react-native-reanimated'
import 'react-native-gesture-handler';
import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';

import { appTheme } from './config';
import { useFonts } from "expo-font";
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { PaperProvider } from 'react-native-paper';
import { ToastProvider } from 'react-native-toast-notifications';

import Navigator from './src/components/navigator/Navigator';
import { Provider } from 'react-redux';
import Store from './src/redux/Store';

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

  return (
    <Provider store={Store}>
      <SafeAreaView style={styles.container} onLayout={onLayoutRootView}>
        <PaperProvider theme={appTheme}>
          <ToastProvider>
            <Navigator />
          </ToastProvider>
        </PaperProvider>
      </SafeAreaView>
    </Provider>
  );
};
export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
