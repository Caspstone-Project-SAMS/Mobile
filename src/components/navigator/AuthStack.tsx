import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../../screens/home/Home';
import BottomTabs from './BottomTabs';
import ClassDetail from '../../screens/class/ClassDetail';
import ChangePassword from '../../screens/auth/ChangePassword';
import PrivatePolicy from '../../screens/account/PrivatePolicy';
import AccountProfile from '../../screens/account/AccountProfile';
import SetUpModule from '../../screens/module/SetUpModule';
import ConfigModule from '../../screens/module/ConfigModule';

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
            {/* Account */}
            <Stack.Screen name="ChangePassword" component={ChangePassword} />
            <Stack.Screen name="PrivatePolicy" component={PrivatePolicy} />
            <Stack.Screen name="AccountProfile" component={AccountProfile} />
            {/* Module */}
            <Stack.Screen name="SetUpModule" component={SetUpModule} />
            <Stack.Screen name="ConfigModule" component={ConfigModule} />
            <Stack.Screen name="Home" component={Home} />
        </Stack.Navigator>
    )
}

export default AuthStack