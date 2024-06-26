import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../../screens/auth/Login';

const UnAuthStack = () => {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator
            initialRouteName="LOGIN"
            screenOptions={{
                headerTitleAlign: 'center'
            }}
        >
            <Stack.Screen
                name="LOGIN"
                component={Login}
                options={{ headerShown: false }}
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