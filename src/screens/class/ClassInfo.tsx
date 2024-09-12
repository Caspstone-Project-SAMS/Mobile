import { Image, ImageSourcePropType, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Text } from 'react-native-paper'
import Title from '../../components/Title'
import { COLORS, FONT_COLORS } from '../../assets/styles/variables'
import { GLOBAL_STYLES } from '../../assets/styles/styles'
import { Pie, PolarChart } from "victory-native";
import StudentCard from './cards/StudentCard'
import { ClassModel, ClassSchedule, Student } from '../../models/Class'
import { ClassService } from '../../hooks/Class'
import { AttendanceReport } from '../../models/Attendance'
import { HelperService } from '../../hooks/helpers/HelperFunc'
import ScheduleCard from './cards/ScheduleCard'
import NoData from '../../components/global/NoData'

type SectionChip = {
    label: string,
    icon: ImageSourcePropType,
    info: string,
    infoTxtColor?: string,
}

type PieChartModel = {
    value: number,
    color: string,
    label: string
}

const SectionDetailChip: React.FC<SectionChip> = ({ icon, info, label, infoTxtColor }) => {
    return (
        <View style={styles.detailSection}>
            <Text style={{ color: FONT_COLORS.blurFontColor }}>{label}</Text>
            <View style={[GLOBAL_STYLES.card, { padding: 8, gap: 5, flexDirection: 'row', alignItems: 'center' }]}>
                <Image
                    source={icon}
                    style={{ width: 24, height: 24 }}
                />
                <Text style={infoTxtColor ? { color: infoTxtColor } : {}}>{info}</Text>
            </View>
        </View>
    )
}

