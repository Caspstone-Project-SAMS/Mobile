import { Image, View } from 'react-native'
import React from 'react'
import { GLOBAL_STYLES } from '../../assets/styles/styles'
import { Text } from 'react-native-paper'

const NoData: React.FC<{ text: string }> = ({ text }) => {
    return (
        <View style={GLOBAL_STYLES.verticalBetweenCenter}>
            <Image
                style={{ width: 100, height: 100 }}
                source={require('../../assets/imgs/nodata_black.png')} alt='No data image' />
            <Text>{text}</Text>
        </View>
    )
}

export default NoData