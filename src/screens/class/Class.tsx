import { View, StyleSheet, ScrollView, Image } from 'react-native'
import React, { useState } from 'react'
import { Text, TextInput } from 'react-native-paper'
import { TouchableOpacity } from 'react-native-gesture-handler'

import { COLORS } from '../../assets/styles/variables'
import { GLOBAL_STYLES } from '../../assets/styles/styles'
import DashboardCard from './cards/DashboardCard'
import StudentActivityCard from './cards/StudentActivityCard'


const Class = () => {
    const [searchVal, setSearchVal] = useState<string>('')
    const [selectedView, setSelectedView] = useState<'list' | 'pending' | 'absent'>('list')

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={[styles.headerTitle, GLOBAL_STYLES.horizontalCenter]}>
                    <Text style={{ fontFamily: 'Lexend-Regular', fontSize: 18 }}>
                        Class Activity
                    </Text>
                    <View style={[GLOBAL_STYLES.horizontalCenter, { gap: 10 }]}>
                        <Image style={styles.titleIcon} source={require('../../assets/icons/plusIconBtn.png')} />
                        <Image style={styles.titleIcon} source={require('../../assets/icons/filterIcon.png')} />
                    </View>
                </View>
                <View style={styles.dashboardCardsCtn}>
                    <View style={styles.dashboardRow}>
                        <DashboardCard label='Attendance' detail='35' theme='info' key={'1'} />
                        <DashboardCard label='Attended' detail='26' theme='success' key={'2'} />
                    </View>
                    <View style={styles.dashboardRow}>
                        <DashboardCard label='Exemptions' detail='2' theme='warning' key={'3'} />
                        <DashboardCard label='Absent' detail='1' theme='danger' key={'4'} />
                    </View>
                </View>
            </View>
            <View style={styles.body}>
                <View style={[
                    GLOBAL_STYLES.horizontalCenter,
                    { gap: 30, marginBottom: 24 }
                ]}>
                    <View style={styles.classInfo}>
                        <Text style={styles.infoTxt}>Subject: MLN131</Text>
                        <Text style={styles.infoTxt}>Class: NJS1713_Half 1</Text>
                    </View>
                    <TextInput
                        mode="outlined"
                        placeholder="Search.."
                        style={[styles.searchBox, styles.shadow]}
                        right={<TextInput.Icon
                            icon={'magnify'}
                            onPress={() => { console.log("hehe") }}
                        />}
                        onChangeText={val => setSearchVal(val)}
                    />
                </View>

                <View style={{ flex: 1 }}>
                    <View style={styles.filterListCtn}>
                        <View style={styles.filterBtn}>
                            <TouchableOpacity
                                onPress={() => setSelectedView('list')}
                            >
                                <Text style={[styles.filterBtnTxt,
                                selectedView === 'list' && styles.onSelectedBtn
                                ]}>List</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.filterBtn}>
                            <TouchableOpacity
                                onPress={() => setSelectedView('pending')}
                            >
                                <Text style={[styles.filterBtnTxt,
                                selectedView === 'pending' && styles.onSelectedBtn
                                ]}>Pending</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.filterBtn}>
                            <TouchableOpacity
                                onPress={() => setSelectedView('absent')}
                            >
                                <Text style={[styles.filterBtnTxt,
                                selectedView === 'absent' && styles.onSelectedBtn
                                ]}>Absent</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.studentList}>
                        <StudentActivityCard />
                        <StudentActivityCard />
                        <StudentActivityCard />
                        <StudentActivityCard />
                        <StudentActivityCard />
                        <StudentActivityCard />
                        <StudentActivityCard />
                        <StudentActivityCard />
                        <StudentActivityCard />
                        <StudentActivityCard />
                        <StudentActivityCard />
                        <StudentActivityCard />
                        <StudentActivityCard />
                        <StudentActivityCard />
                        <StudentActivityCard />
                        <StudentActivityCard />
                        <StudentActivityCard />
                        <StudentActivityCard />
                        <StudentActivityCard />
                        <StudentActivityCard />
                        <StudentActivityCard />
                        <StudentActivityCard />
                        <StudentActivityCard />
                        <StudentActivityCard />
                        <StudentActivityCard />
                        <StudentActivityCard />
                        <StudentActivityCard />
                        <StudentActivityCard />
                        <StudentActivityCard />
                        <StudentActivityCard />
                        <StudentActivityCard />
                        <StudentActivityCard />
                        <StudentActivityCard />
                        <StudentActivityCard />
                        <StudentActivityCard />
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#FFF'
    },
    header: {},
    headerTitle: {
        justifyContent: 'space-between',
    },
    titleIcon: {
        width: 25,
        height: 25,
    },
    dashboardCardsCtn: {
        marginTop: 25,
    },
    dashboardRow: {
        flex: 2,
        gap: 12,
        flexDirection: 'row',
        marginBottom: 12
    },

    body: {
        marginTop: 12,
        marginBottom: 40
    },
    classInfo: {
    },
    infoTxt: {
        flex: 1,
        fontFamily: 'Lexend-Regular',
        fontSize: 16
    },
    searchBox: {
        flex: 1,
        height: 55
    },
    shadow: {
        shadowColor: '#000',
        shadowOffset: { width: 5, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 3.84,
        elevation: 5,
    },
    filterListCtn: {
        flex: 1,
        marginBottom: 20,
        borderRadius: 10,
        flexDirection: 'row',
        backgroundColor: '#F4F4F4',
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
    studentList: {},
})

export default Class