const ClassInfo = ({ route, navigation }) => {
    const { classData: { classCode, classID, classStatus, room, semester, subject } } = route.params;

    const [attendanceChart, setAttendanceChart] = useState<PieChartModel[]>([]);
    const [insetWidth, setInsetWidth] = useState(4);
    const [insetColor, setInsetColor] = useState<string>("#fafafa");

    const [selectedView, setSelectedView] = useState<'student' | 'schedule'>('student');
    const [classInfo, setClassInfo] = useState<ClassModel>();
    const [studentList, setStudentList] = useState<Student[]>([]);
    const [scheduleList, setScheduleList] = useState<ClassSchedule[]>([]);
    const [classReport, setClassReport] = useState<AttendanceReport[]>([]);

    const calAttendanceChart = (data: AttendanceReport[]) => {
        let totalRecord = 0;
        let totalNotYet = 0;
        let totalAttended = 0;
        let totalAbsent = 0;
        data.forEach(item => {
            totalRecord += item.attendanceRecords.length;
            item.attendanceRecords.forEach(record => {
                switch (record.status) {
                    case 0:
                        totalNotYet += 1
                        break;
                    case 1:
                        totalAttended += 1
                        break;
                    case 2:
                        totalAbsent += 1
                        break;
                    default:
                        break;
                }
            })
        })

        const fmtData: PieChartModel[] = [
            {
                value: HelperService.getPercentOnTotal(totalNotYet, totalRecord),
                color: '#FFD21C',
                label: 'Not yet Percent'
            },
            {
                value: HelperService.getPercentOnTotal(totalAttended, totalRecord),
                color: '#3ABE00',
                label: 'Attended Percent'
            },
            {
                value: HelperService.getPercentOnTotal(totalAbsent, totalRecord),
                color: '#DC4437',
                label: 'Absent Percent'
            }
        ]
        // console.log("Total record ", totalRecord);
        return fmtData;
    }

    useEffect(() => {
        const promise = ClassService.getClassByID(classID);
        promise.then(data => {
            setClassInfo(data);
            if (data.students) {
                setStudentList(data.students)
            }
            if (data.schedules) {
                setScheduleList(data.schedules)
            }
        }).catch(err => {
            console.log("Err occured when loading class info", JSON.stringify(err));
        })

        const promiseReport = ClassService.getClassAttendanceReport(classID);
        promiseReport.then(data => {
            // console.log("This is class report data *****", JSON.stringify(data));
            setClassReport(data);
            setAttendanceChart(calAttendanceChart(data));
        }).catch(err => {
            console.log("error occured when get class report");
        })
    }, []);

    // useEffect(() => {
    //     console.log("Student list has change ", studentList);
    // }, [studentList])

    return (
        <ScrollView style={styles.container}>
            <Title title={`${classCode}`} navigation={navigation} />
            <View>
                <Text style={styles.label}># Detail</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                    <SectionDetailChip
                        label='Student number:'
                        icon={require('../../assets/imgs/student_raising_hand.png')}
                        info={studentList.length > 0 ? studentList.length.toString() : '0'}
                        key={`studentNum`}
                    />

                    <SectionDetailChip
                        label='Class status:'
                        icon={require('../../assets/icons/status_icon.png')}
                        info={classInfo ? (classInfo.classStatus === 1 ? 'On-going' : 'Unactive') : ''}
                        infoTxtColor={classInfo ? (classInfo.classStatus === 1 ? 'green' : 'red') : ''}
                        key={`classStatus`}
                    />

                    <SectionDetailChip
                        label='Subject:'
                        icon={require('../../assets/icons/book_icon.png')}
                        info={classInfo ? classInfo.subject.subjectCode : ''}
                        key={`classSubject`}
                    />

                    <SectionDetailChip
                        label='Semester:'
                        icon={require('../../assets/icons/semester_icon.png')}
                        info={classInfo ? classInfo.semester.semesterCode : ''}
                        key={`classSemester`}
                    />
                </View>
            </View>

            <View style={[GLOBAL_STYLES.horizontalBetweenCenter, { marginTop: 20 }]}>
                <Text style={styles.label}># Attendance report</Text>
                {/* <TouchableOpacity
                    onPress={() => {
                        // ClassService.downloadReportExcel(classID, classCode)
                    }}
                >
                    <Text style={styles.linkTxt}>Download report</Text>
                </TouchableOpacity> */}
            </View>
            <View style={[GLOBAL_STYLES.card, styles.attendanceChartCtn]}>
                <View style={{ height: 115, width: '50%', position: 'relative' }}>
                    <PolarChart
                        containerStyle={{}}
                        data={attendanceChart}
                        colorKey={"color"}
                        valueKey={"value"}
                        labelKey={"label"}
                    >
                        <Pie.Chart
                            innerRadius={48}
                        >
                            {() => {
                                return (
                                    <>
                                        <Pie.Slice />
                                        <Pie.SliceAngularInset
                                            angularInset={{
                                                angularStrokeWidth: insetWidth,
                                                angularStrokeColor: insetColor,
                                            }}
                                        />
                                    </>
                                );
                            }}
                        </Pie.Chart>
                    </PolarChart>
                    <Text
                        style={{ position: 'absolute', left: '33%', top: '28%', textAlign: 'center', }}
                    >
                        <Text style={{ fontSize: 20, fontFamily: 'Lexend-Regular' }}>{classInfo ? classInfo.students?.length : '0'} {'\n'}</Text>
                        <Text>Students</Text>
                    </Text>
                </View>

                <View style={{ width: '50%' }}>
                    <View style={GLOBAL_STYLES.horizontalCenter}>
                        <View style={[styles.block, { backgroundColor: '#FFD21C' }]}></View>
                        <Text>Not Yet ({attendanceChart && attendanceChart[0] ? attendanceChart[0].value : '0'}%)</Text>
                    </View>
                    <View style={GLOBAL_STYLES.horizontalCenter}>
                        <View style={[styles.block, { backgroundColor: '#3ABE00' }]}></View>
                        <Text>Attended ({attendanceChart && attendanceChart[1] ? attendanceChart[1].value : '0'}%)</Text>
                    </View>
                    <View style={GLOBAL_STYLES.horizontalCenter}>
                        <View style={[styles.block, { backgroundColor: '#DC4437' }]}></View>
                        <Text>Absent ({attendanceChart && attendanceChart[2] ? attendanceChart[2].value : '0'}%)</Text>
                    </View>
                </View>
            </View>

            <View>
                <View style={styles.filterListCtn}>
                    <View style={styles.filterBtn}>
                        <TouchableOpacity
                            onPress={() => setSelectedView('student')}
                        >
                            <Text
                                style={[
                                    styles.filterBtnTxt,
                                    selectedView === 'student' && styles.onSelectedBtn
                                ]}>
                                Student List
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.filterBtn}>
                        <TouchableOpacity
                            onPress={() => setSelectedView('schedule')}
                        >
                            <Text
                                style={[
                                    styles.filterBtnTxt,
                                    selectedView === 'schedule' && styles.onSelectedBtn
                                ]}>
                                Schedules
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {
                    selectedView === 'student' && (
                        <View style={styles.studentListCtn}>
                            {
                                studentList.length > 0 ? (
                                    studentList.map((item, i) => (
                                        <StudentCard
                                            key={`student_${i}`}
                                            name={item.displayName}
                                            studentCode={item.studentCode}
                                            absentPercentage={19}
                                            avatar={item.avatar}
                                            email={item.email}
                                        />
                                    ))
                                ) : (<NoData text='There is no student in this class' />)
                            }
                        </View>
                    )
                }

                {
                    selectedView === 'schedule' && (
                        <View style={{ gap: 15, marginBottom: 35 }}>
                            {
                                scheduleList.length > 0 ? scheduleList.map((item, i) => (
                                    <ScheduleCard
                                        key={`schedule_${i}`}
                                        date={item.date}
                                        endTime={item.slot.endtime}
                                        startTime={item.slot.startTime}
                                        slotNumber={item.slot.slotNumber}
                                        classSize={classInfo ? classInfo.students?.length : '0'}
                                        studentAttended={undefined} //NOT FIX
                                        status={item.scheduleStatus} //1: notyet, 2: ongoing, 3: finished
                                        room={item.room ? item.room.roomName : (classInfo ? classInfo.room.roomName : '')}
                                    />
                                )) : (<NoData text='There is no any schedule in this class' />)
                            }
                        </View>
                    )
                }
            </View>
        </ScrollView>
    )
}

export default ClassInfo

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
        paddingBottom: 15,
        paddingHorizontal: 20,
        backgroundColor: '#FFF',
    },
    label: {
        fontSize: 18,
        color: FONT_COLORS.greyFontColor,
        fontFamily: 'Lexend-Regular',
    },
    detailSection: {
        gap: 5,
        width: '45%',
        marginTop: 10
    },
    attendanceChartCtn: {
        gap: 5,
        paddingVertical: 10,
        marginTop: 10,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    block: {
        width: 10,
        height: 10,
        marginRight: 4,
        borderWidth: 1,
        borderColor: '#A2A2A2'
    },
    filterListCtn: {
        marginVertical: 20,
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
    studentListCtn: {
        marginBottom: 20
    },
    linkTxt: {
        color: COLORS.skyBase,
        textAlign: 'right',
        textDecorationLine: 'underline'
    }
})