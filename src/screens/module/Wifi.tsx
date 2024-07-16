import { PermissionsAndroid, StyleSheet, TouchableOpacity, View } from 'react-native'
import { ActivityIndicator, Button, Modal, Portal, Text, TextInput } from 'react-native-paper'
import React, { useEffect, useState } from 'react'
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, FONT_COLORS } from '../../assets/styles/variables';
import { GLOBAL_STYLES } from '../../assets/styles/styles';
import WifiManager, { WifiEntry } from "react-native-wifi-reborn";
import { useToast } from 'react-native-toast-notifications'
import InputSecureText from '../../components/input/InputSecureText';
import CustomBtn from '../../components/global/CustomBtn';


const getSignalStrength = (level: number) => {
    if (level >= -50) {
        return 'excellent';
    } else if (level >= -60) {
        return 'good';
    } else if (level >= -70) {
        return 'fair';
    } else {
        return 'weak';
    }
};
const isNetworkOpen = (capabilities: string): boolean => {
    return capabilities.includes('ESS') && !capabilities.includes('WPA') && !capabilities.includes('WEP');
};

const WifiItem: React.FC<WifiEntry> = ({ BSSID, SSID, frequency, level, capabilities }) => {
    let wifiIcon: string = 'wifi-lock'
    let wifiFree: boolean = isNetworkOpen(capabilities)

    const strength = getSignalStrength(level)

    switch (strength) {
        case 'excellent':
            wifiFree ? wifiIcon = 'wifi-strength-4-lock-open' : wifiIcon = 'wifi-strength-4-lock'
            break;
        case 'good':
            wifiFree ? wifiIcon = 'wifi-strength-3-lock-open' : wifiIcon = 'wifi-strength-3-lock'
            break;
        case 'fair':
            wifiFree ? wifiIcon = 'wifi-strength-2-lock-open' : wifiIcon = 'wifi-strength-2-lock'
            break;
        case 'weak':
            wifiFree ? wifiIcon = 'wifi-strength-1-lock-open' : wifiIcon = 'wifi-strength-1-lock'
            break;
        default:
            break;
    }
    return (
        <View style={styles.wifiItemCtn}>
            <MaterialComIcon
                name={wifiIcon}
                size={22} />
            <Text style={styles.wifiName}>{SSID}</Text>
        </View>
    )
}

const ModalConnect = () => {

}

const Wifi = () => {
    const [onClick, setOnClick] = useState<boolean>(false);
    const [wifiPermission, setWifiPermission] = useState();
    const [wifiList, setWifiList] = useState<WifiEntry[]>([]);
    const [onLoading, setOnLoading] = useState<boolean>(false);
    const [currentWifi, setCurrentWifi] = useState<string>('')
    const [currentModule, setCurrentModule] = useState<string>('')
    //Modal
    const [visible, setVisible] = React.useState(false);
    const [password, setPassword] = useState("");
    const [settingInfo, setSettingInfo] = useState<WifiEntry>();

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const toast = useToast()

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

    const handleConnectPassword = (ssid: string) => {
        if (password.length > 0) {
            try {
                WifiManager.connectToProtectedSSID(ssid, password, true, false)
            } catch (error) {
                console.log("error when connect password ", error);
            }
        }
    }

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
                        list.map(item => {
                            console.log('wifi item', item);
                        })
                    }, 1200)
                }).catch(err => {
                    setOnLoading(false);
                    toast.show('Wifi and location require on!', { type: 'warning', placement: 'top', duration: 1200 })
                })
            }

            getWifiOnPress();
        } else {
            // toast.show('App require wifi and location access permission to use this function', { type: 'danger', placement: 'top', duration: 2000 })
            console.log("Wifi denied");
        }
    }, [onClick, wifiPermission])

    return (
        <View style={styles.wifiCtn}>
            <View style={[GLOBAL_STYLES.horizontalBetween, styles.wifiTitle]}>
                <Text style={styles.titleTxt}>WI-FI List</Text>
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
                            key={`wifi_${i}`}
                            onPress={() => {
                                setSettingInfo(wifi);
                                setVisible(!visible)
                            }}
                        >
                            <WifiItem {...wifi} />
                        </TouchableOpacity>
                    ))
                }
            </View>
            <Portal>
                <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalCtn}>
                    <View>
                        <Text style={{ marginBottom: 15, fontSize: 16 }}>
                            Connecting to WI-FI: {'\n'}
                            <Text style={styles.importantTxt}>{settingInfo?.SSID}</Text>
                        </Text>
                        <InputSecureText label='Password' placeholder='Password' key={'pass'} setSecureText={setPassword} />
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            if (settingInfo) {
                                handleConnectPassword(settingInfo.SSID)
                            }
                        }}
                    >
                        <CustomBtn text='Connect' customStyle={{ backgroundColor: COLORS.skyBlue }} />
                    </TouchableOpacity>
                </Modal>
            </Portal>
        </View>
    )
}

export default Wifi

const styles = StyleSheet.create({
    wifiCtn: {},
    wifiTitle: {
        marginBottom: 20
    },
    titleTxt: {
        fontFamily: 'Lexend-Regular',
        fontSize: 15,
        color: FONT_COLORS.blurFontColor
    },
    wifiListCtn: {
        gap: 20
    },
    wifiItemCtn: {
        flexDirection: 'row',
        gap: 17,
        paddingVertical: 5
    },
    wifiName: {
        fontSize: 17
    },
    //Modal
    modalCtn: {
        padding: 20,
        width: '90%',
        borderRadius: 10,
        alignSelf: 'center',
        backgroundColor: 'white',
    },
    importantTxt: {
        fontSize: 16,
        fontFamily: 'Lexend-Medium'
    }
})