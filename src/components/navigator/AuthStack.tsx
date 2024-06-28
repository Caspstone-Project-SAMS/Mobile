import { Image } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../../screens/home/Home';
import ScheduleSwiper from '../swiper/ScheduleSwiper';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

const BottomRoot = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    headerTitle: '',
                    tabBarLabel: '',
                    tabBarIcon: ({ color, size }) => (
                        <Image
                            source={require('../../assets/icons/homeIcon.png')}
                            style={{
                                width: 20,
                                height: 20,
                                tintColor: color
                            }}
                        />
                    ),
                    tabBarActiveTintColor: '#FF7A00'
                }}
            />
        </Tab.Navigator>
    )
}

const AuthStack = () => {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator
            initialRouteName='BottomRoot'
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name="BottomRoot" component={BottomRoot} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="ScheduleSwipe" component={ScheduleSwiper} />
        </Stack.Navigator>
    )
}

export default AuthStack