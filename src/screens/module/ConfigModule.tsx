import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { HelperText, Switch, Text, TextInput } from 'react-native-paper'
import Title from '../../components/Title'
import { COLORS, FONT_COLORS } from '../../assets/styles/variables'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/Store'
import { ModuleService } from '../../hooks/Module'
import { Module } from '../../models/Module/Module'
import { GLOBAL_STYLES } from '../../assets/styles/styles'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment'
import Octicons from 'react-native-vector-icons/Octicons'
import CustomBtn from '../../components/global/CustomBtn'
import { Toast } from 'react-native-toast-notifications'
import { HelperService } from '../../hooks/helpers/HelperFunc'

type ModuleConfig = {
    preparedTime: string,
    attendanceDurationMinutes: number, // setting time for module to scan fingerprint since class start
    connectionLifeTimeSeconds: number, // setting for holding connection after connect
    connectionSoundDurationMs: number, // Settings sound duration
    attendanceSoundDurationMs: number,
}

const initialModule = {
    attendanceDurationMinutes: 0,
    attendanceSound: false,
    attendanceSoundDurationMs: 0,
    autoPrepare: false,
    connectionLifeTimeSeconds: 0,
    connectionSound: false,
    connectionSoundDurationMs: 0,
    connectionStatus: 0,
    employee: [],
    mode: 0,
    moduleActivities: [],
    moduleID: 0,
    preparedTime: '',
    status: 0,
}
const initialConfig = {
    preparedTime: '00:00:00',
    attendanceDurationMinutes: 0,
    connectionLifeTimeSeconds: 0,
    connectionSoundDurationMs: 0,
    attendanceSoundDurationMs: 0,
}

