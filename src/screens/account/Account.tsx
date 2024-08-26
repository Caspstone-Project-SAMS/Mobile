import React, { ReactElement } from 'react'
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native'

import { Divider, Text } from 'react-native-paper'
import { Avatar } from 'react-native-paper'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/Store'
import CustomBtn from '../../components/global/CustomBtn'
import { COLORS } from '../../assets/styles/variables'

import Feather from 'react-native-vector-icons/Feather';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useDispatch from '../../redux/UseDispatch'
import { logout } from '../../redux/slice/Auth'

type CardProps = {
    icon: ReactElement,
    text: string,
}

const ActionCard: React.FC<CardProps> = ({ icon, text }) => {
    return (
        <View style={styles.actionCardCtn}>
            <View style={styles.actionInfo}>
                <View style={styles.iconCtn}>
                    {icon}
                </View>
                <Text style={styles.actionTxt}>{text}</Text>
            </View>
            <Feather name='chevron-right' size={25} />
        </View>
    )
}

const Account = ({ navigation }) => {
    const userDetail = useSelector((state: RootState) => state.auth.userDetail?.result);
    const dispatch = useDispatch();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Avatar.Image
                    size={95}
                    source={
                        userDetail?.avatar
                            ? { uri: userDetail.avatar }
                            : userDetail?.gender === 1
                                ? require('../../assets/imgs/male_avatar_removebg.png')
                                : require('../../assets/imgs/female_avatar_removebg.png')
                    }
                    style={styles.userAvatar}
                />
                <Text style={styles.usernameTxt}>{userDetail?.displayName}</Text>
                <Text style={styles.userSubTxt}>{userDetail?.role.name}</Text>
                <TouchableOpacity style={{ width: '100%', marginVertical: 12 }}>
                    <CustomBtn
                        customStyle={styles.editBtn}
                        text='Edit Profile'
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.body}>
                <TouchableOpacity>
                    <ActionCard icon={<Feather name='user' size={20} color='#000' />} text='My Profile' key={'profile'} />
                </TouchableOpacity>
                <Divider style={styles.divider} />

                <TouchableOpacity
                    onPress={() => navigation.navigate('ChangePassword')}
                >
                    <ActionCard icon={<Octicons name='unlock' size={20} color={'black'} />} text='Change Password' key={'change_password'} />
                </TouchableOpacity>
                <Divider style={styles.divider} />

                <TouchableOpacity
                    onPress={() => navigation.navigate('PrivatePolicy')}
                >
                    <ActionCard icon={<Ionicons name='document-text-outline' size={20} color={'black'} />} text='Privacy Policy' key={'policy'} />
                </TouchableOpacity>
                <Divider style={styles.divider} />

                <TouchableOpacity
                    onPress={() => { dispatch(logout()) }}
                >
                    <View style={styles.actionCardCtn}>
                        <View style={styles.actionInfo}>
                            <View style={[styles.iconCtn, { paddingRight: 4 }]}>
                                <SimpleLineIcons name='logout' size={20} color={'#ff776b'} />
                            </View>
                            <Text style={[styles.actionTxt, { color: '#ff776b' }]}>Log out</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    //Component
    actionCardCtn: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-between'
    },
    actionInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20
    },
    iconCtn: {
        width: 46,
        height: 46,
        borderRadius: 25,
        backgroundColor: 'rgba(221, 221, 221, 0.8)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    actionTxt: {
        fontSize: 15,
        fontFamily: 'Lexend-Regular'
    },
    //Main
    container: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#FFF',
        flex: 1
    },
    header: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    userAvatar: {
    },
    usernameTxt: {
        textAlign: 'center',
        fontSize: 20,
        fontFamily: 'Lexend-Regular',
        marginVertical: 4,
    },
    userSubTxt: {
        textAlign: 'center',
        fontSize: 16,
    },
    editBtn: {
        width: '100%',
        backgroundColor: COLORS.skyLgLight,
        paddingVertical: 15,
    },
    body: {
        marginVertical: 20
    },
    divider: {
        marginVertical: 12
    },
})

export default Account