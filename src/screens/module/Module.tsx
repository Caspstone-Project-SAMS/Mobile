import React, { useEffect, useState } from 'react'
import { COLORS, FONT_COLORS } from '../../assets/styles/variables'
import { GLOBAL_STYLES } from '../../assets/styles/styles'
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native'
import { Text } from 'react-native-paper'

import Ionicon from 'react-native-vector-icons/Ionicons';

//@ts-ignore
const Module = ({ navigation }) => {
    return (
        <ScrollView style={styles.container}>
            <Text style={GLOBAL_STYLES.titleLabel}            >
                Module Management
            </Text>

            <TouchableOpacity
                onPress={() => navigation.navigate('ConfigModule')}
                style={{ marginTop: 15 }}
            >
                <View style={styles.moduleCard}>
                    <View style={styles.leftCard}>
                        <Text style={styles.cardTitle}>Config module</Text>
                        <Text style={styles.cardDescription}>Adjust auto prepare time, sounds,...</Text>
                    </View>
                    <View style={styles.rightCard}>
                        {/* config_icon.png */}
                        <View>
                            <Image
                                style={styles.cardIcon}
                                source={require('../../assets/icons/config_icon.png')}
                            />
                        </View>
                        <Ionicon name='arrow-forward-outline' size={25} style={{ paddingRight: 6 }} />
                    </View>
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => navigation.navigate('SetUpModule')}
                style={{ marginTop: 25 }}
            >
                <View style={styles.moduleCard}>
                    <View style={styles.leftCard}>
                        <Text style={styles.cardTitle}>Set up module wifi</Text>
                        <Text style={styles.cardDescription}>Set up wifi and password for module connect to internet</Text>
                    </View>
                    <View style={styles.rightCard}>
                        <View>
                            <Image
                                style={styles.cardIcon}
                                source={require('../../assets/icons/wireless_icon.png')}
                            />
                        </View>
                        <Ionicon name='arrow-forward-outline' size={25} style={{ paddingRight: 6 }} />
                    </View>
                </View>
            </TouchableOpacity>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 15,
        paddingHorizontal: 20,
        backgroundColor: '#FFF',
    },
    moduleCard: {
        borderColor: COLORS.borderColor,
        borderWidth: 1,
        borderRadius: 4,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    leftCard: {
        width: '65%',
        gap: 12,
        padding: 16
    },
    rightCard: {
        width: '35%',
        padding: 10,
        gap: 15,
        alignItems: 'flex-end',
        justifyContent: 'space-between'
    },
    cardTitle: {
        fontSize: 18,
        fontFamily: 'Lexend-Regular'
    },
    cardDescription: {
        fontSize: 14,
        color: FONT_COLORS.blurFontColor
    },
    cardIcon: {
        width: 55,
        height: 55,
    }
})

export default Module