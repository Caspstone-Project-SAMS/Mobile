import { Dimensions, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Title from '../../components/Title'
import { COLORS, FONT_COLORS } from '../../assets/styles/variables';
import { HelperText, MD3Colors, TextInput } from 'react-native-paper';
import CustomBtn from '../../components/global/CustomBtn';
import { Toast } from 'react-native-toast-notifications';
import AuthService from '../../hooks/Auth';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/Store';
import axios from 'axios';
import useDispatch from '../../redux/UseDispatch';
import { logout } from '../../redux/slice/Auth';
import LoadingBlur from '../../components/global/LoadingBlur';

const { width } = Dimensions.get('window');

const ChangePassword = ({ navigation }) => {
    const userId = useSelector((state: RootState) => state.auth.userDetail?.result?.id)
    const [originalPass, setOriginalPass] = useState<string>('');
    const [secureOrigin, setSecureOrigin] = useState<boolean>(true);

    const [newPass, setNewPass] = useState<string>('');
    const [secureNew, setSecureNew] = useState<boolean>(true);
    const [isErrNewPass, setIsErrNewPass] = useState<boolean>(false);

    const [reNewPass, setReNewPass] = useState<string>('');
    const [secureReEnter, setSecureReEnter] = useState<boolean>(true);
    const [isErrRePass, setIsErrRePass] = useState<boolean>(false);

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const dispatch = useDispatch()

    const handleSubmit = () => {
        if (newPass === reNewPass) {
            if (newPass.length >= 5 && userId) {
                setIsLoading(true);
                const promise = AuthService.changePassword(userId, originalPass, newPass, reNewPass);
                promise.then(data => {
                    Toast.show('Change password successfully, please login again!', { type: 'success', placement: 'top' })
                    dispatch(logout());
                }).catch(err => {
                    if (axios.isAxiosError(err) && err.response) {
                        const errList = err.response.data.errors;
                        if (errList && Array.isArray(errList)) {
                            errList.forEach(log => {
                                Toast.show(`${log}`, { type: 'danger', placement: 'top' })
                            })
                        }
                        console.log("This is err ", JSON.stringify(err));
                    }
                }).finally(() => {
                    setIsLoading(false);
                })
            } else {
                Toast.show('New Password must contains at least 5 characters', { type: 'warning', placement: 'top' })
            }
        } else {
            Toast.show('Confirm Password does not match New Password', { type: 'warning', placement: 'top' })
        }
    }

    const hasErrors = () => {
        if (newPass.length === 0) return setIsErrNewPass(false);
        return setIsErrNewPass(newPass.length <= 5);
    };

    const hasRePassErrors = () => {
        if (reNewPass.length === 0) setIsErrRePass(false);
        if (reNewPass !== newPass) {
            setIsErrRePass(true);
        } else {
            setIsErrRePass(false)
        }
    };

    useEffect(() => {
        hasErrors();
    }, [newPass])

    useEffect(() => {
        hasRePassErrors();
    }, [reNewPass])


    return (
        <ScrollView style={styles.container}>
            <Title title='Change Password' navigation={navigation} />
            <View>
                <Image
                    style={{
                        height: width - 40,
                        width: width - 40,
                        borderWidth: 1,
                        borderColor: COLORS.borderColor,
                        borderRadius: 4
                    }}
                    source={require('../../assets/imgs/forgot_pass.jpg')}
                    alt='Change password image'
                />
            </View>
            <View>
                <TextInput
                    mode="outlined"
                    label='Old Password'
                    placeholder="Enter your old password"
                    secureTextEntry={secureOrigin}
                    style={[styles.input, { marginTop: 10, backgroundColor: "#FFF" }]}
                    theme={{
                        colors: {
                            primary: COLORS.skyBlue,
                            text: FONT_COLORS.greyFontColor,
                        },
                    }}
                    onChangeText={val => { setOriginalPass(val) }}
                    right={
                        <TextInput.Icon
                            icon={secureOrigin ? 'eye-off-outline' : 'eye-outline'}
                            color={MD3Colors.primary0}
                            onPress={() => setSecureOrigin(!secureOrigin)}
                        />
                    }
                />
                {isErrNewPass && (
                    <HelperText type="error" visible={isErrNewPass}>
                        New Password must contains at least 5 characters
                    </HelperText>
                )}
                <TextInput
                    mode="outlined"
                    label='New Password'
                    placeholder="Enter your new password"
                    secureTextEntry={secureNew}
                    style={[styles.input, { marginTop: 10, backgroundColor: "#FFF" }]}
                    theme={{
                        colors: {
                            primary: COLORS.skyBlue,
                            text: FONT_COLORS.greyFontColor,
                        },
                    }}
                    onChangeText={val => {
                        setNewPass(val)
                    }}
                    right={
                        <TextInput.Icon
                            icon={secureNew ? 'eye-off-outline' : 'eye-outline'}
                            color={MD3Colors.primary0}
                            onPress={() => setSecureNew(!secureNew)}
                        />
                    }
                />
                {isErrRePass && (
                    <HelperText type="error" visible={isErrRePass}>
                        Confirm Password not match with New Password!
                    </HelperText>
                )}
                <TextInput
                    mode="outlined"
                    label='Re-Enter Password'
                    placeholder="Re-enter your password"
                    secureTextEntry={secureReEnter}
                    style={[styles.input, { marginTop: 10, backgroundColor: "#FFF" }]}
                    theme={{
                        colors: {
                            primary: COLORS.skyBlue,
                            text: FONT_COLORS.greyFontColor,
                        },
                    }}
                    onChangeText={val => {
                        setReNewPass(val)
                    }}
                    right={
                        <TextInput.Icon
                            icon={secureReEnter ? 'eye-off-outline' : 'eye-outline'}
                            color={MD3Colors.primary0}
                            onPress={() => setSecureReEnter(!secureReEnter)}
                        />
                    }
                />

                <TouchableOpacity style={{ marginTop: 20 }}
                    onPress={() => handleSubmit()}
                >
                    <CustomBtn text='Change Password' />
                </TouchableOpacity>
            </View>
            {isLoading ? <LoadingBlur /> : ''}
        </ScrollView>
    )
}

export default ChangePassword

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 15,
        paddingHorizontal: 20,
        backgroundColor: '#FFF'
    },
    input: {
        marginTop: 10,
        width: 'auto',
        backgroundColor: '#f1f4ff',
        paddingHorizontal: 8,
    },
})