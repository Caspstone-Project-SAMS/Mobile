import {
 View,
 Text,
 StyleSheet,
 TouchableOpacity,
 Pressable,
} from 'react-native';
import React from 'react';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { Icon } from 'react-native-paper';

//navigation & title phải truyền
//leftIcon, handleClickLeftIcon tùy chọn
const Title = ({ navigation, title, leftIcon, handleClickLeftIcon }) => {
 //Left icon using from react native paper
 const isShowLeft = leftIcon && handleClickLeftIcon ? true : false;

 return (
  <View style={styles.titleContainer}>
   <TouchableOpacity
    onPress={() => navigation.goBack()}
    style={[styles.titleIcon, styles.leftIcon]}
   >
    <Ionicon name="arrow-back-outline" size={30} color={'black'} />
   </TouchableOpacity>
   <Text style={styles.title}>{title ? title : 'null title'}</Text>
   {isShowLeft ? (
    <Pressable
     style={[styles.titleIcon, styles.rightIcon]}
     onPress={() => handleClickLeftIcon()}
    >
     <Icon source={leftIcon} color={'black'} size={27} />
    </Pressable>
   ) : (
    ''
   )}
  </View>
 );
};

const styles = StyleSheet.create({
 titleContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 14,
 },
 title: {
  textAlign: 'center',
  width: '100%',
  fontSize: 26,
  fontWeight: '600',
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
