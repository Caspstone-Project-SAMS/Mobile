import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './AuthStack';
import UnAuthStack from './UnAuthStack';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/Store';

const Navigator = () => {
  const userInfo = useSelector((state: RootState) => state.auth.userDetail)

  return (
    <NavigationContainer independent={true}>
      {userInfo?.token ? <AuthStack /> : <UnAuthStack />}
    </NavigationContainer>
  )
}

export default Navigator