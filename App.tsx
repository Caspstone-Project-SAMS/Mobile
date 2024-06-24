import React from 'react';
import { StyleSheet } from 'react-native';
import Login from './src/screens/auth/Login';
import { SafeAreaView } from 'react-native-safe-area-context';

const App: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Login />
    </SafeAreaView>
  );
};
export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
