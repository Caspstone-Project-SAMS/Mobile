import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { Switch, Text } from 'react-native-paper'
import { FONT_COLORS } from '../../../assets/styles/variables'
import { GLOBAL_STYLES } from '../../../assets/styles/styles'
import NonAvatar from '../../../assets/imgs/student_icon.png'

type props = {
    name: string,
    studentCode: string,
    avatar?: string,
    absentPercentage?: number,
    email?: string
}

const StudentCard: React.FC<props> = ({ avatar, name, studentCode, absentPercentage, email }) => {
    return (
        <View style={styles.container}>
            <View style={[GLOBAL_STYLES.horizontalCenter, { width: '72%', gap: 10 }]}>
                <Image
                    style={styles.userAvatar}
                    source={
                        avatar ? { uri: avatar } : NonAvatar
                    }
                />
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>{name}</Text>
                    <Text style={[styles.blurTxt, { fontSize: 12 }]}>{email}</Text>
                </View>
            </View>
            <View style={{ gap: 5, width: '28%' }}>
                <Text style={styles.activityStatus} >
                    {studentCode}
                </Text>
                <Text style={[styles.blurTxt, { textAlign: 'right' }, absentPercentage! >= 20 && { color: 'red' }]}>
                    Absent - {absentPercentage ? absentPercentage : 0}%
                </Text>
            </View>
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    userAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25
    },
    userInfo: {
        gap: 5,
        width: '75%',
    },
    userName: {
        fontFamily: 'Lexend-Regular',
        fontSize: 17,
        flexWrap: 'wrap',
    },
    blurTxt: {
        color: FONT_COLORS.blurFontColor
    },
    activityStatus: {
        fontSize: 16,
        textAlign: 'right'
    }
})

export default StudentCard