import { View, StyleSheet, ScrollView, Image, Dimensions, Keyboard, TouchableWithoutFeedback, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Searchbar, Text, TextInput } from 'react-native-paper'

import { GLOBAL_STYLES } from '../../assets/styles/styles'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/Store'
import useDispatch from '../../redux/UseDispatch'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { getAllSemester } from '../../redux/slice/Semester'
import { ClassModel } from '../../models/Class'
import { ClassService } from '../../hooks/Class'
import { Semester } from '../../models/Semester'


type ClassItemProps = {
    classCode: string,
    roomName: string,
    subject: string
}

const ClassItem: React.FC<ClassItemProps> = ({ classCode, roomName, subject }) => {
    return (<View style={[styles.classItem, GLOBAL_STYLES.card]}>
        <View style={styles.itemLeft}>
            <Image
                source={require('../../assets/icons/upcoming_x3.png')}
                style={{
                    width: 27,
                    height: 27
                }}
            />
        </View>
        <View style={styles.itemRight}>
            <View style={{ width: '88%' }}>
                <Text>Class: {classCode}</Text>
                <Text>Room: {roomName}</Text>
                <Text>Subject: {subject}</Text>
            </View>
            <Ionicons name='chevron-forward' size={20} />
        </View>
    </View>)
}

