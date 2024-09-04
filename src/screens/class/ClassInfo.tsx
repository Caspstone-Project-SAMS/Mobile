import { Image, ImageSourcePropType, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Avatar, Card, IconButton, Text } from 'react-native-paper'
import Title from '../../components/Title'
import { COLORS, FONT_COLORS } from '../../assets/styles/variables'
import { GLOBAL_STYLES } from '../../assets/styles/styles'
import { CartesianChart, Line, Pie, PolarChart, useChartPressState } from "victory-native";
import { SharedValue } from 'react-native-reanimated'
import { Circle } from '@shopify/react-native-skia'
import StudentCard from './cards/StudentCard'
import { ClassModel, Student } from '../../models/Class'
import { ClassService } from '../../hooks/Class'


type SectionChip = {
    label: string,
    icon: ImageSourcePropType,
    info: string,
    infoTxtColor?: string,
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

const randomNumber = () => Math.floor(Math.random() * (50 - 25 + 1)) + 125;
function generateRandomColor(): string {
    // Generating a random number between 0 and 0xFFFFFF
    const randomColor = Math.floor(Math.random() * 0xffffff);
    // Converting the number to a hexadecimal string and padding with zeros
    return `#${randomColor.toString(16).padStart(6, "0")}`;
}

const DATA = (numberPoints = 5) =>
    Array.from({ length: numberPoints }, (_, index) => ({
        value: randomNumber(),
        color: index == 0 ? 'yellow' : index == 1 ? 'green' : 'red',
        label: `Label ${index + 1}`,
    }));

const ClassInfo = ({ route, navigation }) => {
    const { classData: { classCode, classID, classStatus, room, semester, subject } } = route.params;

    const [data, setData] = useState(DATA(3))
    const [insetWidth, setInsetWidth] = useState(4);
    const [insetColor, setInsetColor] = useState<string>("#fafafa");

    const [selectedView, setSelectedView] = useState<'student' | 'schedule'>('student');
    const [classInfo, setClassInfo] = useState<ClassModel>();
    const [studentList, setStudentList] = useState<Student[]>([]);

    useEffect(() => {
        const promise = ClassService.getClassByID(classID);
        promise.then(data => {
            setClassInfo(data);
            if (data.students) {
                setStudentList(data.students)
            }
        }).catch(err => {
            console.log("Err occured when loading class info", JSON.stringify(err));
        })
    }, [])

    useEffect(() => {
        console.log("Student list has change ", studentList);
    }, [studentList])

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
                <TouchableOpacity
                    onPress={() => {
                        // ClassService.downloadReportExcel(classID, classCode)
                    }}
                >
                    <Text style={styles.linkTxt}>Download report</Text>
                </TouchableOpacity>
            </View>
            <View style={[GLOBAL_STYLES.card, styles.attendanceChartCtn]}>
                <View style={{ height: 115, width: '50%', position: 'relative' }}>
                    <PolarChart
                        containerStyle={{}}
                        data={data}
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
                        <Text style={{ fontSize: 20, fontFamily: 'Lexend-Regular' }}>28 {'\n'}</Text>
                        <Text>Students</Text>
                    </Text>
                </View>

                <View style={{ width: '50%' }}>
                    <View style={GLOBAL_STYLES.horizontalCenter}>
                        <View style={[styles.block, { backgroundColor: 'yellow' }]}></View>
                        <Text>Not Yet (27%)</Text>
                    </View>
                    <View style={GLOBAL_STYLES.horizontalCenter}>
                        <View style={[styles.block, { backgroundColor: 'green' }]}></View>
                        <Text>Attended (72%)</Text>
                    </View>
                    <View style={GLOBAL_STYLES.horizontalCenter}>
                        <View style={[styles.block, { backgroundColor: 'red' }]}></View>
                        <Text>Absent (1%)</Text>
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

                <View style={styles.studentListCtn}>
                    {
                        studentList.length > 0 && (
                            studentList.map((item, i) => (
                                <StudentCard
                                    key={`student_${i}`}
                                    name={item.displayName}
                                    studentCode={item.studentCode}
                                    absentPercentage={20}
                                    avatar={item.avatar}
                                    email={item.email}
                                />
                            ))
                        )
                    }
                </View>
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

    },
    linkTxt: {
        color: COLORS.skyBase,
        textAlign: 'right',
        textDecorationLine: 'underline'
    }
})