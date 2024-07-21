import React from 'react'
import { StyleSheet, TextStyle, View, ViewStyle } from 'react-native'
import { Text } from 'react-native-paper'
import { COLORS } from '../../assets/styles/variables'

interface props {
    text: string,
    customStyle?: ViewStyle,
    colorTxt?: TextStyle,
    icon?: React.ReactNode
}

const CustomBtn: React.FC<props> = ({ text, customStyle, colorTxt, icon }) => {
    const btnStyle = customStyle ? customStyle : styles.defaultStyle
    const colorStyle = colorTxt ? colorTxt : { color: '#FFF' }

    return (
        <View style={[styles.button, btnStyle]}>
            {
                icon && icon
            }
            <Text style={[styles.font, colorStyle]}>
                {text}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    defaultStyle: {
        backgroundColor: COLORS.skyBlue
    },
    button: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        paddingVertical: 10,
    },
    font: {
        fontSize: 18
    }
})
export default CustomBtn