import { PermissionsAndroid, StyleSheet, TouchableOpacity, View } from 'react-native'
import { ActivityIndicator, HelperText, Modal, Portal, Provider, Text, TextInput } from 'react-native-paper'
import React, { useEffect, useState } from 'react'
import Entypo from 'react-native-vector-icons/Entypo';
import { COLORS } from '../../assets/styles/variables';
import { ScrollView } from 'react-native-gesture-handler';
import WifiManager, { WifiEntry } from "react-native-wifi-reborn";
import WifiItem from '../../components/wifi/WifiItem';
import { Toast } from 'react-native-toast-notifications';
import CustomBtn from '../../components/global/CustomBtn';
import { GLOBAL_STYLES } from '../../assets/styles/styles';
import Wifi from './Wifi';
import { ModuleService } from '../../hooks/Module';
import Title from '../../components/Title';

//@ts-ignore
const SetUpModule: React.FC = ({ navigation }) => {
    const [selectedView, setSelectedView] = useState<'wifi' | 'module'>('wifi')
    const [currentWifi, setCurrentWifi] = useState<string>('')
    const [isConnectedModule, setIsConnectedModule] = useState<boolean>(false)

    //Setup module
    const [visible, setVisible] = React.useState(false);
    const [selectedWifi, setSelectedWifi] = useState<string>('')
    const [onLoading, setOnLoading] = useState<boolean>(false);
    const [onFetchLoading, setOnFetchLoading] = useState<boolean>(false);
    const [onClick, setOnClick] = useState<boolean>(false);
    const [wifiList, setWifiList] = useState<WifiEntry[]>([]);
    const [passwordForModule, setPasswordForModule] = useState<string>('');
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const toggleSecureEntry = () => {
        setSecureTextEntry((prev) => !prev);
    };
    const hideModal = () => setVisible(false);

    const [wifiPermission, setWifiPermission] = useState();

    //Get wifi
    const grantedPermission = async () => {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: 'Location permission is required for WiFi connections',
                message:
                    'SAMS application needs location permission as this is required  ' +
                    'to scan for wifi networks.',
                buttonNegative: 'DENY',
                buttonPositive: 'ALLOW',
            },
        )
        return granted;
    }
    const hasErrors = () => {
        if (passwordForModule.length === 0) return false
        return !(passwordForModule.length >= 8);
    };

    useEffect(() => {
        const permission = grantedPermission();
        permission.then(info => setWifiPermission(info)).catch(err => "Got err here bro")
    }, [])

    useEffect(() => {
        if (wifiPermission === PermissionsAndroid.RESULTS.GRANTED) {
            const getWifiOnPress = async () => {
                const wifiListPromise = WifiManager.loadWifiList();
                setOnLoading(true);
                wifiListPromise.then(list => {
                    setTimeout(() => {
                        setOnLoading(false);
                        setWifiList(list)
                        // list.map(item => {
                        //     console.log('wifi item', item);
                        // })
                    }, 1200)
                }).catch(err => {
                    setOnLoading(false);
                    Toast.show('Wifi and location require on!', { type: 'warning', placement: 'top', duration: 1200 })
                })
            }

            getWifiOnPress();
        } else {
            // toast.show('App require wifi and location access permission to use this function', { type: 'danger', placement: 'top', duration: 2000 })
            console.log("Wifi denied");
        }
    }, [onClick, wifiPermission])


    const getCurrentWifiSSID = async () => {
        const ssid = await WifiManager.getCurrentWifiSSID()
        setCurrentWifi(ssid)
    }
    getCurrentWifiSSID();

    const handleSetUpModule = () => {
        if (selectedWifi === '' || passwordForModule.length < 8) {
            Toast.show(
                'Please select wifi and enter password!',
                { type: "warning", placement: 'top' }
            )
        } else {
            const promise = ModuleService.setUpWifi(selectedWifi, passwordForModule);
            setOnFetchLoading(true);
            // Toast.show(`Setup '${selectedWifi}' - '${passwordForModule}'`, { type: 'success', placement: 'top', duration: 10000 })
            // console.log(`   On sending this '${selectedWifi}' - '${passwordForModule}' to module`);
            promise.then(data => {
                setOnFetchLoading(false);
                Toast.show(`Setup ${selectedWifi} for module successfully, please check on module.`, { type: 'success', placement: 'top', duration: 5200 })
                setSelectedView('wifi');
            }).catch(err => {
                setOnFetchLoading(false);
                console.log("error at setup module ", err);
                Toast.show('Unknow errors occured, please try again.', { type: 'danger', placement: 'top' })
            })
        }
    }

    return (
        <ScrollView style={styles.container}>
            <Title title='Set Up Module Wifi' navigation={navigation} />
            {/* <Text style={GLOBAL_STYLES.titleLabel}>Module Management</Text> */}

            <View style={styles.titleContainer}>
                <Text>Wifi Connected: {currentWifi}</Text>
                <Text>Module Connected: No</Text>
            </View>
            <View
                style={[GLOBAL_STYLES.horizontalDivider, { marginVertical: 10 }]}
            ></View>
            <View style={{ alignSelf: 'flex-end' }}>
                <View style={styles.filterListCtn}>
                    <View style={styles.filterBtn}>
                        <TouchableOpacity
                            onPress={() => setSelectedView('wifi')}
                        >
                            <Text style={[styles.filterBtnTxt,
                            selectedView === 'wifi' && styles.onSelectedBtn
                            ]}>Wi-Fi</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.filterBtn}>
                        <TouchableOpacity
                            onPress={() => {
                                // if(isConnectedModule){
                                setSelectedView('module')
                                // } else{
                                //     Toast.show('Please connect to module first')
                                // }
                            }}
                        >
                            <Text style={[styles.filterBtnTxt,
                            selectedView === 'module' && styles.onSelectedBtn
                            ]}>Set-up Module</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View style={{ marginBottom: 40, flex: 1 }}>
                {
                    selectedView === 'wifi' ? (
                        <Wifi />
                    ) : (
                        <>
                            <View style={styles.setUpModuleSection}>
                                <View style={GLOBAL_STYLES.horizontalBetweenCenter}>
                                    <Text onPress={() => { console.log(`'${selectedWifi}' - '${passwordForModule}'`); }}>Set Up Module</Text>
                                    {
                                        onFetchLoading && (
                                            <ActivityIndicator animating={true} color={COLORS.greenSystem} />
                                        )
                                    }
                                </View>
                                <View style={styles.selectWifiCtn}>
                                    <TextInput
                                        disabled
                                        value={selectedWifi}
                                        style={{ flex: 1 }}
                                        placeholder='Select wifi for module'
                                    />
                                    <TouchableOpacity
                                        onPress={() => setVisible(true)}
                                    >
                                        <Entypo name='chevron-thin-down' size={20} />
                                    </TouchableOpacity>
                                </View>

                                <View>
                                    <TextInput
                                        style={{
                                            flex: 1,
                                            backgroundColor: '#FFF',
                                        }}
                                        mode="outlined"
                                        placeholder='Enter wifi password'
                                        onChangeText={pass => setPasswordForModule(pass)}
                                        secureTextEntry={secureTextEntry}
                                        outlineStyle={{
                                            borderRadius: 0,
                                            borderTopWidth: 0,
                                            borderLeftWidth: 0,
                                            borderRightWidth: 0,
                                        }}
                                        right={
                                            <TextInput.Icon
                                                icon={secureTextEntry ? 'eye-off-outline' : 'eye-outline'}
                                                color={'black'}
                                                onPress={toggleSecureEntry}
                                            />
                                        }
                                    />
                                    <HelperText type="error" visible={hasErrors()}>
                                        Password must contains at least 8 characters
                                    </HelperText>
                                </View>
                                <TouchableOpacity
                                    disabled={onFetchLoading}
                                    style={{ marginTop: 15 }}
                                    onPress={() => handleSetUpModule()}
                                >
                                    <CustomBtn text='Save'
                                        customStyle={
                                            onFetchLoading
                                                ? { backgroundColor: COLORS.grayLight }
                                                : { backgroundColor: COLORS.skyBlue }
                                        }
                                    />
                                </TouchableOpacity>
                            </View>
                        </>
                    )
                }
                <Portal>
                    <Modal visible={visible} onDismiss={hideModal}
                        contentContainerStyle={{
                            backgroundColor: 'white', padding: 20
                        }}
                    >
                        <ScrollView style={{ height: '50%' }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
                                <Text>WI-FI nearby</Text>
                                {onLoading ? (
                                    <ActivityIndicator animating={true} color={COLORS.greenSystem} />
                                ) : (
                                    <TouchableOpacity
                                        onPress={() => {
                                            setOnClick(!onClick)
                                        }}
                                    >
                                        <Text style={{ color: COLORS.greenSystem }}>Refresh</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                            <View style={styles.wifiListCtn}>
                                {
                                    wifiList.map((wifi, i) => (
                                        <TouchableOpacity
                                            key={`wifi_modal_${i}`}
                                            onPress={() => {
                                                console.log("selecting ", wifi.SSID);
                                                setSelectedWifi(wifi.SSID);
                                                setVisible(!visible);
                                            }}
                                        >
                                            <WifiItem {...wifi} />
                                        </TouchableOpacity>
                                    ))
                                }
                            </View>
                        </ScrollView>
                    </Modal>
                </Portal>
            </View>
        </ScrollView>
    )
}

export default SetUpModule

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 15,
        paddingHorizontal: 20,
        backgroundColor: '#FFF',
    },
    titleContainer: {
        marginTop: 12,
        marginBottom: 8,
        alignItems: 'flex-end'
    },
    filterListCtn: {
        marginBottom: 20,
        borderRadius: 10,
        flexDirection: 'row',
        backgroundColor: '#F4F4F4',
        alignSelf: 'flex-start',
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

    //Setup module section
    setUpModuleSection: {
        flex: 1,
    },
    customInput: {
        flex: 1,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderRadius: 0
    },

    //modal

    selectWifiCtn: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.skyBase,
        paddingRight: 10
    },
    wifiListCtn: {
        gap: 20
    },
    //Old things--------------------------------------------
    // container: {
    //     flex: 1
    // },
    // selectWifiCtn: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     marginVertical: 15,
    //     borderBottomWidth: 1,
    //     borderBottomColor: COLORS.skyBase,
    //     paddingRight: 10
    // },
    // modalCtn: {
    //     height: '100%',
    //     padding: 20,
    //     width: '90%',
    //     borderRadius: 10,
    //     alignSelf: 'center',
    //     backgroundColor: 'red',
    // },
    // wifiListCtn: {
    //     gap: 20
    // },
})