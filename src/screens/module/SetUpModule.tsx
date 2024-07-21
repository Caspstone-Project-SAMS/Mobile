import { PermissionsAndroid, StyleSheet, TouchableOpacity, View } from 'react-native'
import { ActivityIndicator, Modal, Portal, Provider, Text, TextInput } from 'react-native-paper'
import React, { useEffect, useState } from 'react'
import Entypo from 'react-native-vector-icons/Entypo';
import { COLORS } from '../../assets/styles/variables';
import { ScrollView } from 'react-native-gesture-handler';
import WifiManager, { WifiEntry } from "react-native-wifi-reborn";
import WifiItem from '../../components/wifi/WifiItem';
import { Toast } from 'react-native-toast-notifications';

type props = {
    setVisible: React.Dispatch<React.SetStateAction<boolean>>
}

const SetUpModule: React.FC<props> = ({ setVisible }) => {
    const [selectedWifi, setSelectedWifi] = useState<string>('aaaaa')
    const [onLoading, setOnLoading] = useState<boolean>(false);
    const [onClick, setOnClick] = useState<boolean>(false);
    const [wifiList, setWifiList] = useState<WifiEntry[]>([]);

    const [password, setPassword] = useState("");
    const [wifiPermission, setWifiPermission] = useState();

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

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
                    Toast.show('Wifi and location require on!', { type: 'warning', placement: 'top', duration: 1200 })
                })
            }

            getWifiOnPress();
        } else {
            // toast.show('App require wifi and location access permission to use this function', { type: 'danger', placement: 'top', duration: 2000 })
            console.log("Wifi denied");
        }
    }, [onClick, wifiPermission])

    return (
        <View style={styles.container}>
            <Text>Set Up Module</Text>
            <View style={styles.selectWifiCtn}>
                <TextInput
                    value={selectedWifi}
                    disabled
                    style={{ flex: 1 }}
                />
                <TouchableOpacity
                    onPress={() => setVisible(true)}
                >
                    <Entypo name='chevron-thin-down' size={20} />
                </TouchableOpacity>
            </View>

            {/* Modal hereeee---- */}
            {/* <Portal>
                    <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalCtn}>
                        <ScrollView style={{ height: '50%' }}>
                            <View>
                                <Text>WI-FI</Text>
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
                </Portal> */}
        </View>
    )
}

export default SetUpModule

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    selectWifiCtn: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.skyBase,
        paddingRight: 10
    },
    modalCtn: {
        height: '100%',
        padding: 20,
        width: '90%',
        borderRadius: 10,
        alignSelf: 'center',
        backgroundColor: 'red',
    },
    wifiListCtn: {
        gap: 20
    },
})