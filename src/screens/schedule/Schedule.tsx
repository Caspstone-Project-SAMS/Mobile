import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Agenda } from 'react-native-calendars';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import useDispatch from '../../redux/UseDispatch';
import { getScheduleByWeek } from '../../redux/slice/Schedule';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/Store';
import { ScheduleResponse } from '../../models/schedule/ScheduleResponse';
import { Toast } from 'react-native-toast-notifications';
import { HelperService } from '../../hooks/helpers/HelperFunc';
import { COLORS } from '../../assets/styles/variables';
import { Card, Divider } from 'react-native-paper';
import moment from 'moment';

moment.updateLocale('ko', {
    week: {
        dow: 1,
        doy: 1,
    }
})

type FormattedSchedule = {
    [date: string]: ScheduleResponse[];
};
type HeaderProps = {
    month: string,
    year: string,
    onChangeWeek: any,
    onBackToday: any
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

const statusTheme = {
    Past: {
        backgroundColor: COLORS.grayLight,
    },
    Current: {
        backgroundColor: '#3ABE00',
    },
    Upcoming: {
        backgroundColor: '#FBBF24'
    }
}

const CustomHeader: React.FC<HeaderProps> = ({ month, year, onChangeWeek, onBackToday }) => {
    return (
        <View style={styles.headerCtn}>
            <View style={styles.customHeader}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity
                        onPress={() => onBackToday()}
                    >
                        <AntDesign name='calendar' size={32} color={'black'} />
                    </TouchableOpacity>
                    <Text style={styles.headerTxt}>
                        <Text style={{ fontWeight: '500' }}>{month} {''}</Text>
                        <Text>{year}</Text>
                    </Text>
                </View>

                <View style={styles.headerRight}>
                    <TouchableOpacity style={{ padding: 5, backgroundColor: COLORS.mainBlue, borderRadius: 5 }} onPress={() => onChangeWeek(-1)}>
                        <MaterialIcons name="navigate-before" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ padding: 5, backgroundColor: COLORS.mainBlue, borderRadius: 5 }} onPress={() => onChangeWeek(1)}>
                        <MaterialIcons name="navigate-next" size={24} color="#FFF" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const Schedule = ({ navigation }) => {
    const dispatch = useDispatch();
    const schedules = useSelector((state: RootState) => state.schedule);
    const userDetail = useSelector((state: RootState) => state.auth.userDetail?.result);
    const semesters = useSelector((state: RootState) => state.semester.data);

    const today = new Date();
    const [events, setEvents] = useState<any>();
    const [selected, setSelected] = useState(moment(today).format('YYYY-MM-DD'));

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
        const startTime = item.startTime.substring(0, 5);
        const endTime = item.endTime.substring(0, 5);
        const theme = statusTheme[item.status] ? statusTheme[item.status] : statusTheme['Past'];

        return (
            <TouchableOpacity
                style={{ marginRight: 10, marginTop: 17 }}
                onPress={() => { navigation.navigate('ClassDetail', { schedule: item }) }}
            >
                <Card>
                    <Card.Content>
                        <View style={styles.eventCardCtn}>
                            <View style={styles.eventLeft}>
                                <View style={styles.eventTimeStamp}>
                                    <Text style={styles.eventSlot}>Slot {item.slotNumber}</Text>
                                    <View style={{ marginRight: 5 }}>
                                        <View style={styles.dotDecorate}></View>
                                        <Divider horizontalInset={true} style={{ height: '60%', width: 1, alignSelf: 'center' }} />
                                        <View style={styles.dotDecorate}></View>
                                    </View>
                                    <View style={{ justifyContent: 'space-between', alignContent: 'space-between', height: '100%' }}>
                                        <Text>{startTime}</Text>
                                        <Text>{endTime}</Text>
                                    </View>
                                </View>
                                <View style={{ padding: 6, width: 'auto', borderRadius: 10, backgroundColor: theme.backgroundColor }}>
                                    <Text style={{ textAlign: 'center', color: '#FFF' }}>{item.status}</Text>
                                </View>
                            </View>
                            <View style={{ width: '65%' }}>
                                <Text style={{ fontWeight: 500 }}>Room: {item.roomName}</Text>
                                <Text style={{ fontWeight: 500 }}>Class: {item.classCode}</Text>
                                <Text>Subject: {item.subjectCode}</Text>
                            </View>
                        </View>
                    </Card.Content>
                </Card>
            </TouchableOpacity>
        );
    };

    const handleChangeWeek = (index: number) => {
        const result = moment(selected).add(index, 'weeks').startOf('week').format('YYYY-MM-DD');
        setSelected(result)
    }

    const onBackToday = () => {
        setSelected(moment(today).format('YYYY-MM-DD'));
    }

    useEffect(() => {
        const week: Date[] = HelperService.getWeekFromDate(today)
        if (userDetail && userDetail.id) {
            const currentSemester = semesters.filter(item => item.semesterStatus === 2);
            dispatch(getScheduleByWeek({ lecturerID: userDetail.id, semesterID: currentSemester[0].semesterID, week: week }));
        }
    }, []);

    useEffect(() => {
        setEvents(formatScheduleData(schedules.data))
        console.log("This is the result ", formatScheduleData(schedules.data));
    }, [schedules]);

    useEffect(() => {
        if (selected) {
            const fmtDay = new Date(selected)
            const week: Date[] = HelperService.getWeekFromDate(fmtDay)
            if (userDetail && userDetail.id) {
                const currentSemester = semesters.filter(item => item.semesterStatus === 2);
                dispatch(getScheduleByWeek({ lecturerID: userDetail.id, semesterID: currentSemester[0].semesterID, week: week }));
            }
            console.log("selecting day ", selected);
        }
    }, [selected])

    return (
        <View style={{ flex: 1 }}>
            <CustomHeader
                month={moment(selected, 'YYYY-MM-DD', true).format('MMMM')}
                year={moment(selected, 'YYYY-MM-DD', true).format('YYYY')}
                onChangeWeek={handleChangeWeek}
                onBackToday={onBackToday}
            />
            <Agenda
                firstDay={1}
                selected={selected}
                onDayPress={(date) => setSelected(date.dateString)}
                items={events}
                style={{}}
                renderItem={renderItem}
                renderEmptyDate={() => (
                    <View style={{ flex: 1, height: 15, paddingVertical: 10 }}>
                        <Text style={{ textAlign: 'center' }}>No Schedule</Text>
                    </View>
                )}
                renderEmptyData={() => (
                    <View style={{ flex: 1, height: 15, paddingVertical: 10 }}>
                        <Text style={{ textAlign: 'center' }}>No Schedule</Text>
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
    //Event card
    eventCardCtn: {
        gap: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    eventLeft: {
        gap: 8
    },
    dotDecorate: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'black'
    },
    eventTimeStamp: {
        height: 55,
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeSlot: {
        height: '100%',
        justifyContent: 'space-between',
        alignContent: 'space-between',
    },
    eventSlot: {
        transform: [{ rotate: '-90deg' }]
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
    headerTxt: {
        fontSize: 18
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
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