import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import { FONT_COLORS } from '../../../assets/styles/variables'

type props = {
    subjectCode: string,
    room: string,
    startTime: string,
    endTime: string,
    status: 'Past' | 'Current' | 'Upcoming',
    attendStudent: string,
    attended: number,
    slotNumber: number
}

const OldActivityCard: React.FC<props> = ({ room, status, subjectCode, endTime, startTime, attendStudent, attended, slotNumber }) => {
    return (
        <View style={styles.container}>
            <View style={styles.left}>

                <View style={{ gap: 2, marginLeft: 10 }}>
                    <Text style={styles.mainTxt}>{subjectCode}</Text>
                    <Text style={styles.mainSubTxt}>Attended: {attendStudent}</Text>
                    <Text style={styles.subTxt}>Ro.{room}</Text>
                    <Text style={styles.subTxt}>Slot {slotNumber}</Text>
                </View>
            </View>
            <View style={styles.right}>
                <View style={styles.iconCtn}>
                    <Image style={styles.upcomingIcon} source={require('../../../assets/icons/out_class_x3.png')} />
                </View>
                {/* <Text style={styles.mainTxt}>{startTime} - {endTime}</Text> */}
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
        padding: 6,
        borderRadius: 6,
        alignSelf: 'flex-start',
        backgroundColor: '#F6F6F6',
    },
    upcomingIcon: {
        width: 18,
        height: 18
    },
    mainTxt: {
        fontFamily: 'Lexend-Regular',
        fontSize: 18
    },
    mainSubTxt: {
        fontFamily: 'Lexend-Regular',
        fontSize: 16
    },
    subTxt: {
        color: FONT_COLORS.blurFontColor
    },
    right: {
        gap: 2,
        alignItems: 'flex-end'
    },
})

export default OldActivityCard