import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import { FONT_COLORS } from '../../../assets/styles/variables'
import { GLOBAL_STYLES } from '../../../assets/styles/styles'

type props = {
    name: string,
    studentCode: string,
    status: string,
    image: string
}

const StudentActivityCard: React.FC = () => {
    return (
        <View style={styles.container}>
            <View style={GLOBAL_STYLES.horizontalCenter}>
                <Image style={styles.userAvatar} source={require('../../../assets/imgs/music is powerful.jpg')} />
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>Nguyễn Hồ Hồng Đức</Text>
                    <Text style={styles.blurTxt}>SE161458</Text>
                </View>
            </View>
            <View style={{ gap: 5 }}>
                <Text style={[styles.activityStatus, { textAlign: 'right' }]}>Attended</Text>
                <Text style={[styles.blurTxt, { textAlign: 'right' }]}>Absent - 10%</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15
    },
    userAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25
    },
    userInfo: {
        marginLeft: 10,
        gap: 5
    },
    userName: {
        fontFamily: 'Lexend-Regular',
        fontSize: 18
    },
    blurTxt: {
        color: FONT_COLORS.blurFontColor
    },
    activityStatus: {
        fontSize: 16
    }
})

export default StudentActivityCard