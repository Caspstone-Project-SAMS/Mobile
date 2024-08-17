import { View, StyleSheet, ScrollView, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Text, TextInput } from 'react-native-paper'
import { TouchableOpacity } from 'react-native-gesture-handler'

import { COLORS, FONT_COLORS } from '../../assets/styles/variables'
import { GLOBAL_STYLES } from '../../assets/styles/styles'
import DashboardCard from './cards/DashboardCard'
import StudentActivityCard from './cards/StudentActivityCard'
import { Slots } from '../../models/schedule/Slot'
import ActivityCard from '../home/cards/ActivityCard'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/Store'
import useDispatch from '../../redux/UseDispatch'
import { getTodaySchedule } from '../../redux/slice/Schedule'


const Class = ({ navigation }) => {
    const [searchVal, setSearchVal] = useState<string>('')
    const [selectedView, setSelectedView] = useState<'list' | 'pending' | 'absent'>('list')
    const { todaySchedules } = useSelector((state: RootState) => state.schedule);
    const dispatch = useDispatch();
    const userDetail = useSelector((state: RootState) => state.auth.userDetail?.result)
    const semesters = useSelector((state: RootState) => state.semester.data)

    useEffect(() => {
        const currentSemester = semesters.filter(item => item.semesterStatus === 2)
        if (todaySchedules.length === 0 && userDetail) {
            dispatch(getTodaySchedule({ lecturerId: userDetail.id, semesterId: currentSemester[0].semesterID }))
        }
    }, [])

    return (
        <ScrollView style={styles.container}>
            <View style={styles.classActivities}>
                <View style={styles.activitiesHeader}>
                    <Text style={GLOBAL_STYLES.titleLabel}>Today Activities | {todaySchedules.length}</Text>
                    <TouchableOpacity>
                        <Text style={{ color: FONT_COLORS.blueFontColor }}>View All</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ gap: 10 }}>
                    {
                        todaySchedules.map((item, i) => {
                            const timeSlot = Slots[item.slotNumber - 1].timeStart + ' - ' + Slots[item.slotNumber - 1].timeEnd
                            return (
                                <TouchableOpacity
                                    onPress={() => {
                                        navigation.navigate('ClassDetail', { schedule: item })
                                    }}
                                    key={`schedule_${i}`}
                                >
                                    <ActivityCard
                                        room={item.roomName}
                                        status={item.status ?? 'Past'}
                                        subjectCode={item.subjectCode}
                                        time={timeSlot}
                                    />
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#FFF'
    },
    header: {},
    headerTitle: {
        justifyContent: 'space-between',
    },
    titleIcon: {
        width: 25,
        height: 25,
    },
    dashboardCardsCtn: {
        marginTop: 25,
    },
    dashboardRow: {
        flex: 2,
        gap: 12,
        flexDirection: 'row',
        marginBottom: 12
    },

    body: {
        marginTop: 12,
        marginBottom: 40
    },
    classInfo: {
    },
    infoTxt: {
        flex: 1,
        fontFamily: 'Lexend-Regular',
        fontSize: 16
    },
    searchBox: {
        flex: 1,
        height: 55
    },
    shadow: {
        shadowColor: '#000',
        shadowOffset: { width: 5, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 3.84,
        elevation: 5,
    },
    filterListCtn: {
        flex: 1,
        marginBottom: 20,
        borderRadius: 10,
        flexDirection: 'row',
        backgroundColor: '#F4F4F4',
    },
    filterBtn: {
        flex: 1,
    },
    filterBtnTxt: {
        textAlign: 'center',
        paddingVertical: 16,
        fontSize: 15,
        borderRadius: 10
    },
    onSelectedBtn: {
        backgroundColor: COLORS.skyBlue,
        color: '#FFF'
    },
    studentList: {},

    //Today activities
    classActivities: {
        marginTop: 5,
        marginBottom: 25
    },
    activitiesHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
})

export default Class