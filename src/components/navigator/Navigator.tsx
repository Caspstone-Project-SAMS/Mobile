import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './AuthStack';
import UnAuthStack from './UnAuthStack';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/Store';

const Navigator = () => {
  // const userInfo = useSelector((state: RootState) => state.auth.userDetail);
  const userRole = useSelector((state: RootState) => state.auth.userDetail?.result?.role.name)

  return (
    <NavigationContainer independent={true}>
      {userRole === 'Lecturer' ? <AuthStack /> : <UnAuthStack />}
      {/* <AuthStack /> */}
    </NavigationContainer>
  )
}

export default Navigator