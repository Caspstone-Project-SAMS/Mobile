import { StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Chip, Divider, Text } from 'react-native-paper';
import { GLOBAL_STYLES } from '../../../assets/styles/styles';
import Ionicons from 'react-native-vector-icons/Ionicons'
import moment from 'moment';

type props = {
    date: string,
    status: number,
    slotNumber: number,
    startTime: string,
    endTime: string,
    room?: string,
    studentAttended?: string,
    classSize: any,
    opened?: boolean
}

const statusColor = {
    current: '#C1F2B0',
    past: '#94A3B8',
    upcoming: '#FBBF24'
}

const ScheduleCard: React.FC<props> = ({ date, endTime, slotNumber, startTime, status, room, studentAttended, classSize, opened }) => {
    const [isOpen, setIsOpen] = useState(opened ? opened : false);

    return (
        <View style={[GLOBAL_STYLES.card, styles.container]}>
            <View style={[GLOBAL_STYLES.horizontalBetweenCenter, styles.title]}>
                <Text style={styles.titleTxt}>{moment(date).format('DD-MM-YY')} / {`(${slotNumber})`}</Text>
                <TouchableOpacity
                    onPress={() => setIsOpen(!isOpen)}
                >
                    <Ionicons name={isOpen ? 'chevron-up-outline' : 'chevron-down-outline'} size={20} />
                </TouchableOpacity>
            </View>
            {
                isOpen && (
                    <View style={{ marginTop: 8 }}>
                        <Divider style={styles.divider} />
                        <View style={styles.contents}>
                            <View>
                                <Text>
                                    <Text>Room:{' '}</Text>
                                    <Text>{room}</Text>
                                </Text>
                                <Text>
                                    <Text>Slot:{' '}</Text>
                                    <Text>{slotNumber} ({startTime && startTime.substring(0, 5)} - {endTime && endTime.substring(0, 5)})</Text>
                                </Text>
                                <Text>
                                    <Text>Student Attended:{' '}</Text>
                                    <Text>{studentAttended ? studentAttended : `0/${classSize}`}</Text>
                                </Text>
                            </View>

                            <View style={{ alignItems: 'flex-end', gap: 4 }}>
                                <Text>Status: </Text>
                                <Chip
                                    mode='outlined'
                                    style={[
                                        styles.statusChip,
                                        {
                                            backgroundColor: status === 1 ? ('#FFEAA7') : status === 2 ? ('#C1F2B0') : ('#94A3B8')
                                        }
                                    ]}
                                >
                                    {status === 1 ? ('Not yet') : status === 2 ? ('On going') : ('Ended')}
                                </Chip>
                            </View>
                        </View>
                    </View>
                )
            }
        </View>
    )
}

export default ScheduleCard

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15,
        paddingVertical: 8
    },
    title: {
        // paddingHorizontal: 15,
        // paddingVertical: 8
    },
    titleTxt: {
        fontSize: 18,
        fontFamily: 'Lexend-Regular'
    },
    divider: {
        height: 1,
        width: '100%',
        alignSelf: 'center',
        marginBottom: 4
    },
    contents: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    statusChip: {
        alignSelf: 'flex-start',
        borderRadius: 6
    }
})