import { Dimensions, Image, Modal, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import Title from '../../components/Title'
import { Button, HelperText, Text, TextInput } from 'react-native-paper'
import { COLORS, FONT_COLORS } from '../../assets/styles/variables';
import { ScrollView } from 'react-native-gesture-handler';
import CustomBtn from '../../components/global/CustomBtn';
import AuthService from '../../hooks/Auth';
import { HelperService } from '../../hooks/helpers/HelperFunc';
import { Toast } from 'react-native-toast-notifications';

const { width } = Dimensions.get('window');

const ForgotPassword = ({ navigation }) => {
    const [email, setEmail] = useState<string>('')
    const [visible, setVisible] = React.useState(false);

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const handleSubmit = () => {
        if (HelperService.emailChecker(email)) {
            const promise = AuthService.forgotPassword(email);
            promise.then(data => {
                showModal();
                console.log("Succeed - data ", data);
            }).catch(err => {
                console.log("Err here", err);
            })
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
    const containerStyle = { backgroundColor: 'white', padding: 20 };
    return (
        <ScrollView style={styles.container}>
            <Title navigation={navigation} title='Forgot Password' />
            <View style={{ alignItems: 'center' }}>
                {/* <Text style={styles.title}>Forgot Password</Text> */}
                <Text style={styles.subTxt}>Enter your email to reset password</Text>
                <View style={{ width: '100%', marginTop: 10, alignItems: 'center' }}>
                    <Image
                        style={{
                            height: width - 40,
                            width: width - 40,
                            borderWidth: 1,
                            borderColor: COLORS.borderColor
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
                    // outlineStyle={focusInput === 'email'
                    //     ? styles.outlineInputFocus
                    //     : styles.defaultOutline}
                    // onFocus={() => setFocusInput('email')}
                    // onBlur={() => setFocusInput(undefined)}
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
            {/* <Modal
                visible={true}
                onDismiss={hideModal}
                contentContainerStyle={containerStyle}
                style={{ flex: 1, backgroundColor: 'blue', opacity: 0.5 }}
            >
                <View style={styles.modal}>
                    <Text>ahasss</Text>
                </View>
            </Modal> */}
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
        backgroundColor: 'red',
        padding: 20,
        width: '40%',
    }
})