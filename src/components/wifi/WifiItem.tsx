import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { WifiEntry } from "react-native-wifi-reborn";

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

const styles = StyleSheet.create({
    wifiItemCtn: {
        flexDirection: 'row',
        gap: 17,
        paddingVertical: 5
    },
    wifiName: {
        fontSize: 17
    },
})

export default WifiItem;