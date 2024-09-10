import React, { useEffect, useState } from 'react'
import { Modal, Portal, Text } from 'react-native-paper'
import { Image, ScrollView, StyleSheet, TextStyle, TouchableOpacity, View } from 'react-native'
import { COLORS, FONT_COLORS } from '../../assets/styles/variables';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/Store';
import { ModuleService } from '../../hooks/Module';
import { GLOBAL_STYLES } from '../../assets/styles/styles';
import { Module } from '../../models/Module/Module';
import CustomBtn from '../global/CustomBtn';
import { Toast } from 'react-native-toast-notifications';
import axios from 'axios';

type props = {
    txtStyle?: TextStyle,
    scheduleID: number,
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

const PrepareModule: React.FC<props> = ({ txtStyle, scheduleID }) => {
    const [visible, setVisible] = React.useState(false);
    const userDetail = useSelector((state: RootState) => state.auth.userDetail?.result);
    const userToken = useSelector((state: RootState) => state.auth.userDetail?.token)
    const [moduleList, setModuleList] = useState<Module[]>([]);
    const [selectedModule, setSelectedModule] = useState<Module>(initialModule);
    // 2: Cancel session, 3: Prepare data attendance, 6: Connect module
    const [sessionID, setSessionID] = useState<number>(0);

    const showModal = () => setVisible(true);
    const hideModal = () => {
        if (selectedModule.moduleID !== 0) {
            handleCancelSession()
        }
        resetState();
        setVisible(false)
    };

    const containerStyle = { backgroundColor: 'white' };

    const resetState = () => {
        setSessionID(0);
        setSelectedModule(initialModule);
        // setModuleList([])
    }

    const getModuleList = () => {
        if (userDetail && userDetail.employeeID) {
            const promise = ModuleService.getModuleByEmployeeID(userDetail.employeeID);
            promise.then(data => {
                setModuleList(data.result)
                // console.log("This is user modules ", JSON.stringify(data));
            }).catch(err => {
                console.log("Error when get modules ", err);
            })
        }
    }

    const handleConnect = () => {
        if (sessionID === 0 && userToken) {
            const promise = ModuleService.connectModule(selectedModule.moduleID, userToken);
            promise.then(data => {
                Toast.show("Module Connected", { type: 'success', placement: 'top', duration: 1200 })
                setSessionID(data.result.sessionId);
            }).catch(err => {
                if (axios.isAxiosError(err) && err.response) {
                    console.log("This is response ", err.response.data);
                    Toast.show('Module not online!!', { type: 'danger', placement: 'top' })
                    resetState()
                }
            })
        }
    }

    const handleCancelSession = () => {
        if (sessionID === 1 && userToken) {
            const promise = ModuleService.cancelSessionModule(selectedModule.moduleID, sessionID, userToken);
            promise.then(data => {
                Toast.show("Module Disconnected", { type: 'warning', placement: 'top', duration: 800 })
            }).catch(err => {
                console.log("Error when cancel module", JSON.stringify(err));
            }).finally(() => resetState())
        }
    }

    const handlePrepare = () => {
        if (selectedModule.moduleID !== 0 && sessionID !== 0 && userToken) {
            const promise = ModuleService.prepareDataModule(selectedModule.moduleID, sessionID, userToken, scheduleID)
            promise.then(data => {
                Toast.show("Prepare data succeed", { type: 'success', placement: 'top' })
                console.log('Prepare ok ', data);
                hideModal()
            }).catch(err => {
                console.log("Error prepare data ", JSON.stringify(err));
            })
        } else {
            Toast.show('Please select a module before continue', { placement: 'top' })
        }
    }

    useEffect(() => {
        getModuleList();
    }, []);

    useEffect(() => {
        if (selectedModule.moduleID !== 0) {
            handleConnect();
        }
    }, [selectedModule])

    useEffect(() => {
        console.log("SessionID changed ", sessionID);
    }, [sessionID])

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

    return (
        <View>
            <TouchableOpacity
                onPress={() => showModal()}
            >
                <Text style={txtStyle ? txtStyle : { color: FONT_COLORS.blueFontColor }}>
                    Prepare Data
                </Text>
            </TouchableOpacity>
            <Portal>
                <Modal
                    visible={visible}
                    onDismiss={hideModal}
                    contentContainerStyle={containerStyle}
                >
                    <View style={styles.modal}>
                        <Text style={styles.title}>Your {moduleList.length > 1 ? ('modules') : ('module')}: </Text>
                        <ScrollView>
                            <View style={styles.moduleList}>
                                {
                                    moduleList.length > 0 && (
                                        moduleList.map((item, i) => (
                                            <TouchableOpacity
                                                key={`module_${i}`}
                                                onPress={() => {
                                                    if (selectedModule.moduleID === item.moduleID) {
                                                        handleCancelSession()
                                                    } else {
                                                        setSelectedModule(item)
                                                    }
                                                }}
                                            >
                                                <ModuleItem data={item} />
                                            </TouchableOpacity>
                                        ))
                                    )
                                }
                            </View>
                            <View style={{ width: '100%', marginTop: 15 }}>
                                <TouchableOpacity
                                    onPress={() => handlePrepare()}
                                >
                                    <CustomBtn text='Prepare Data' />
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </Modal>
            </Portal>
        </View>
    )
}

export default PrepareModule;

const styles = StyleSheet.create({
    modal: {
        height: '70%',
        paddingVertical: 10,
        paddingHorizontal: 20,
        justifyContent: 'center',
        // alignItems: 'center',
    },
    title: {
        fontSize: 16,
        fontFamily: 'Lexend-Regular',
        color: FONT_COLORS.blueFontColor,
    },
    moduleList: {
        flex: 1,
        gap: 15,
        width: '100%',
        marginTop: 10,
    },
    moduleItem: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingVertical: 8
    },
    badgeDot: {
        width: 6,
        height: 6,
        borderRadius: 5,
        alignSelf: 'center'
    },
})