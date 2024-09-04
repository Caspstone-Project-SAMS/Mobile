import { View, StyleSheet, Image, ImageSourcePropType, TouchableOpacity } from 'react-native'
import React from 'react'
import { Text } from 'react-native-paper'
import { ScheduleResponse } from '../../../models/schedule/ScheduleResponse'
import { ParamListBase, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

type props = {
    titleIcon: ImageSourcePropType,
    titleTxt: string,
    detail: string,
    subDetail: string,
    isUpcoming?: boolean,
    upComingSchedule?: ScheduleResponse
}

const SmallCard: React.FC<props> = ({ detail, subDetail, titleIcon, titleTxt, isUpcoming, upComingSchedule }) => {
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

    return (
        <View style={styles.cardSmall}>
            <View style={styles.title}>
                <View style={styles.titleIconCtn}>
                    <Image source={titleIcon} style={styles.cardIcon} />
                </View>
                <Text style={styles.titleTxt}>{titleTxt}</Text>

            </View>

            {
                isUpcoming ? (
                    <TouchableOpacity
                        style={styles.detail}
                        onPress={() => {
                            if (upComingSchedule) {
                                navigation.navigate('ClassDetail', { schedule: upComingSchedule })
                            }
                        }}
                    >
                        <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={styles.detail}
                        >
                            {detail}
                        </Text>
                        {
                            upComingSchedule?.slotNumber ? (
                                <Text style={styles.titleTxt}>Slot: {upComingSchedule?.slotNumber}</Text>
                            ) : (
                                <Text style={[{ fontSize: 14, marginTop: 5 }]}>Day finished</Text>
                            )
                        }
                    </TouchableOpacity>
                ) : (
                    <>
                        <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={styles.detail}
                        >
                            {detail}
                        </Text>
                        <Text style={{ fontSize: 14 }}>{subDetail}</Text>
                    </>
                )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    cardSmall: {
        flex: 1,
        backgroundColor: "#FFF",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 14,
        gap: 5,
        flexWrap: 'wrap'
    },
    title: {
        gap: 8,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    titleIconCtn: {
        backgroundColor: '#F6F6F6',
        padding: 10,
        borderRadius: 10
    },
    cardIcon: {
        width: 20,
        height: 20
    },
    titleTxt: {
        flex: 1,
        fontSize: 16,
        // fontFamily: 'Lexend-Regular'
    },
    detail: {
        fontSize: 18,
        fontFamily: 'Lexend-Medium',
        width: '105%'
    },
})

export default SmallCard