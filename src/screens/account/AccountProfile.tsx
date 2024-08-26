import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import Title from '../../components/Title'
import { Text, TextInput } from 'react-native-paper'
import { COLORS, FONT_COLORS } from '../../assets/styles/variables'
import CustomBtn from '../../components/global/CustomBtn'

type UserProfile = {
    firstName: string,
    lastName: string,
    fullName: string,
    email: string,
    address: string,
    yob: string,
    gender: number,
    phoneNumber: string
}

const AccountProfile = ({ navigation }) => {
    const [focusInput, setFocusInput] = useState<string>('');
    const [text, setText] = useState("");
    const [userProfile, setUserProfile] = useState<UserProfile>({
        address: '',
        email: '',
        firstName: '',
        fullName: '',
        gender: 1,
        lastName: '',
        phoneNumber: '',
        yob: ''
    })

    return (
        <ScrollView style={styles.container}>
            <Title title='Profile' navigation={navigation} />
            <View>
                <Text style={styles.label}>First Name</Text>
                <TextInput
                    mode="outlined"
                    outlineStyle={focusInput === 'firstName'
                        ? styles.outlineInputFocus
                        : styles.defaultOutline}
                    onFocus={() => setFocusInput('firstName')}
                    onBlur={() => setFocusInput('')}
                    style={[styles.input, {
                        marginTop: 10,
                        backgroundColor: "#FFF"
                    }]}
                    theme={{
                        colors: {
                            primary: COLORS.skyBlue,
                            text: FONT_COLORS.greyFontColor,
                        },
                    }}
                    onChangeText={val => setText(val)}
                />

                <Text style={styles.label}>Last Name</Text>
                <TextInput
                    mode="outlined"
                    outlineStyle={focusInput === 'lastName'
                        ? styles.outlineInputFocus
                        : styles.defaultOutline}
                    onFocus={() => setFocusInput('lastName')}
                    onBlur={() => setFocusInput('')}
                    style={[styles.input, {
                        // marginTop: 10,
                        backgroundColor: "#FFF"
                    }]}
                    theme={{
                        colors: {
                            primary: COLORS.skyBlue,
                            text: FONT_COLORS.greyFontColor,
                        },
                    }}
                    onChangeText={val => setText(val)}
                />

                <Text style={styles.label}>Full Name</Text>
                <TextInput
                    mode="outlined"
                    outlineStyle={focusInput === 'fullName'
                        ? styles.outlineInputFocus
                        : styles.defaultOutline}
                    onFocus={() => setFocusInput('fullName')}
                    onBlur={() => setFocusInput('')}
                    style={[styles.input, {
                        // marginTop: 10,
                        backgroundColor: "#FFF"
                    }]}
                    theme={{
                        colors: {
                            primary: COLORS.skyBlue,
                            text: FONT_COLORS.greyFontColor,
                        },
                    }}
                    onChangeText={val => setText(val)}
                />

                <Text style={styles.label}>Address</Text>
                <TextInput
                    mode="outlined"
                    outlineStyle={focusInput === 'address'
                        ? styles.outlineInputFocus
                        : styles.defaultOutline}
                    onFocus={() => setFocusInput('address')}
                    onBlur={() => setFocusInput('')}
                    style={[styles.input, {
                        // marginTop: 10,
                        backgroundColor: "#FFF"
                    }]}
                    theme={{
                        colors: {
                            primary: COLORS.skyBlue,
                            text: FONT_COLORS.greyFontColor,
                        },
                    }}
                    onChangeText={val => setText(val)}
                />

                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                    mode="outlined"
                    outlineStyle={focusInput === 'phoneNumber'
                        ? styles.outlineInputFocus
                        : styles.defaultOutline}
                    onFocus={() => setFocusInput('phoneNumber')}
                    onBlur={() => setFocusInput('')}
                    style={[styles.input, {
                        // marginTop: 10,
                        backgroundColor: "#FFF"
                    }]}
                    theme={{
                        colors: {
                            primary: COLORS.skyBlue,
                            text: FONT_COLORS.greyFontColor,
                        },
                    }}
                    onChangeText={val => setText(val)}
                />
                <TouchableOpacity>
                    <CustomBtn text='Update Profile' />
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

export default AccountProfile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 15,
        paddingHorizontal: 20,
        backgroundColor: '#FFF',
    },
    label: {
        fontSize: 12,
        color: FONT_COLORS.blurFontColor
    },
    outlineInputFocus: {
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderColor: COLORS.skyBase,
    },
    defaultOutline: {
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
    },
    input: {
        marginBottom: 18,
        width: 'auto',
        backgroundColor: '#f1f4ff',
        // paddingHorizontal: 4,
        height: 46
    },
})