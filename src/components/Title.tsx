import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { NavigationProp, ParamListBase } from '@react-navigation/native';

type props = {
  navigation: NavigationProp<ParamListBase>,
  title: string,
}

//navigation & title phải truyền
const Title: React.FC<props> = ({ navigation, title }) => {
  return (
    <View style={styles.titleContainer}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={[styles.titleIcon, styles.leftIcon]}
      >
        <Ionicon name="arrow-back-outline" size={30} color={'black'} />
      </TouchableOpacity>
      <Text style={styles.title}>{title ? title : 'Empty'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  title: {
    textAlign: 'center',
    width: '100%',
    height: 'auto',
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Lexend-Medium',
    color: '#353535',
  },
  titleIcon: {
    position: 'absolute',
    textAlign: 'center',
    textAlignVertical: 'center',
    zIndex: 1,
  },
  leftIcon: {
    // left: 5
  },
  rightIcon: {
    // right: 5
  },
});

export default Title;
