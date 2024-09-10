import { FlatList, StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Title from '../../components/Title'
import { Navigation } from '../../hooks/navigation/Navigation'
import NotificationItem from './NotificationItem'
import { NotificationService } from '../../hooks/Notification'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/Store'
import { Notification as NotificationModel } from '../../models/Notification'

const Notification: React.FC<Navigation> = ({ navigation }) => {
    const userId = useSelector((state: RootState) => state.auth.userDetail?.result?.id)
    const [notificationList, setNotificationList] = useState<NotificationModel[]>([])

    useEffect(() => {
        if (userId) {
            const promise = NotificationService.getNotificationsById(userId);
            promise.then(data => {
                console.log("noti data ", data);
                setNotificationList(data)
            }).catch(err => {
                console.log('An err occured when getting notifications', JSON.stringify(err))
            })
        }
    }, [])

    return (
        <View style={styles.container}>
            <Title title='Notification' navigation={navigation} />
            <View style={styles.body}>
                <FlatList
                    style={{ flex: 1 }}
                    data={notificationList}
                    renderItem={({ item }) => <NotificationItem item={item} />}
                    keyExtractor={(item, index) => `noti_${index}`}
                />
            </View>
        </View>
    )
}

export default Notification

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
        paddingBottom: 20,
        paddingHorizontal: 20,
        backgroundColor: '#FFF'
    },
    body: {
        marginVertical: 20,
        flex: 1
    }
})