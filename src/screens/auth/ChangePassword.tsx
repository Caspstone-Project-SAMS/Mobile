import { Dimensions, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Title from '../../components/Title'
import { COLORS, FONT_COLORS } from '../../assets/styles/variables';
import { MD3Colors, TextInput } from 'react-native-paper';
import CustomBtn from '../../components/global/CustomBtn';

const { width } = Dimensions.get('window');

const ChangePassword = ({ navigation }) => {
    const [originalPass, setOriginalPass] = useState<string>('');
    const [secureOrigin, setSecureOrigin] = useState<boolean>(true);

    const [newPass, setNewPass] = useState<string>('');
    const [secureNew, setSecureNew] = useState<boolean>(true);

    const [reNewPass, setReNewPass] = useState<string>('');
    const [secureReEnter, setSecureReEnter] = useState<boolean>(true);

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
                    onChangeText={val => setOriginalPass(val)}
                    right={
                        <TextInput.Icon
                            icon={secureOrigin ? 'eye-off-outline' : 'eye-outline'}
                            color={MD3Colors.primary0}
                            onPress={() => setSecureOrigin(!secureOrigin)}
                        />
                    }
                />
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
                    onChangeText={val => setOriginalPass(val)}
                    right={
                        <TextInput.Icon
                            icon={secureNew ? 'eye-off-outline' : 'eye-outline'}
                            color={MD3Colors.primary0}
                            onPress={() => setSecureNew(!secureNew)}
                        />
                    }
                />
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
                    onChangeText={val => setOriginalPass(val)}
                    right={
                        <TextInput.Icon
                            icon={secureReEnter ? 'eye-off-outline' : 'eye-outline'}
                            color={MD3Colors.primary0}
                            onPress={() => setSecureReEnter(!secureReEnter)}
                        />
                    }
                />

                <TouchableOpacity style={{ marginTop: 20 }}>
                    <CustomBtn text='Change Password' />
                </TouchableOpacity>
            </View>
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