const { width, height } = Dimensions.get('window');
const Class = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSemester, setSelectedSemester] = useState<Semester>();
    const [searchClass, setSearchClass] = useState('');
    const [classList, setClassList] = useState<ClassModel[]>([]);

    const dispatch = useDispatch();
    const userDetail = useSelector((state: RootState) => state.auth.userDetail?.result)
    const semesters = useSelector((state: RootState) => state.semester.data);

    const [isOpenActions, setIsOpenActions] = useState<boolean>(false);
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(-50);
    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: withTiming(opacity.value, {
                duration: 260,
            }),
            transform: [{ translateY: withTiming(translateY.value, { duration: 260 }) }],
        };
    });

    useEffect(() => {
        if (semesters && semesters.length === 0) {
            dispatch(getAllSemester());
        }
    }, [])

    useEffect(() => {
        if (isOpenActions) {
            opacity.value = 1;
            translateY.value = 0;
        } else {
            opacity.value = 0;
            translateY.value = -50;
        }
    }, [isOpenActions]);

    useEffect(() => {
        if (userDetail && selectedSemester && semesters.length > 0) {
            const promise = ClassService.getClassBySemester(userDetail.id, selectedSemester.semesterID)
            promise.then(data => {
                setClassList(data.result);
            }).catch(err => {
                console.log("Error occured when get data ", JSON.stringify(err));
            })
        }
    }, [selectedSemester])

    useEffect(() => {
        console.log("List has changed ", classList);
    }, [classList])

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Searchbar
                    placeholder={selectedSemester ? selectedSemester.semesterCode : 'Search Semester'}
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchBar}
                    onFocus={() => setIsOpenActions(true)}
                // onBlur={() => setIsOpenActions(false)}
                />
                {
                    isOpenActions &&
                    <Animated.View style={[styles.actionsModal, animatedStyle]}>
                        <ScrollView style={{ maxHeight: height * 0.7 }}>
                            {
                                (semesters && semesters.length > 0) && semesters.map(item => {
                                    if (searchQuery.length === 0) {
                                        return (
                                            <TouchableOpacity
                                                key={`item_${item.semesterID}`}
                                                style={{ marginBottom: 2 }}
                                                onPress={() => {
                                                    setSelectedSemester(item);
                                                    Keyboard.dismiss();
                                                    setIsOpenActions(false);
                                                }}
                                            >
                                                <Text style={{ width: 'auto', paddingVertical: 6 }}>
                                                    {item.semesterCode}
                                                </Text>
                                            </TouchableOpacity>
                                        )
                                    } else if (item.semesterCode.toLowerCase().includes(searchQuery.toLowerCase())) {
                                        return (
                                            <TouchableOpacity
                                                key={`item_${item.semesterID}`}
                                                style={{ paddingVertical: 6 }}
                                                onPress={() => {
                                                    setSelectedSemester(item);
                                                    Keyboard.dismiss();
                                                    setIsOpenActions(false);
                                                }}
                                            >
                                                <Text>
                                                    {item.semesterCode}
                                                </Text>
                                            </TouchableOpacity>
                                        )
                                    }
                                })
                            }
                        </ScrollView>
                    </Animated.View>
                }
            </View>

            <TouchableWithoutFeedback
                onPress={() => {
                    Keyboard.dismiss();
                    setIsOpenActions(false);
                }}
            >
                <View style={{ flex: 1 }}>
                    <ScrollView style={{ flex: 1 }}>
                        <View style={styles.accessibilityBar}>
                            <Text style={{ marginBottom: 15, fontSize: 18, fontFamily: 'Lexend-Regular' }}>Class:</Text>
                            <TextInput
                                mode="outlined"
                                placeholder="Search.."
                                style={[styles.searchBox, styles.shadow]}
                                right={<TextInput.Icon
                                    icon={searchClass.length > 0 ? ('close') : ('magnify')}
                                    onPress={() => {
                                        if (searchClass.length > 0) {
                                            setSearchClass('')
                                        }
                                    }}
                                />}
                                value={searchClass}
                                onChangeText={val => {
                                    setSearchClass(val);
                                }}
                            />
                        </View>
                        <View style={{ gap: 16, marginTop: 14 }}>
                            {
                                classList.length > 0 ? classList.map((item, index) => {
                                    if (searchClass.length > 0
                                        && item.classCode.toLowerCase().includes(searchClass.toLowerCase())) {
                                        return (
                                            <TouchableOpacity key={`class_${index}`}
                                                onPress={() => { navigation.navigate('ClassInfo', { classData: item }) }}
                                            >
                                                <ClassItem
                                                    classCode={item.classCode}
                                                    roomName={item.room.roomName}
                                                    subject={`${item.subject.subjectCode} - ${item.subject.subjectName}`}
                                                />
                                            </TouchableOpacity>
                                        )
                                    } else if (searchClass.length === 0) {
                                        return (
                                            <TouchableOpacity key={`class_${index}`}
                                                onPress={() => { navigation.navigate('ClassInfo', { classData: item }) }}
                                            >
                                                <ClassItem
                                                    classCode={item.classCode}
                                                    roomName={item.room.roomName}
                                                    subject={`${item.subject.subjectCode} - ${item.subject.subjectName}`}
                                                />
                                            </TouchableOpacity>
                                        )
                                    }
                                }
                                ) : (
                                    <View style={GLOBAL_STYLES.verticalBetweenCenter}>
                                        <Image
                                            style={{ width: 100, height: 100 }}
                                            source={require('../../assets/imgs/nodata_black.png')} alt='No data image' />
                                        <Text>No Class Found</Text>
                                    </View>
                                )
                            }
                        </View>
                    </ScrollView>
                </View>
            </TouchableWithoutFeedback>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#FFF',
    },
    searchContainer: {
        position: 'relative',
        height: 'auto'
    },
    accessibilityBar: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between'
    },
    searchBar: {
        marginBottom: 20,
        backgroundColor: '#FFF',
        zIndex: 2
    },
    actionsModal: {
        minWidth: width - 40,
        // paddingVertical: 8,
        paddingTop: 18,
        paddingBottom: 10,
        paddingHorizontal: 12,
        borderRadius: 5,
        backgroundColor: 'white',
        borderWidth: 1,
        borderTopWidth: 0,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        // borderColor: COLORS.borderColor,
        borderColor: '#FFF',
        gap: 8,

        position: 'absolute',
        top: 40,
        // right: 20,
        zIndex: 1,

        shadowColor: '#7F5DF0',
        shadowOffset: {
            width: 0,
            height: 10
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5
    },
    classItem: {
        gap: 10,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemLeft: {

    },
    itemRight: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    searchBox: {
        width: width * 0.4,
        height: 40,
        backgroundColor: '#FFF'
    },
    shadow: {
        shadowColor: '#000',
        shadowOffset: { width: 5, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 3.84,
        elevation: 5,
    },
})

export default Class