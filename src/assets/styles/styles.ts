import { StyleSheet } from 'react-native';

export const GLOBAL_STYLES = StyleSheet.create({
  button: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: 5,
  },
  horizontalCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
