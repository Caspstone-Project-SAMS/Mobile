import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Switch, Text } from 'react-native-paper'
import Title from '../../components/Title'
import { COLORS, FONT_COLORS } from '../../assets/styles/variables'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/Store'
import { ModuleService } from '../../hooks/Module'
import { Module } from '../../models/Module/Module'
import { GLOBAL_STYLES } from '../../assets/styles/styles'
import DatePicker from 'react-native-datepicker'

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

//@ts-ignore
const ConfigModule = ({ navigation }) => {
    const userDetail = useSelector((state: RootState) => state.auth.userDetail?.result);
    const [moduleList, setModuleList] = useState<Module[]>([]);
    const [selectedModule, setSelectedModule] = useState<Module>(initialModule);

    // Config data
    const [configData, setConfigData] = useState()
    const [isAutoPrepare, setIsAutoPrepare] = useState<boolean>(false);
    const [isAttendanceSound, setIsAttendanceSound] = useState<boolean>(false);
    const [isConnectionSound, setIsConnectionSound] = useState<boolean>(false);

    useEffect(() => {
        if (userDetail && userDetail.employeeID) {
            const promise = ModuleService.getModuleByEmployeeID(userDetail.employeeID);
            promise.then(data => {
                setModuleList(data.result)
                console.log("This is user modules ", JSON.stringify(data));
            }).catch(err => {
                console.log("Error when get modules ", err);
            })
        }
    }, [])

    const ModuleItem: React.FC<{ data: Module }> = ({ data: { moduleID, mode, connectionStatus } }) => (
        <View style={[styles.moduleItem,
        GLOBAL_STYLES.card,
        selectedModule.moduleID === moduleID ? { borderColor: 'green' } : { borderColor: COLORS.borderColor }
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


    const [date, setDate] = useState(new Date())
    const [open, setOpen] = useState(false)
    return (
        <View style={styles.container}>
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
                <View style={styles.configSection}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.title}>Auto Prepare Data</Text>
                        <Switch
                            color={isAutoPrepare ? '#0087fe' : '#94A3B8'}
                            trackColor={{ false: '#94A3B8' }}
                            value={isAutoPrepare}
                            onValueChange={() => {
                                setIsAutoPrepare(!isAutoPrepare);
                            }}
                        />
                    </View>
                    <View>
                        <DatePicker
                            modal={true}
                            open={open}
                            date={date}
                            onConfirm={(date) => {
                                setOpen(false)
                                setDate(date)
                            }}
                            onCancel={() => {
                                setOpen(false)
                            }}
                        />
                    </View>
                </View>

            </View>
        </View>
    )
}

export default ConfigModule

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 15,
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

    },
    configSection: {

    },
    title: {
        fontSize: 16,
        fontFamily: 'Lexend-Regular',
        color: FONT_COLORS.blueFontColor,
        marginTop: 10,
        marginBottom: 6
    },
    badgeDot: {
        width: 6,
        height: 6,
        borderRadius: 5,
        alignSelf: 'center'
    }
})