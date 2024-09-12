import { View, StyleSheet, ScrollView, Image, Dimensions } from 'react-native'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Modal, Text, TextInput } from 'react-native-paper'
import { TouchableOpacity } from 'react-native-gesture-handler'

import { COLORS, FONT_COLORS } from '../../assets/styles/variables'
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
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ClassService } from '../../hooks/Class'
import PrepareModule from '../../components/module/PrepareModule'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/Store'

const { width } = Dimensions.get('window');

type DashBoard = {
    attendance: number,
    attended: number,
    absent: number,
    pending: number,
}

interface AttendanceExtend extends Attendance {
    absentPercentage: number
}

let socket;

const ClassDetail: React.FC<Navigation> = ({ route, navigation }) => {
    const { schedule: { classCode, classID, date, endTime, roomName, scheduleID, slotNumber, startTime, status, subjectCode } } = route.params

    const [searchVal, setSearchVal] = useState<string>('');
    const [selectedView, setSelectedView] = useState<'list' | 'pending' | 'absent'>('list');
    const [dashBoard, setDashBoard] = useState<DashBoard>({ attendance: 0, absent: 0, attended: 0, pending: 0 });
    const [studentList, setStudentList] = useState<Attendance[] | AttendanceExtend[]>([]);
    const [filteredList, setFilteredList] = useState<Attendance[] | AttendanceExtend[]>([]);

    const [isOpenActions, setIsOpenActions] = useState<boolean>(false);
    const [isAttendanceMode, setIsAttendanceMode] = useState<boolean>(false);
    const [isOpenFilter, setIsOpenFilter] = useState<boolean>(false);

    const userToken = useSelector((state: RootState) => state.auth.userDetail?.token)

    const opacity = useSharedValue(0);
    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: withTiming(opacity.value, {
                duration: 260,
            }),
        };
    });

    function activeWebSocket() {
        if (userToken) {
            socket = new WebSocket("wss://sams-project.com/ws/client?mobile=true", ["access_token", userToken]);
            socket.onopen = function (event) {
                console.log('Connected websocket for slot class detail');
                // setInformation("Connected");
            };

            socket.onclose = function (event) {
                console.log("Connection closed");
                console.log(event);
            };

            socket.onmessage = function (event) {
                console.log("Event coming", event);

                const message = JSON.parse(event.data);
                console.log("mess message event*", message.Event);
                console.log("mess message Data*", message.Data);
                switch (message.Event) {
                    case "StudentAttended":
                        {
                            try {
                                const studentIDs = message.Data.studentIDs
                                console.log("studentIDS ", studentIDs);
                                if (Array.isArray(studentIDs)) {
                                    studentIDs.map(item => {
                                        console.log("On update item ", item);


                                    })
                                }
                            } catch (error) {
                                // Toast.show('Unexpected error happened when connecting')
                                console.log("An error occured in websocket");
                            }
                        }
                        break;
                    default:
                        break;
                }
            };
        }
    }

    const getScheduleDetail = () => {
        const promise = AttendanceService.getAttendanceByScheduleId(scheduleID)
        const promise2 = ClassService.getClassByID(classID)
        console.log("Getting schedule id ", scheduleID);
        promise.then(list => {
            promise2.then(data => {

                if (data.students && data.students?.length > 0) {
                    const students = data.students;
                    const modifiedList: AttendanceExtend[] = list.map(studentAttendance => {
                        let result: AttendanceExtend = { ...studentAttendance, absentPercentage: 0 }

                        students.forEach(student => {
                            if (studentAttendance.studentID === student.id) {
                                result = { ...result, absentPercentage: student.absencePercentage }
                            }
                        })
                        return result
                    })
                    setDashBoard(dashboardCalculator(modifiedList));
                    setStudentList(modifiedList);
                    setFilteredList(modifiedList);
                } else {
                    setDashBoard(dashboardCalculator(list));
                    setStudentList(list);
                    setFilteredList(list);
                }

            }).catch(err => {
                setDashBoard(dashboardCalculator(list));
                setStudentList(list);
                setFilteredList(list);
            })
        }).catch(err => {
            console.log("Error when get schedule detail");
        })
    }

    const dashboardCalculator = (list: Attendance[]): DashBoard => {
        const dashBoard: DashBoard = { attendance: list.length, attended: 0, absent: 0, pending: 0 }
        list.forEach(item => {
            switch (item.attendanceStatus) {
                case 0:
                    dashBoard.pending = dashBoard.pending + 1;
                    break;
                case 1:
                    dashBoard.attended = dashBoard.attended + 1;
                    break;
                case 2:
                    dashBoard.absent = dashBoard.absent + 1;
                    break;
                default:
                    break;
            }
        })

        return dashBoard
    }

    const handleUpdateStatus = useCallback((studentCode: string, status: boolean) => {
        if (isOpenActions) {
            setIsOpenActions(false);
        }
        // console.log("he;ppppppppp--------------", studentCode, '-', status);
        setFilteredList((prevList) => {
            return prevList.map(student => {
                if (student.studentCode === studentCode) {
                    return { ...student, attendanceStatus: status ? 1 : 2 };
                } else {
                    return student;
                }
            });
        });
    }, [filteredList])

    const handleSubmitAttendance = () => {
        setSelectedView('list');

        const currentTime = new Date().toISOString();
        const fmtUpdatedList = filteredList.map(item => {
            const { comments, studentID, attendanceStatus } = item;
            if (studentID) {
                return {
                    comments: comments ? comments : '',
                    studentID: studentID,
                    scheduleID: Number(scheduleID),
                    attendanceTime: currentTime,
                    attendanceStatus: attendanceStatus === 0 ? 2 : attendanceStatus
                }
            }
        });

        // console.log("Gonna updated this list - fmtupdatedlist", fmtUpdatedList);
        const response = AttendanceService.updateListAttendance(fmtUpdatedList);
        response.then(data => {
            setIsAttendanceMode(false);
            getScheduleDetail()
            Toast.show('Update Attendance Successfully!', { type: 'success', placement: 'top' })
        }).catch(err => {
            Toast.show('Something went wrong, please try again later');
        })
    }

    const handleSearch = (value: string) => {
        if (value.length === 0) {
            setFilteredList(studentList)
        } else {
            const filtered = studentList.filter((item) =>
                item.studentCode!.toLowerCase().includes(value.toLowerCase()) ||
                item.studentName!.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredList(filtered);
        }
    };

    useEffect(() => {
        getScheduleDetail();
        // activeWebSocket();

        // return () => {
        //     socket.close();
        // };
    }, [])

    //Original change -> update for ui and dashboard
    useEffect(() => {
        setFilteredList(studentList);
        setDashBoard(dashboardCalculator(studentList))
    }, [studentList])

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
                {
                    const filter = studentList.filter(student => student.attendanceStatus === 0);
                    setFilteredList(filter)
                }
                break;
            default:
                break;
        }
    }, [selectedView]);

    // useEffect(() => {
    //     console.log("Filter list has change ------------ ", filteredList);
    // }, [filteredList])

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
                                <PrepareModule
                                    scheduleID={scheduleID}
                                    txtStyle={{ color: FONT_COLORS.greyFontColor, textAlign: 'right' }}
                                />

                                <TouchableOpacity
                                    onPress={() => { navigation.navigate('Module') }}
                                >
                                    <Text style={styles.actionItem}>Set up modules</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => {
                                        if (isAttendanceMode === true) {//Reset when repress on action
                                            setFilteredList(studentList);
                                        }
                                        setIsAttendanceMode(!isAttendanceMode)
                                    }}
                                >
                                    <Text style={styles.actionItem}>Take attendance mode</Text>
                                </TouchableOpacity>
                            </Animated.View>
                        </View>
                        {/* <View style={{ position: 'relative' }}>
                            <TouchableOpacity>
                                <Image style={styles.titleIcon} source={require('../../assets/icons/filterIcon.png')} />
                            </TouchableOpacity>
                        </View> */}
                    </View>

                </View>
                <View style={styles.dashboardCardsCtn}>
                    <View style={styles.dashboardRow}>
                        <DashboardCard label='Attendants' detail={dashBoard.attendance} theme='info' key={'1'} />
                        <DashboardCard label='Attended' detail={dashBoard.attended} theme='success' key={'2'} />
                    </View>
                    <View style={styles.dashboardRow}>
                        <DashboardCard label='Pending' detail={dashBoard.pending} theme='warning' key={'3'} />
                        <DashboardCard label='Absent' detail={dashBoard.absent} theme='danger' key={'4'} />
                    </View>
                </View>
            </View>
            <View style={styles.body}>
                <View style={[
                    GLOBAL_STYLES.horizontalCenter,
                    { gap: 30, marginBottom: 24 }
                ]}>
                    <View style={styles.classInfo}>
                        <Text style={styles.infoTxt}>Room: {roomName}</Text>
                        <Text style={styles.infoTxt}>Subject: {subjectCode}</Text>
                    </View>
                    <TextInput
                        mode="outlined"
                        placeholder="Search.."
                        style={[styles.searchBox, styles.shadow]}
                        right={<TextInput.Icon
                            icon={'magnify'}
                            onPress={() => handleSearch(searchVal)}
                        />}
                        onChangeText={val => {
                            handleSearch(val);
                            setSearchVal(val);
                        }}
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
                            filteredList.length > 0 ? (
                                <>
                                    {
                                        filteredList.map((student, i) =>
                                            <StudentActivityCard
                                                avatar={student.avatar}
                                                name={student.studentName}
                                                status={student.attendanceStatus}
                                                studentCode={student.studentCode}
                                                attendanceMode={isAttendanceMode}
                                                handleUpdateStatus={handleUpdateStatus}
                                                absentPercentage={student.absentPercentage ? student.absentPercentage : 0}
                                                key={`student_${student.studentCode}`}
                                            />
                                        )
                                    }
                                    {/* Attendance mode */}
                                    {
                                        isAttendanceMode &&
                                        <View style={styles.attendanceActionCtn}>
                                            <TouchableOpacity style={styles.attendanceBtns}
                                                onPress={() => {
                                                    setFilteredList(studentList);
                                                    setIsAttendanceMode(!isAttendanceMode)
                                                }}
                                            >
                                                <CustomBtn
                                                    text='Cancel'
                                                    key={'cancel_attend'}
                                                    customStyle={{ width: '80%', backgroundColor: '#FF776B' }}
                                                    colorTxt={{ color: '#FFF', marginLeft: 2, fontSize: 16 }}
                                                    icon={<Ionicons name='remove-circle-outline' size={24} color={'#FFF'} />}
                                                />
                                            </TouchableOpacity>

                                            <TouchableOpacity style={styles.attendanceBtns}
                                                onPress={() => handleSubmitAttendance()}
                                            >
                                                <CustomBtn
                                                    text='Submit'
                                                    key={'submit_attend'}
                                                    customStyle={{ width: '80%', backgroundColor: COLORS.skyBlue }}
                                                    colorTxt={{ color: '#FFF', marginLeft: 2, fontSize: 16 }}
                                                    icon={<Ionicons name='checkmark-circle-outline' size={24} color={'#FFF'} />}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    }
                                </>
                            ) : (
                                <View style={GLOBAL_STYLES.verticalBetweenCenter}>
                                    <Image
                                        style={{ width: 100, height: 100 }}
                                        source={require('../../assets/imgs/nodata_black.png')} alt='No data image' />
                                    <Text>No Data</Text>
                                </View>
                            )
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
        gap: 10,

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
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    button: {

    },
    cancelBtn: {
        backgroundColor: '#FF776B',
        flex: 1,
        color: '#000',
    },
    submitBtn: {
        backgroundColor: '#C1F2B0',
        flex: 1,
        color: '#000'
    },
    attendanceBtns: {
        // width: '100%'
    },
    studentList: {},
})

export default ClassDetail