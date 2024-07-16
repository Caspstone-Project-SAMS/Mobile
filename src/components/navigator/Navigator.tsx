import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './AuthStack';
import UnAuthStack from './UnAuthStack';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/Store';

const Navigator = () => {
  const userInfo = useSelector((state: RootState) => state.auth.userDetail)
  const logined = true
  return (
    <NavigationContainer independent={true}>
      {/* {userInfo?.token ? <AuthStack /> : <UnAuthStack />} */}
      {/* {logined ? <AuthStack /> : <UnAuthStack />} */}
      <AuthStack />
    </NavigationContainer>
  )
}

export default Navigator