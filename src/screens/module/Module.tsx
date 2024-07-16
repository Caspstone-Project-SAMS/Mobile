import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text } from 'react-native-paper'
import React, { useEffect, useState } from 'react'
import { GLOBAL_STYLES } from '../../assets/styles/styles'
import { COLORS } from '../../assets/styles/variables'
import Wifi from './Wifi'
import WifiManager from 'react-native-wifi-reborn'

const Module = () => {
    const [selectedView, setSelectedView] = useState<'wifi' | 'module'>('wifi')
    const [currentWifi, setCurrentWifi] = useState<string>('')

    const getCurrentWifiSSID = async () => {
        const ssid = await WifiManager.getCurrentWifiSSID()
        setCurrentWifi(ssid)
    }
    useEffect(() => {
        getCurrentWifiSSID();
    }, [])

    return (
        <View style={styles.container}>
            <Text style={GLOBAL_STYLES.titleLabel}>Device Management</Text>

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
                            onPress={() => setSelectedView('module')}
                        >
                            <Text style={[styles.filterBtnTxt,
                            selectedView === 'module' && styles.onSelectedBtn
                            ]}>Set-up Module</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <Wifi />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 15,
        paddingHorizontal: 20,
        backgroundColor: '#FFF'
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
})

export default Module