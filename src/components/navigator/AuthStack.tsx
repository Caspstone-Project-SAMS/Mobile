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
import { ErrorBoundary } from 'react-error-boundary';
import useDispatch from '../../redux/UseDispatch';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { logout } from '../../redux/slice/Auth';
import { Text } from 'react-native-paper';
import { TouchableOpacity, View } from 'react-native';
import CustomBtn from '../global/CustomBtn';
import { Toast } from 'react-native-toast-notifications';

const AuthStack = () => {
    const Stack = createStackNavigator();
    const dispatch = useDispatch();
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    const Fallback = ({ error, resetErrorBoundary }) => {
        // Call resetErrorBoundary() to reset the error boundary and retry the render.
        console.log("Error has occured - Error: ", error);
        Toast.show('Unknown error has occured, please try again later.', { type: 'danger', placement: 'top' })
        dispatch(logout());
        return (
            <View>
                <Text>
                    Something went wrong, please try again later!
                </Text>
                <TouchableOpacity onPress={() => resetErrorBoundary()}>
                    <CustomBtn text='Go Back' />
                </TouchableOpacity>
            </View>
        )
    }
    return (
        <ErrorBoundary
            FallbackComponent={Fallback}
            onReset={(details) => {
                // Reset the state of your app so the error doesn't happen again
                navigation.navigate("LOGIN")
            }}
        >
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
        </ErrorBoundary>
    )
}

export default AuthStack