//@ts-ignore
const ConfigModule = ({ navigation }) => {
    const userDetail = useSelector((state: RootState) => state.auth.userDetail?.result);
    const [moduleList, setModuleList] = useState<Module[]>([]);
    const [selectedModule, setSelectedModule] = useState<Module>(initialModule);

    // Config data
    const [configData, setConfigData] = useState<ModuleConfig>(initialConfig);
    const [isAutoPrepare, setIsAutoPrepare] = useState<boolean>(false);
    const [isAttendanceSound, setIsAttendanceSound] = useState<boolean>(false);
    const [isConnectionSound, setIsConnectionSound] = useState<boolean>(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    //logs helpertext
    const [isErrAttendance, setIsErrAttendance] = useState<boolean>(false);
    const [isErrConnect, setIsErrConnect] = useState<boolean>(false);
    const [isErrActive, setIsErrActive] = useState<boolean>(false);
    const [isErrConnectLifeTime, setIsErrConnectLifeTime] = useState<boolean>(false);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        console.log("A date has been picked: ", moment(date).format('HH:mm:ss'));
        const fmtTime = moment(date).format('HH:mm:ss')
        setConfigData(prev => ({ ...prev, preparedTime: fmtTime }))
        hideDatePicker();
    };

    const getModuleList = () => {
        if (userDetail && userDetail.employeeID) {
            const promise = ModuleService.getModuleByEmployeeID(userDetail.employeeID);
            promise.then(data => {
                setModuleList(data.result)
                console.log("This is user modules ", JSON.stringify(data));
            }).catch(err => {
                console.log("Error when get modules ", err);
            })
        }
    }

    const onSaveConfig = () => {
        if (selectedModule.moduleID !== 0) {
            let isValid = true;
            switch (configData.attendanceDurationMinutes < 15 || configData.attendanceDurationMinutes > 135) {
                case false:
                    isValid = false
                    break;
                default:
                    break;
            }
        } else {
            Toast.show('Please select an module before saving!', { type: 'normal', placement: 'top' })
        }
    }

    useEffect(() => {
        getModuleList();
    }, [])

    useEffect(() => {
        if (selectedModule) {
            setConfigData({
                attendanceDurationMinutes: selectedModule.attendanceDurationMinutes,
                attendanceSoundDurationMs: selectedModule.attendanceSoundDurationMs,
                connectionLifeTimeSeconds: selectedModule.connectionLifeTimeSeconds,
                connectionSoundDurationMs: selectedModule.connectionSoundDurationMs,
                preparedTime: selectedModule.preparedTime
            })
            setIsAutoPrepare(selectedModule.autoPrepare);
            setIsAttendanceSound(selectedModule.attendanceSound);
            setIsConnectionSound(selectedModule.connectionSound);
        }
    }, [selectedModule])

    const ModuleItem: React.FC<{ data: Module }> = ({ data: { moduleID, mode, connectionStatus } }) => (
        <View style={[styles.moduleItem,
        GLOBAL_STYLES.card,
        selectedModule.moduleID === moduleID ? { borderColor: 'green', borderWidth: 2 } : { borderColor: COLORS.borderColor }
        ]}>
            <Image
                style={{ width: 60, height: 60 }}
                source={require('../../assets/imgs/module_rm_bg.png')}
            />
            <View>
                <Text style={{ fontFamily: 'Lexend-Regular' }}>Module {moduleID}</Text>
                <Text>Module mode: {mode === 1 ? 'Register' : 'Attendance'}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={[styles.badgeDot, connectionStatus === 1 ? { backgroundColor: 'green' } : { backgroundColor: 'red' }]}></View>
                    <Text>{' '}{connectionStatus === 1 ? 'Online' : 'Offline'}</Text>
                </View>
            </View>
        </View>
    )
    const hasConnectionErrors = () => {
        const durationMs = configData.connectionSoundDurationMs;
        if (durationMs < 100 || durationMs > 5000 || !HelperService.isNumber(durationMs)) return false
        return true;
    };

    // useEffect(() => {
    //     if (configData.connectionSoundDurationMs !== 0) {
    //         console.log("On change ", configData);
    //         setIsErrConnect(!hasConnectionErrors());
    //     }
    // }, [configData, configData.connectionSoundDurationMs])

    return (
        <ScrollView style={styles.container}>
            <Title title='Config Module' navigation={navigation} />
            <View style={styles.moduleList}>
                <Text style={styles.title}>Your {moduleList.length > 1 ? ('modules') : ('module')}: </Text>
                {
                    moduleList.length > 0 && (
                        moduleList.map((item, i) => (
                            <TouchableOpacity
                                key={`module_${i}`}
                                onPress={() => setSelectedModule(item)}
                            >
                                <ModuleItem data={item} />
                            </TouchableOpacity>
                        ))
                    )
                }
            </View>
            <View style={styles.body}>
                {/* Auto prepare data */}
                <View style={styles.configSection}>
                    <View style={styles.sectionTitleCtn}>
                        <Text style={styles.title}>
                            Auto Prepare Data
                        </Text>
                        <Switch
                            color={isAutoPrepare ? '#0087fe' : '#94A3B8'}
                            trackColor={{ false: '#94A3B8', true: COLORS.skyUltLight }}
                            value={isAutoPrepare}
                            onValueChange={() => {
                                setIsAutoPrepare(!isAutoPrepare);
                            }}
                        />
                    </View>
                    <View>
                        <TouchableOpacity onPress={() => showDatePicker()}>
                            <Text style={[GLOBAL_STYLES.card, styles.infoTxt]}>
                                Time: {configData.preparedTime.slice(0, 5)}
                            </Text>
                        </TouchableOpacity>
                        <Text style={styles.desTxt}>
                            Prepare fingerprint data for the next day when device online and on time
                        </Text>
                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode="time"
                            onConfirm={handleConfirm}
                            onCancel={hideDatePicker}
                        />
                    </View>
                </View>
                {/* Sounds */}
                <View style={styles.configSection}>
                    <View style={styles.sectionTitleCtn}>
                        <Text style={styles.title}>
                            Module Connection Sound
                        </Text>
                        <Switch
                            color={isConnectionSound ? '#0087fe' : '#94A3B8'}
                            trackColor={{ false: '#94A3B8', true: COLORS.skyUltLight }}
                            value={isConnectionSound}
                            onValueChange={() => {
                                setIsConnectionSound(!isConnectionSound);
                            }}
                        />
                    </View>
                    <View>
                        <View>
                            <Text style={[styles.label]}>
                                <Octicons name='dot-fill' /> Sound Duration (millisecond):
                            </Text>
                            <TextInput
                                style={{
                                    backgroundColor: '#FFF',
                                }}
                                mode="outlined"
                                keyboardType="numeric"
                                value={configData.connectionSoundDurationMs.toString()}
                                placeholder={configData.connectionSoundDurationMs.toString()}
                                onChangeText={(val: number) => {
                                    if (!HelperService.isNumber(val)) {
                                        console.log("Error occured", configData.connectionSoundDurationMs);
                                    }
                                    setConfigData(prev => ({ ...prev, connectionSoundDurationMs: val }));
                                }}
                                outlineStyle={{
                                    borderRadius: 0,
                                    borderTopWidth: 0,
                                    borderLeftWidth: 0,
                                    borderRightWidth: 0,
                                }}
                            />
                        </View>
                        {
                            // isErrConnect && (
                            //     <HelperText type="error" visible={isErrConnect}>
                            //         Duration must at least 100 and not exceed 5000 and not contain special chars!
                            //     </HelperText>
                            // )
                        }
                        <Text style={styles.desTxt}>
                            Adjust beeping sounds duration when connected.
                        </Text>
                    </View>
                </View>

                <View style={styles.configSection}>
                    <View style={styles.sectionTitleCtn}>
                        <Text style={styles.title}>
                            Taken Attendance Sound
                        </Text>
                        <Switch
                            color={isAttendanceSound ? '#0087fe' : '#94A3B8'}
                            trackColor={{ false: '#94A3B8', true: COLORS.skyUltLight }}
                            value={isAttendanceSound}
                            onValueChange={() => {
                                setIsAttendanceSound(!isAttendanceSound);
                            }}
                        />
                    </View>
                    <View>
                        <View>
                            <Text style={[styles.label]}>
                                <Octicons name='dot-fill' /> Sound Duration (millisecond):
                            </Text>
                            <TextInput
                                style={{
                                    backgroundColor: '#FFF',
                                }}
                                mode="outlined"
                                keyboardType="numeric"
                                placeholder={configData.attendanceSoundDurationMs.toString()}
                                onChangeText={val => setConfigData(prev => ({ ...prev }))}
                                outlineStyle={{
                                    borderRadius: 0,
                                    borderTopWidth: 0,
                                    borderLeftWidth: 0,
                                    borderRightWidth: 0,
                                }}
                            />
                        </View>
                        {/* Chua co func */}
                        {
                            // isErrAttendance && (
                            //     <HelperText type="error" visible={isErrAttendance}>
                            //         Duration must at least 100 and not exceed 5000 and not contain special chars!
                            //     </HelperText>
                            // )
                        }
                        <Text style={styles.desTxt}>
                            Adjust beeping sounds duration when user scan finger successfully.
                        </Text>
                    </View>
                    {/* Setup about attendance */}
                    <View style={styles.configSection}>
                        <View style={styles.sectionTitleCtn}>
                            <Text style={styles.title}>
                                Check Attendance Duration
                            </Text>
                        </View>
                        <View>
                            <View>
                                <Text style={[styles.label]}>
                                    <Octicons name='dot-fill' /> Duration Time (minutes):
                                </Text>
                                <TextInput
                                    style={{
                                        backgroundColor: '#FFF',
                                    }}
                                    mode="outlined"
                                    keyboardType="numeric"
                                    placeholder={configData.attendanceDurationMinutes.toString()}
                                    onChangeText={(val: number) => {
                                        setConfigData(prev => ({ ...prev, attendanceDurationMinutes: val }))
                                    }}
                                    outlineStyle={{
                                        borderRadius: 0,
                                        borderTopWidth: 0,
                                        borderLeftWidth: 0,
                                        borderRightWidth: 0,
                                    }}
                                />
                            </View>
                            <Text style={styles.desTxt}>
                                Adjust time for module active scanning fingerprint since class started.
                            </Text>
                        </View>
                    </View>
                    <View style={styles.configSection}>
                        <View style={styles.sectionTitleCtn}>
                            <Text style={styles.title}>
                                Module Connection Life Time
                            </Text>
                        </View>
                        <View>
                            <View>
                                <Text style={[styles.label]}>
                                    <Octicons name='dot-fill' /> Duration Time (second):
                                </Text>
                                <TextInput
                                    style={{
                                        backgroundColor: '#FFF',
                                    }}
                                    mode="outlined"
                                    keyboardType="numeric"
                                    placeholder={configData.connectionLifeTimeSeconds.toString()}
                                    onChangeText={(val: number) => {
                                        setConfigData(prev => ({ ...prev, connectionLifeTimeSeconds: val }))
                                    }}
                                    outlineStyle={{
                                        borderRadius: 0,
                                        borderTopWidth: 0,
                                        borderLeftWidth: 0,
                                        borderRightWidth: 0,
                                    }}
                                />
                            </View>
                            {
                                isErrConnectLifeTime && (
                                    <HelperText type="error" visible={isErrConnectLifeTime}>
                                        Duration must at least 100 and not exceed 5000 and not contain special chars!
                                    </HelperText>
                                )
                            }
                            <Text style={styles.desTxt}>
                                Adjust time for module staying connected with server.
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={{ marginTop: 16 }}>
                    <TouchableOpacity
                        onPress={() => onSaveConfig()}
                    >
                        <CustomBtn text='Save Config' />
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}

export default ConfigModule

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 5,
        paddingBottom: 10,
        paddingHorizontal: 20,
        backgroundColor: '#FFF',
    },
    moduleList: {
        gap: 15
    },
    moduleItem: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingVertical: 8
    },
    body: {
        paddingBottom: 60
    },
    configSection: {
        gap: 6
    },
    sectionTitleCtn: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 14
    },
    title: {
        fontSize: 16,
        fontFamily: 'Lexend-Regular',
        color: FONT_COLORS.blueFontColor,
    },
    badgeDot: {
        width: 6,
        height: 6,
        borderRadius: 5,
        alignSelf: 'center'
    },
    infoTxt: {
        alignSelf: 'flex-start',
        padding: 10,
        fontSize: 16
    },
    label: {
        fontSize: 14,
        fontFamily: 'Lexend-Regular',
        color: '#000'
    },
    desTxt: {
        color: FONT_COLORS.blurFontColor,
        marginTop: 4
    }
})