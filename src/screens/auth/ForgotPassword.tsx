import { Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import Title from '../../components/Title'
import { ActivityIndicator, Button, HelperText, Modal, Portal, Text, TextInput } from 'react-native-paper'
import { COLORS, FONT_COLORS } from '../../assets/styles/variables';
import { ScrollView } from 'react-native-gesture-handler';
import CustomBtn from '../../components/global/CustomBtn';
import AuthService from '../../hooks/Auth';
import { HelperService } from '../../hooks/helpers/HelperFunc';
import { Toast } from 'react-native-toast-notifications';

const { width } = Dimensions.get('window');

const ForgotPassword = ({ navigation }) => {
    const [email, setEmail] = useState<string>('')
    const [visible, setVisible] = useState(false);
    const [isSucceed, setIsSucceed] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const handleSubmit = () => {
        if (HelperService.emailChecker(email)) {
            const delayTime = HelperService.randomDelay()
            setIsLoading(true)
            showModal();
            setTimeout(() => {
                const promise = AuthService.forgotPassword(email);
                promise.then(data => {
                    setIsSucceed(true)
                    setIsLoading(false);
                }).catch(err => {
                    setIsSucceed(false)
                    setIsLoading(false);
                })
            }, delayTime)
        } else {
            Toast.show('Unvalid email, please check again before verify', { type: 'warning', placement: 'top' })
        }
    }
    const hasErrors = () => {
        if (email.length > 4) {
            return !HelperService.emailChecker(email);
        } else {
            return false
        }
    };

    const resetState = () => {
        setVisible(false);
        setIsSucceed(false);
        setIsLoading(false);
    }

    const containerStyle = {
        backgroundColor: 'white', padding: 20, marginHorizontal: 20
    };
    return (
        <ScrollView style={styles.container}>
            <Title navigation={navigation} title='Forgot Password' />
            <View style={{ alignItems: 'center' }}>
                <Text style={styles.subTxt}>Enter your email to reset password</Text>
                <View style={{ width: '100%', marginTop: 10, alignItems: 'center' }}>
                    <Image
                        style={{
                            height: width - 40,
                            width: width - 40,
                            borderWidth: 1,
                            borderColor: COLORS.borderColor,
                            borderRadius: 4
                        }}
                        source={require('../../assets/imgs/Forgot_password.png')}
                        alt='Forgot password image'
                    />
                </View>
            </View>
            <View style={{ marginBottom: 20 }}>
                <TextInput
                    mode="outlined"
                    label='Email'
                    placeholder="Email"
                    style={[styles.input, { marginTop: 10, backgroundColor: "#FFF" }]}
                    theme={{
                        colors: {
                            primary: COLORS.skyBlue,
                            text: FONT_COLORS.greyFontColor,
                        },
                    }}
                    onChangeText={val => setEmail(val)}
                />
                <HelperText type="error" visible={hasErrors()}>
                    Email address is invalid!
                </HelperText>
                <TouchableOpacity
                    onPress={() => handleSubmit()}
                >
                    <CustomBtn text='Verify' />
                </TouchableOpacity>
            </View>
            <Portal>
                <Modal visible={visible} dismissable={false} contentContainerStyle={containerStyle}>
                    <View style={styles.modal}>
                        {
                            isLoading ? (
                                <ActivityIndicator animating={true} color={COLORS.skyBlue} />
                            ) : (
                                <>
                                    <Image source={
                                        isSucceed
                                            ? require('../../assets/imgs/check_email.jpg')
                                            : require('../../assets/imgs/email_notfound.jpg')
                                    }
                                        resizeMode='contain'
                                        alt='result image'
                                        style={styles.resultImage}
                                    />
                                    {
                                        isSucceed ? (
                                            <View>
                                                <Text style={styles.modalTxt}>
                                                    We've sent an email to your registered email address with a link to reset your password
                                                </Text>
                                                <Text style={styles.modalSubTxt}>
                                                    # If you don't see the email, please check your spam or junk folder
                                                </Text>
                                            </View>
                                        ) : (
                                            <View>
                                                <Text style={[styles.modalTxt, { color: COLORS.yellowBase }]}>
                                                    OOPS, look like this email does not exist, please check your email and try again!
                                                </Text>
                                            </View>
                                        )
                                    }
                                    <View
                                        style={{ width: '100%', marginTop: 20 }}
                                    >
                                        {
                                            isSucceed ? (
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        resetState();
                                                        navigation.navigate('LOGIN');
                                                    }}
                                                >
                                                    <CustomBtn
                                                        text='Back to Login'
                                                        customStyle={{
                                                            backgroundColor: COLORS.skyBlue
                                                        }}
                                                    />
                                                </TouchableOpacity>
                                            ) : (
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        resetState();
                                                    }}
                                                >
                                                    <CustomBtn
                                                        text='Try again'
                                                        customStyle={{
                                                            backgroundColor: COLORS.skyBlue
                                                        }}
                                                    />
                                                </TouchableOpacity>
                                            )
                                        }
                                    </View>
                                </>
                            )
                        }
                    </View>
                </Modal>
            </Portal>
        </ScrollView>
    )
}

export default ForgotPassword

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#FFF'
    },
    title: {
        fontSize: 24,
        fontFamily: 'Lexend-Regular'
    },
    subTxt: {
        fontSize: 16,
    },
    input: {
        marginTop: 10,
        width: 'auto',
        backgroundColor: '#f1f4ff',
        paddingHorizontal: 8,
    },
    outlineInputFocus: {
        borderColor: COLORS.skyBase,
        borderRadius: 10
    },
    defaultOutline: {
        borderRadius: 10
    },
    modal: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    resultImage: {
        width: 250,
        height: 250,
        borderRadius: 4
    },
    modalTxt: {
        fontSize: 16,
        textAlign: 'center'
    },
    modalSubTxt: {
        marginTop: 4,
        fontSize: 14,
        color: FONT_COLORS.blurFontColor
    }
})