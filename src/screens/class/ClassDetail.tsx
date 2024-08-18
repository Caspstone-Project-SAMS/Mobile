import { View, StyleSheet, ScrollView, Image, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Modal, Text, TextInput } from 'react-native-paper'
import { TouchableOpacity } from 'react-native-gesture-handler'

import { COLORS } from '../../assets/styles/variables'
import { GLOBAL_STYLES } from '../../assets/styles/styles'
import DashboardCard from './cards/DashboardCard'
import StudentActivityCard from './cards/StudentActivityCard'
import Title from '../../components/Title'
import { Navigation } from '../../hooks/navigation/Navigation'
import { Attendance } from '../../models/Attendance'
import { AttendanceService } from '../../hooks/Attendance'
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import CustomBtn from '../../components/global/CustomBtn'
import { Toast } from 'react-native-toast-notifications'

const { width } = Dimensions.get('window');

const ClassDetail: React.FC<Navigation> = ({ route, navigation }) => {
    const { schedule: { classCode, classID, date, endTime, roomName, scheduleID, slotNumber, startTime, status, subjectCode } } = route.params

    const [searchVal, setSearchVal] = useState<string>('');
    const [selectedView, setSelectedView] = useState<'list' | 'pending' | 'absent'>('list');
    const [studentList, setStudentList] = useState<Attendance[]>([]);
    const [filteredList, setFilteredList] = useState<Attendance[]>([]);

    const [isOpenActions, setIsOpenActions] = useState<boolean>(false);
    const [isAttendanceMode, setIsAttendanceMode] = useState<boolean>(false);
    const [isOpenFilter, setIsOpenFilter] = useState<boolean>(false);

    const opacity = useSharedValue(0);
    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: withTiming(opacity.value, {
                duration: 260,
            }),
        };
    });

    const handleUpdateStatus = (studentCode: string, status: boolean) => {
        console.log("he;ppppppppp--------------", studentCode, '-', status);
        const statusNumber = status ? (1) : (2);
        const updatedList = filteredList.map(student => {
            if (student.studentCode === studentCode) {
                return { ...student, attendanceStatus: statusNumber }
            } else {
                return student
            }
        })
        setFilteredList(updatedList);
    }

    const handleSubmitAttendance = () => {
        const currentTime = new Date().toISOString();
        const fmtUpdatedList = filteredList.map(item => {
            const { comments, studentID, attendanceStatus } = item;
            if (studentID && attendanceStatus) {
                return {
                    comments: comments ? comments : '',
                    studentID: studentID,
                    scheduleID: Number(scheduleID),
                    attendanceTime: currentTime,
                    attendanceStatus: attendanceStatus === 0 ? 2 : attendanceStatus
                }
            }
        }).filter(item => item !== undefined);

        const response = AttendanceService.updateListAttendance(fmtUpdatedList);
        response.then(data => {
            setIsAttendanceMode(false);
            setStudentList(filteredList)
            Toast.show('Update Attendance Successfully!')
        }).catch(err => {
            Toast.show('Something went wrong, please try again later');
        })
    }

    useEffect(() => {
        const promise = AttendanceService.getAttendanceByScheduleId(scheduleID)
        console.log("Getting scheduleID ", scheduleID);
        promise.then(list => {
            console.log("Studentlist ", list);
            setStudentList(list);
            setFilteredList(list);
        }).catch(err => {
            console.log("Error when get schedule detail");
        })
    }, [])

    useEffect(() => {
        opacity.value = isOpenActions ? 1 : 0;
    }, [isOpenActions]);

    useEffect(() => {
        switch (selectedView) {
            case 'list':
                setFilteredList(studentList)
                break;
            case 'absent':
                {
                    const filter = studentList.filter(student => student.attendanceStatus === 2);
                    setFilteredList(filter)
                }
                break;
            case 'pending':
                const filter = studentList.filter(student => student.attendanceStatus === 0);
                setFilteredList(filter)
                break;
            default:
                break;
        }
    }, [selectedView])

    useEffect(() => {
        console.log("Filter list has change ------------ ", filteredList);
    }, [filteredList])

    return (
        <ScrollView style={styles.container}>
            <Title navigation={navigation} title='Class Activity' />
            <View style={styles.header}>
                <View style={[styles.headerTitle, GLOBAL_STYLES.horizontalCenter]}>
                    <Text style={{ fontFamily: 'Lexend-Regular', fontSize: 18 }}>
                        {classCode}
                    </Text>
                    <View style={[GLOBAL_STYLES.horizontalCenter, { gap: 10 }]}>
                        <View style={{ position: 'relative' }}>
                            <TouchableOpacity
                                onPress={() => {
                                    setIsOpenActions(!isOpenActions)
                                }}
                            >
                                <Image style={styles.titleIcon} source={require('../../assets/icons/plusIconBtn.png')} />
                            </TouchableOpacity>
                            <Animated.View style={[styles.actionsModal, animatedStyle]}>
                                <TouchableOpacity
                                    onPress={() => setIsAttendanceMode(!isAttendanceMode)}
                                >
                                    <Text style={styles.actionItem}>Take attendance mode</Text>
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <Text style={styles.actionItem}>Set up modules</Text>
                                </TouchableOpacity>
                            </Animated.View>
                        </View>
                        <View style={{ position: 'relative' }}>
                            <TouchableOpacity>
                                <Image style={styles.titleIcon} source={require('../../assets/icons/filterIcon.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
                <View style={styles.dashboardCardsCtn}>
                    <View style={styles.dashboardRow}>
                        <DashboardCard label='Attendance' detail='35' theme='info' key={'1'} />
                        <DashboardCard label='Attended' detail='26' theme='success' key={'2'} />
                    </View>
                    <View style={styles.dashboardRow}>
                        <DashboardCard label='Exemptions' detail='2' theme='warning' key={'3'} />
                        <DashboardCard label='Absent' detail='1' theme='danger' key={'4'} />
                    </View>
                </View>
            </View>
            <View style={styles.body}>
                <View style={[
                    GLOBAL_STYLES.horizontalCenter,
                    { gap: 30, marginBottom: 24 }
                ]}>
                    <View style={styles.classInfo}>
                        <Text style={styles.infoTxt}>Subject: {subjectCode}</Text>
                        <Text style={styles.infoTxt}>Room: {roomName}</Text>
                    </View>
                    <TextInput
                        mode="outlined"
                        placeholder="Search.."
                        style={[styles.searchBox, styles.shadow]}
                        right={<TextInput.Icon
                            icon={'magnify'}
                        // onPress={() => { console.log("hehe") }}
                        />}
                        onChangeText={val => setSearchVal(val)}
                    />
                </View>

                <View style={{ flex: 1 }}>
                    <View style={styles.filterListCtn}>
                        <View style={styles.filterBtn}>
                            <TouchableOpacity
                                onPress={() => setSelectedView('list')}
                            >
                                <Text
                                    style={[
                                        styles.filterBtnTxt,
                                        selectedView === 'list' && styles.onSelectedBtn
                                    ]}>
                                    List
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.filterBtn}>
                            <TouchableOpacity
                                onPress={() => setSelectedView('pending')}
                            >
                                <Text
                                    style={[
                                        styles.filterBtnTxt,
                                        selectedView === 'pending' && styles.onSelectedBtn
                                    ]}>
                                    Pending
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.filterBtn}>
                            <TouchableOpacity
                                onPress={() => setSelectedView('absent')}
                            >
                                <Text
                                    style={[
                                        styles.filterBtnTxt,
                                        selectedView === 'absent' && styles.onSelectedBtn
                                    ]}>
                                    Absent
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.studentList}>
                        {
                            filteredList.map((student, i) =>
                                <StudentActivityCard
                                    avatar={student.avatar}
                                    name={student.studentName}
                                    status={student.attendanceStatus}
                                    studentCode={student.studentCode}
                                    attendanceMode={isAttendanceMode}
                                    handleUpdateStatus={handleUpdateStatus}
                                    // absentPercentage={student.absentPercentage}
                                    key={`student_${i}`}
                                />
                            )
                        }
                        {/* Attendance mode */}
                        {
                            isAttendanceMode &&
                            <View style={styles.attendanceActionCtn}>
                                <TouchableOpacity style={styles.attendanceBtns}>
                                    <CustomBtn text='Cancel' key={'cancel_attend'} />
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.attendanceBtns}
                                    onPress={() => handleSubmitAttendance()}
                                >
                                    <CustomBtn text='Submit' key={'submit_attend'} />
                                </TouchableOpacity>
                            </View>
                        }
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingTop: 5,
        paddingBottom: 15,
        backgroundColor: '#FFF'
    },
    header: {},
    actionsModal: {
        minWidth: width * 0.55,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 5,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: COLORS.borderColor,
        gap: 8,

        position: 'absolute',
        top: 40,
        right: 0,
        zIndex: 1,

        shadowColor: '#7F5DF0',
        shadowOffset: {
            width: 0,
            height: 10
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5
    },
    actionItem: {
        textAlign: 'right'
    },
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
    attendanceActionCtn: {
        flexDirection: 'row',
        gap: 20,
        width: '100%',
        backgroundColor: 'red'
    },
    attendanceBtns: {
        width: '100%'
    },
    studentList: {},
})

export default ClassDetail