import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Agenda } from 'react-native-calendars';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import useDispatch from '../../redux/UseDispatch';
import { getScheduleByWeek } from '../../redux/slice/Schedule';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/Store';
import { ScheduleResponse } from '../../models/schedule/ScheduleResponse';
import { Toast } from 'react-native-toast-notifications';
import { HelperService } from '../../hooks/helpers/HelperFunc';
import { COLORS } from '../../assets/styles/variables';
import { Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const CustomHeader: React.FC = () => {
    // const month = props.month.toString('MMMM');
    // const year = props.month.toString('yyyy');
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const month = 0;
    const year = 0;
    return (
        <View style={styles.headerCtn}>
            <View style={styles.customHeader}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity>
                        <Ionicons name='menu' size={35} color={'black'} />
                    </TouchableOpacity>
                    <Text style={styles.headerTxt}>
                        <Text style={{ fontWeight: '500' }}>{month} {''}</Text>
                        <Text>{year}</Text>
                    </Text>
                </View>

                <View style={styles.headerRight}>
                    <TouchableOpacity onPress={() => { }}>
                        <MaterialIcons name="navigate-before" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { }}>
                        <MaterialIcons name="navigate-next" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.daysOfWeekContainer}>
                {/* {daysOfWeek.map((day, index) => (
                    <Text key={index} style={styles.dayLabel}>{day}</Text>
                ))} */}
            </View>
        </View>
    );
}
const colorPalette = [
    '#12664F', //green
    '#F18F01', //orange
    '#08415C', //Dark blue,
    '#DB504A', //red
    '#624CAB', //purple
    '#ED6A5A', //orange-red
    '#86CB92' //emeral
]

type FormattedSchedule = {
    [date: string]: ScheduleResponse[];
};

const Schedule = ({ navigation }) => {
    const dispatch = useDispatch();
    const schedules = useSelector((state: RootState) => state.schedule);
    const userDetail = useSelector((state: RootState) => state.auth.userDetail?.result);
    const semesters = useSelector((state: RootState) => state.semester.data);

    const today = new Date();
    const [events, setEvents] = useState<any>();
    const [selected, setSelected] = useState('');

    //Merge every events on each date then format to show on calendar
    const formatScheduleData = (data: ScheduleResponse[]): FormattedSchedule => {
        try {
            return data.reduce((acc: FormattedSchedule, item: ScheduleResponse) => {
                if (!acc[item.date]) {
                    acc[item.date] = [];
                }
                acc[item.date].push(item);
                return acc;
            }, {});
        } catch (error) {
            Toast.show('Error occured when format schedule, please try again later')
            return {}
        }
    };

    const renderItem = (item) => {
        return (
            <TouchableOpacity style={{ marginRight: 10, marginTop: 17 }}
                onPress={() => { navigation.navigate('ClassDetail', { schedule: item }) }}
            >
                <Card>
                    <Card.Content>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}>
                            <View>
                                <Text>7:00 - 9:15</Text>
                                <Text>{item.classCode}</Text>
                                <Text>Subject: {item.subjectCode}</Text>
                                <Text>Room: {item.roomName}</Text>
                            </View>
                        </View>
                    </Card.Content>
                </Card>
            </TouchableOpacity>
        );
    };

    useEffect(() => {
        const week: Date[] = HelperService.getWeekFromDate(today)
        if (userDetail && userDetail.id) {
            const currentSemester = semesters.filter(item => item.semesterStatus === 2);
            dispatch(getScheduleByWeek({ lecturerID: userDetail.id, semesterID: currentSemester[0].semesterID, week: week }));
        }
    }, []);

    useEffect(() => {
        // formatScheduleToEvent(schedules.data)
        setEvents(formatScheduleData(schedules.data))
        console.log("This is the result ", formatScheduleData(schedules.data));
    }, [schedules]);

    return (
        <View style={{ flex: 1 }}>
            <CustomHeader />
            <Agenda
                firstDay={1}
                items={events}
                // selected={'2024-08-22'}
                renderItem={renderItem}
                style={{ marginBottom: 50 }}
                renderEmptyDate={() => (
                    <View style={{ flex: 1, height: 15 }}>
                        <Text>Empty</Text>
                    </View>
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerCtn: {

    },
    customHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 15
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12
    },
    daysOfWeekContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: COLORS.borderColor
    },
    dayLabel: {
        flex: 1,
        fontSize: 15,
        textAlign: 'center',
    },
    headerTxt: {
        fontSize: 18
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center'
    },
})

export default Schedule


// Format data to show dots on calendar
// const formatScheduleToEvent = (schedule: ScheduleResponse[]) => {
//     try {
//         const uniqueDays = new Map();
//         schedule.forEach((item, i) => {
//             const dot = {
//                 key: `schedule_${item.scheduleID}`,
//                 color: colorPalette[i],
//                 ...item
//             }
//             if (uniqueDays.get(item.date) !== undefined) {
//                 const val = uniqueDays.get(item.date);
//                 const arr: any[] = val.dots
//                 arr.push(dot)
//                 uniqueDays.set(item.date, { dots: arr })
//             } else {
//                 uniqueDays.set(item.date, {
//                     dots: [
//                         dot
//                     ]
//                 })
//             }
//             return {
//                 [item.date]: dot
//             }
//         })
//         const result: any = {}
//         // console.log("Result", result);
//         for (const [key, value] of uniqueDays) {
//             const format = Object.values(value.dots)
//             // console.log("Format**********************", format);
//             result[key] = { dots: format }
//         }
//         setEvents(result)
//     } catch (error) {
//         console.log("Error format schedule ", error);
//         Toast.show('Formating error when get schedule, please try again later!')
//     }
// }
{/* <Calendar
                firstDay={1}
                onDayPress={day => {
                    setSelected(day.dateString);
                }}
                customHeader={(props: any) => <CustomHeader props={props} />}
                markingType={'multi-dot'}
                markedDates={{
                    [selected]: { selected: true, disableTouchEvent: true, selectedDotColor: 'orange' },
                    ...events
                }}
            /> */}