import React from 'react'
import { Image, ImageSourcePropType, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import { FONT_COLORS } from '../../../assets/styles/variables'

type props = {
    subjectCode: string,
    room: string,
    time: string,
    status: 'Upcoming' | 'Current' | 'Past'
}

const ActivityCard: React.FC<props> = ({ room, status, subjectCode, time }) => {
    return (
        <View style={styles.container}>
            <View style={styles.left}>
                <View style={styles.iconCtn}>
                    <Image style={styles.upcomingIcon} source={require('../../../assets/icons/upcoming_x3.png')} />
                </View>
                <View style={{ gap: 2, marginLeft: 10 }}>
                    <Text style={styles.mainTxt}>{subjectCode}</Text>
                    <Text style={styles.subTxt}>{room}</Text>
                </View>
            </View>
            <View style={styles.right}>
                <Text style={styles.mainTxt}>{time}</Text>
                <Text style={styles.subTxt}>{status}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 20
    },
    left: {
        flexDirection: 'row'
    },
    iconCtn: {
        padding: 10,
        borderRadius: 10,
        alignSelf: 'flex-start',
        backgroundColor: '#F6F6F6',
    },
    upcomingIcon: {
        width: 24,
        height: 24
    },
    mainTxt: {
        fontFamily: 'Lexend-Regular',
        fontSize: 18
    },
    subTxt: {
        color: FONT_COLORS.blurFontColor
    },
    right: {
        gap: 2,
        alignItems: 'flex-end'
    },
})

export default ActivityCard