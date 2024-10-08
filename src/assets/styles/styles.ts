import { StyleSheet } from 'react-native';
import { COLORS } from './variables';

export const GLOBAL_STYLES = StyleSheet.create({
  button: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: 5,
  },
  //ALIGNMENT
  horizontalBetweenCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  horizontalCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  horizontalBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  verticalBetweenCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  //TEXT
  titleLabel: {
    fontSize: 18,
    marginBottom: 10,
    fontFamily: 'Lexend-Regular',
  },

  //Card
  card: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: COLORS.borderColor,
  },

  //SUB things
  horizontalDivider: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: COLORS.dividerColor,
  },
});
