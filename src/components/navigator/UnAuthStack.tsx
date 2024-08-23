import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../../screens/auth/Login';
import ForgotPassword from '../../screens/auth/ForgotPassword';

const UnAuthStack = () => {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator
            initialRouteName="LOGIN"
            screenOptions={{
                headerTitleAlign: 'center',
                headerShown: false
            }}
        >
            <Stack.Screen
                name="LOGIN"
                component={Login}
            />
            <Stack.Screen
                name="FORGOT_PASSWORD"
                component={ForgotPassword}
            />
            {/* <Stack.Screen
              name="SIGNIN"
              component={SignIn}
              options={{ headerShown: false }}
            /> */}
        </Stack.Navigator>
    )
}

export default UnAuthStack