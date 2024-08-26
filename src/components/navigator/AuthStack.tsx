import { Image } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../../screens/home/Home';
import BottomTabs from './BottomTabs';
import ClassDetail from '../../screens/class/ClassDetail';
import ChangePassword from '../../screens/auth/ChangePassword';
import PrivatePolicy from '../../screens/account/PrivatePolicy';
import AccountProfile from '../../screens/account/AccountProfile';



const AuthStack = () => {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator
            initialRouteName='BottomRoot'
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name="BottomRoot" component={BottomTabs} />
            <Stack.Screen name="ClassDetail" component={ClassDetail} />
            <Stack.Screen name="ChangePassword" component={ChangePassword} />
            <Stack.Screen name="PrivatePolicy" component={PrivatePolicy} />
            <Stack.Screen name="AccountProfile" component={AccountProfile} />
            <Stack.Screen name="Home" component={Home} />
        </Stack.Navigator>
    )
}

export default AuthStack