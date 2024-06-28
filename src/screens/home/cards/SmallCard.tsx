import { View, StyleSheet, Image, ImageSourcePropType } from 'react-native'
import React from 'react'
import { Text } from 'react-native-paper'

type props = {
    titleIcon: ImageSourcePropType,
    titleTxt: string,
    detail: string,
    subDetail: string,
}

const SmallCard: React.FC<props> = ({ detail, subDetail, titleIcon, titleTxt }) => {
    return (
        <View style={styles.cardSmall}>
            <View style={styles.title}>
                <View style={styles.titleIconCtn}>
                    <Image source={titleIcon} style={styles.cardIcon} />
                </View>
                <Text style={styles.titleTxt}>{titleTxt}</Text>
            </View>
            <Text style={styles.detail}>{detail}</Text>
            <Text style={{ fontSize: 14 }}>{subDetail}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    cardSmall: {
        flex: 1,
        backgroundColor: "#FFF",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 14,
        gap: 5,
        flexWrap: 'wrap'
    },
    title: {
        gap: 8,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    titleIconCtn: {
        backgroundColor: '#F6F6F6',
        padding: 10,
        borderRadius: 10
    },
    cardIcon: {
        width: 20,
        height: 20
    },
    titleTxt: {
        flex: 1,
        fontSize: 16,
        // fontFamily: 'Lexend-Regular'
    },
    detail: {
        fontSize: 18,
        fontFamily: 'Lexend-Medium'
    },
})

export default SmallCard