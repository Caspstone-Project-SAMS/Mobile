import React from "react"
import { Dimensions, StyleSheet, View } from "react-native"
import { Text } from "react-native-paper"
import { COLORS } from "../../../assets/styles/variables"

type DayProps = {
    day: number,
    weekday: string,
    selected: boolean
}

const { width } = Dimensions.get('window');

export const DayCard: React.FC<DayProps> = React.memo(({ day, weekday, selected }) => {
    const theme = selected ?
        {
            txtColor: '#FFF',
            subTxtColor: '#FFF',
            bgColor: '#0087FD'
        } : {
            txtColor: '#000',
            subTxtColor: '#000',
            bgColor: '#FFF'
        }

    return (
        <View style={[styles.dayCardCtn, { backgroundColor: theme.bgColor }]}>
            <Text style={{
                fontFamily: 'Lexend-Medium',
                fontSize: 16,
                color: theme.txtColor
            }}>{day}</Text>
            <Text style={{
                fontSize: 14,
                color: theme.subTxtColor
            }}>{weekday}</Text>
        </View>
    )
})

const styles = StyleSheet.create({
    dayCardCtn: {
        flex: 1,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: COLORS.borderColor,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: (width - 40 - 24) / 7, //pad hor 40, gap 4 - 6each, 7 items
        height: (width - 40 - 24) / 7,
        marginRight: 4,
    },
})