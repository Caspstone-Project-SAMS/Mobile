import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { Switch, Text } from 'react-native-paper'
import { FONT_COLORS } from '../../../assets/styles/variables'
import { GLOBAL_STYLES } from '../../../assets/styles/styles'
import NonAvatar from '../../../assets/imgs/student_icon.png'

type props = {
    name: string,
    studentCode: string,
    status: number,
    avatar?: string,
    absentPercentage?: number,
    attendanceMode: boolean,
    handleUpdateStatus: any
}

const statusMeaning = {
    0: 'Pending',
    1: 'Attended',
    2: 'Absent'
}

const StudentActivityCard: React.FC<props> = ({ avatar, name, status, studentCode, absentPercentage, attendanceMode, handleUpdateStatus }) => {
    const [isSwitchOn, setIsSwitchOn] = useState(status === 1 ? true : false);

    const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

    useEffect(() => {
        handleUpdateStatus(studentCode, isSwitchOn);
    }, [isSwitchOn])

    return (
        <View style={styles.container}>
            <View style={[GLOBAL_STYLES.horizontalCenter, { width: '70%', gap: 10 }]}>
                <Image
                    style={styles.userAvatar}
                    source={
                        avatar ? { uri: avatar } : NonAvatar
                    }
                />
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>{name}</Text>
                    <Text style={styles.blurTxt}>{studentCode}</Text>
                </View>
            </View>
            <View style={{ gap: 5, width: '30%' }}>
                {
                    attendanceMode ? (
                        <View style={{ alignItems: 'flex-end' }}>
                            <Switch
                                color={isSwitchOn ? 'green' : '#FF776B'}
                                trackColor={{ false: '#FF776B' }}
                                value={isSwitchOn} onValueChange={onToggleSwitch}
                            />
                            <Text
                                style={isSwitchOn ? { color: 'green' } : { color: 'red' }}
                            >
                                {isSwitchOn ? 'Attended' : 'Absent'}
                            </Text>
                        </View>
                    ) : (
                        <>
                            <Text style={[
                                styles.activityStatus,
                                status === 0 ? ({ color: '#FF8F00' })
                                    : status === 1 ? ({ color: '#3ABE00' }) : ({ color: '#DC4437' })
                            ]}>
                                {/* @ts-ignore */}
                                {statusMeaning[status] ? statusMeaning[status] : statusMeaning[2]}
                            </Text>
                            <Text style={[styles.blurTxt, { textAlign: 'right' }]}>
                                Absent - {absentPercentage ? absentPercentage : 0}%
                            </Text>
                        </>
                    )
                }
            </View>
        </View>
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

export default StudentActivityCard