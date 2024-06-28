import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Home from '../../screens/home/Home';
import Class from '../../screens/class/Class';
import Schedule from '../../screens/schedule/Schedule';
import Account from '../../screens/account/Account';
import Module from '../../screens/module/Module';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const Tab = createBottomTabNavigator();

// @ts-ignore
const CustomTabBarBtn = (props) => {
    const { children, onPress, selected } = props
    return (
        <TouchableOpacity
            style={[styles.centerBtnBox, styles.shadow]}
            onPress={onPress}
        >
            <View style={[styles.centerBtn, selected && styles.selected]}>
                {children}
            </View>
        </TouchableOpacity>
    )
}

const AnimatedActiveTabBar = () => {
    const opacity = useSharedValue(0);

    useEffect(() => {
        opacity.value = withTiming(1, {
            duration: 2200,
            easing: Easing.inOut(Easing.ease),
        });
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
        };
    });

    return <Animated.View style={[styles.activeTabBar, animatedStyle]} />;
};

const BottomTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: styles.bottomTab,
            }}
        >
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    headerTitle: '',
                    tabBarLabel: '',
                    tabBarIcon: ({ color, size, focused }) => (
                        <>
                            <Image
                                source={require('../../assets/icons/homeIcon.png')}
                                style={{
                                    width: 25,
                                    height: 25,
                                    tintColor: color
                                }}
                            />
                            {focused && (
                                <View style={styles.activeTabBar} />
                            )}
                        </>
                    ),
                    tabBarActiveTintColor: '#000',
                }}
            />
            <Tab.Screen
                name="Schedule"
                component={Schedule}
                options={{
                    headerTitle: '',
                    tabBarLabel: '',
                    tabBarIcon: ({ color, size, focused }) => (
                        <>
                            <Image
                                source={require('../../assets/icons/calendarIcon.png')}
                                style={{
                                    width: 25,
                                    height: 25,
                                    tintColor: color
                                }}
                            />
                            {focused && (
                                <View style={styles.activeTabBar} />
                            )}
                        </>
                    ),
                    tabBarActiveTintColor: '#000'
                }}
            />
            <Tab.Screen
                name="Class"
                component={Class}
                options={{
                    tabBarLabel: '',
                    tabBarIcon: ({ color, size }) => (
                        <Image
                            source={require('../../assets/icons/teamIcon.png')}
                            style={{
                                width: 34,
                                height: 34,
                                tintColor: '#FFF',
                            }}
                        />
                    ),
                    // @ts-ignore
                    tabBarButton: (props) => <CustomTabBarBtn {...props} />,
                    tabBarActiveBackgroundColor: 'red'
                }}
            />
            <Tab.Screen
                name="Module"
                component={Module}
                options={{
                    headerTitle: '',
                    tabBarLabel: '',
                    tabBarIcon: ({ color, size, focused }) => (
                        <>
                            <Image
                                source={require('../../assets/icons/sensorIcon.png')}
                                style={{
                                    width: 25,
                                    height: 25,
                                    tintColor: color
                                }}
                            />
                            {focused && (
                                <View style={styles.activeTabBar} />
                            )}
                        </>
                    ),
                    tabBarActiveTintColor: '#000'
                }}
            />
            <Tab.Screen
                name="Account"
                component={Account}
                options={{
                    headerTitle: '',
                    tabBarLabel: '',
                    tabBarIcon: ({ color, size, focused }) => (
                        <>
                            <Image
                                source={require('../../assets/icons/userIcon.png')}
                                style={{
                                    width: 25,
                                    height: 25,
                                    tintColor: color
                                }}
                            />
                            {focused && (
                                <View style={styles.activeTabBar} />
                            )}
                        </>
                    ),
                    tabBarActiveTintColor: '#000'
                }}
            />
        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({
    activeTabBar: {
        position: 'absolute',
        top: -15,
        right: '36%',
        height: 6,
        width: 26,
        borderRadius: 4,
        backgroundColor: '#0088FC',
    },
    bottomTab: {
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        display: 'flex',
        paddingTop: 15,
        minHeight: 60
    },
    shadow: {
        shadowColor: '#7F5DF0',
        shadowOffset: {
            width: 0,
            height: 10
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5
    },
    centerBtnBox: {
        top: -30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    centerBtn: {
        width: 65,
        height: 65,
        paddingTop: 14,
        borderRadius: 35,
        backgroundColor: '#0087FE',
    },
    selected: {
        borderWidth: 5,
        borderColor: 'red'
    }
})

export default BottomTabs