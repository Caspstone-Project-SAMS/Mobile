import { View, StyleSheet } from 'react-native'
import React from 'react'
import { Text } from 'react-native-paper'

type props = {
    label: string,
    detail: string,
    theme: 'info' | 'success' | 'warning' | 'danger'
}

const cardTheme = {
    info: {
        borderColor: '#0087FE',
        backgroundColor: '#F4F9FF',
        textColor: '#0090FE'
    },
    success: {
        borderColor: '#65B741',
        backgroundColor: '#C1F2B0',
        textColor: '#3ABE00'
    },
    warning: {
        borderColor: '#FFBB64',
        backgroundColor: '#FFEAA7',
        textColor: '#FF8F00'
    },
    danger: {
        borderColor: '#FF776B',
        backgroundColor: '#FFC5C1',
        textColor: '#DC4437'
    },
}

const DashboardCard: React.FC<props> = ({ detail, label, theme }) => {
    const themeStyle = cardTheme[theme]
    return (
        <View style={[
            styles.container,
            {
                backgroundColor: themeStyle.backgroundColor,
                borderColor: themeStyle.borderColor,
            }
        ]}>
            <Text style={styles.cardLabel}>{label}</Text>
            <Text style={[styles.cardDetail, { color: themeStyle.textColor }]}>{detail}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        minHeight: 100,
        borderWidth: 1,
        borderRadius: 15,
        justifyContent: 'space-between',
        padding: 10
    },
    cardLabel: {
        fontSize: 20
    },
    cardDetail: {
        fontFamily: 'Lexend-Medium',
        fontSize: 18
    }
})

export default DashboardCard