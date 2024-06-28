import { Image } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../../screens/home/Home';
import ScheduleSwiper from '../swiper/ScheduleSwiper';
import BottomTabs from './BottomTabs';



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
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="ScheduleSwipe" component={ScheduleSwiper} />
        </Stack.Navigator>
    )
}

export default AuthStack