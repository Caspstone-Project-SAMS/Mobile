import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Title from '../../components/Title'
import { Checkbox, Text, TextInput } from 'react-native-paper'
import { COLORS, FONT_COLORS } from '../../assets/styles/variables'
import CustomBtn from '../../components/global/CustomBtn'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment'
import { GLOBAL_STYLES } from '../../assets/styles/styles'
import { Navigation } from '../../hooks/navigation/Navigation'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/Store'
import AuthService from '../../hooks/Auth'
import { Toast } from 'react-native-toast-notifications'

export interface UserProfile {
    firstName: string,
    lastName: string,
    displayName: string,
    email: string,
    address: string,
    DOB: string,
    gender: number,
    phoneNumber: string
}

const AccountProfile: React.FC<Navigation> = ({ route, navigation }) => {
    const { updateAble } = route.params;
    const userInfo = useSelector((state: RootState) => state.auth.userDetail?.result)

    const [focusInput, setFocusInput] = useState<string>('');
    const [userProfile, setUserProfile] = useState<UserProfile>({
        address: '',
        email: '',
        firstName: '',
        displayName: '',
        gender: 0, //0 - nam, 1 - nu
        lastName: '',
        phoneNumber: '',
        DOB: '00/00/0000'
    })
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isUpdate, setIsUpdate] = useState(updateAble ? updateAble : false)

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        console.log("A date has been picked: ", moment(date).format('DD/MM/YYYY'));
        const fmtTime = moment(date).format('YYYY-MM-DD')
        setUserProfile(prev => ({ ...prev, DOB: fmtTime }))
        hideDatePicker();
    };

    const handleGetInfo = () => {
        if (userInfo) {
            const promise = AuthService.getUserDetailByID(userInfo.id)
            promise.then(data => {
                // console.log("This is userdetail ", data);
                const result = data.result;
                if (result) {
                    setUserProfile(prev => ({
                        ...prev,
                        address: result.address,
                        email: result.email,
                        firstName: result.firstName,
                        displayName: result.displayName,
                        gender: result.gender,
                        lastName: result.lastName,
                        phoneNumber: result.phoneNumber,
                        DOB: result.dob,
                    }))
                }
            }).catch(err => {
                console.log("err when getting info ", err.response.data);
            })
        }
    }

    const handleUpdateProfile = () => {
        if (userInfo && userInfo.id) {
            const promise = AuthService.updateProfileByID(userInfo.id, userProfile)
            promise.then(data => {
                Toast.show('Update Info Successfully!', { type: 'success', placement: 'top' });
                handleGetInfo();
                // console.log("Daaaaa ", data);
            }).catch(err => {
                console.log("Err when update profile, ", err.response.data);
            }).finally(() => {
                setIsUpdate(false)
            })
            console.log("This is data gonna sent ", userProfile);
        }
    }

    useEffect(() => {
        handleGetInfo()
    }, [])

    return (
        <ScrollView style={styles.container}>
            <Title title='Profile' navigation={navigation} />
            <View style={{ paddingBottom: 24 }}>
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
                    disabled={!isUpdate}
                    value={userProfile.firstName}
                    onChangeText={val => setUserProfile(prev => ({ ...prev, firstName: val }))}
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
                    disabled={!isUpdate}
                    value={userProfile.lastName}
                    onChangeText={val => setUserProfile(prev => ({ ...prev, lastName: val }))}
                />

                <Text style={styles.label}>Full Name</Text>
                <TextInput
                    mode="outlined"
                    outlineStyle={focusInput === 'displayName'
                        ? styles.outlineInputFocus
                        : styles.defaultOutline}
                    onFocus={() => setFocusInput('displayName')}
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
                    disabled={!isUpdate}
                    value={userProfile.displayName}
                    onChangeText={val => setUserProfile(prev => ({ ...prev, displayName: val }))}
                />
                <View style={[GLOBAL_STYLES.horizontalBetweenCenter, { marginBottom: 18 }]}>
                    <View>
                        <Text style={{ marginBottom: 5 }}>Birthday:</Text>
                        <TouchableOpacity
                            disabled={!isUpdate}
                            onPress={() => {
                                showDatePicker()
                            }}
                        >
                            <View style={[GLOBAL_STYLES.card, { padding: 10, alignSelf: 'flex-start' }]}>
                                <Text>{
                                    userProfile.DOB === '00/00/0000'
                                        ? '00/00/0000'
                                        : moment(userProfile.DOB, 'YYYY-MM-DD', true).format('DD/MM/YYYY')
                                }</Text>
                            </View>
                        </TouchableOpacity>

                        <DateTimePickerModal
                            disabled={!isUpdate}
                            isVisible={isDatePickerVisible}
                            onConfirm={handleConfirm}
                            onCancel={hideDatePicker}
                        />
                    </View>
                    <View>
                        <Text>Gender: </Text>
                        <View style={GLOBAL_STYLES.horizontalBetweenCenter}>
                            <Checkbox
                                status={userProfile.gender === 0 ? 'checked' : 'unchecked'}
                                onPress={() => {
                                    setUserProfile(prev => ({ ...prev, gender: 0 }));
                                }}
                                color="#2563EB"
                                disabled={!isUpdate}
                            />
                            <Text>Male</Text>

                            <Checkbox
                                status={userProfile.gender === 1 ? 'checked' : 'unchecked'}
                                onPress={() => {
                                    setUserProfile(prev => ({ ...prev, gender: 1 }));
                                }}
                                color="#2563EB"
                                disabled={!isUpdate}
                            />
                            <Text>Female</Text>
                        </View>
                    </View>
                </View>

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
                    disabled={!isUpdate}
                    value={userProfile.address}
                    onChangeText={val => setUserProfile(prev => ({ ...prev, address: val }))}
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
                    disabled={!isUpdate}
                    value={userProfile.phoneNumber}
                    onChangeText={val => setUserProfile(prev => ({ ...prev, phoneNumber: val }))}
                />

                <Text style={styles.label}>Email</Text>
                <TextInput
                    mode="outlined"
                    outlineStyle={focusInput === 'email'
                        ? styles.outlineInputFocus
                        : styles.defaultOutline}
                    onFocus={() => setFocusInput('email')}
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
                    disabled={true}
                    value={userProfile.email}
                    onChangeText={val => setUserProfile(prev => ({ ...prev, email: val }))}
                />
                {
                    isUpdate ? (
                        <TouchableOpacity
                            style={{ marginVertical: 24 }}
                            onPress={() => handleUpdateProfile()}
                        >
                            <CustomBtn text='Update Profile' />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={{ marginVertical: 24 }}
                            onPress={() => setIsUpdate(true)}
                        >
                            <CustomBtn text='Edit Profile' />
                        </TouchableOpacity>
                    )
                }
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