import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Avatar, Text } from 'react-native-paper'
import { FONT_COLORS } from '../../assets/styles/variables'
import { Notification } from '../../models/Notification';
import moment from 'moment';
import { NotificationService } from '../../hooks/Notification';

const { width } = Dimensions.get('window');

const NotificationItem: React.FC<{ item: Notification }> = ({ item }) => {

    const [isReaded, setIsReaded] = useState(item.read)

    const handleReaded = () => {
        const promise = NotificationService.updateReadedNotification(item.notificationID);
        promise.then(data => {
            console.log("on sending success", data);
            setIsReaded(true)
        }).catch(err => {
            console.log("err occured when update readed notification");
        })
    }

    return (
        <TouchableOpacity style={styles.container}
            onPress={() => {
                if (!item.read) {
                    handleReaded()
                }
            }}
        >
            <View style={styles.left}>
                {!isReaded && (<View style={styles.badge}></View>)}

                <Avatar.Text size={42} label="SAMS" labelStyle={{ fontSize: 10 }} />
            </View>
            <View style={styles.middle}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.info}>{item.description}</Text>
                <Text style={styles.timeStamp}>{moment(item.timeStamp).format('DD/MM/YYYY, HH:MM:SS')}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default NotificationItem

const styles = StyleSheet.create({
    container: {
        // gap: 10,
        justifyContent: 'space-between',
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingVertical: 5,
    },
    left: {
        width: 42,
        position: 'relative'
    },
    badge: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'red',
        position: 'absolute',
        top: -1,
        right: 1,
        zIndex: 1
    },
    middle: {
        width: (width - 42) * 0.85
    },
    title: {
        fontSize: 17,
        fontFamily: 'Lexend-Regular'
    },
    info: {
        marginVertical: 2,
    },
    timeStamp: {
        color: FONT_COLORS.blurFontColor
    },
})