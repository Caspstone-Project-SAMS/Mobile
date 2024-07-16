import React, { useEffect, useRef, useState } from 'react'
import { View, StyleSheet, Image, TouchableOpacity, Dimensions, Pressable, ScrollView } from 'react-native'
import { Text } from 'react-native-paper'
import Swiper from 'react-native-swiper'
import moment from 'moment'
import { ParamListBase, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import useDispatch from '../../redux/UseDispatch'
import { useToast } from 'react-native-toast-notifications'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/Store'

import { COLORS, FONT_COLORS } from '../../assets/styles/variables'
import { getTodaySchedule } from '../../redux/slice/Schedule'
import { Slots } from '../../models/schedule/Slot'
import { DayCard } from './cards/DayCard'
import SmallCard from './cards/SmallCard'
import ActivityCard from './cards/ActivityCard'

import { PermissionsAndroid } from 'react-native';
import WifiManager from "react-native-wifi-reborn";
import { GLOBAL_STYLES } from '../../assets/styles/styles'

interface WeekDay {
  weekday: string;
  date: Date;
}
const { width } = Dimensions.get('window');
moment.updateLocale('ko', {
  week: {
    dow: 1,
    doy: 1,
  }
})
const Home = () => {

  // const granted = PermissionsAndroid.request(
  //   PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //   {
  //     title: 'Location permission is required for WiFi connections',
  //     message:
  //       'SAMS application needs location permission as this is required  ' +
  //       'to scan for wifi networks.',
  //     buttonNegative: 'DENY',
  //     buttonPositive: 'ALLOW',
  //   },
  // )

  const [onClick, setOnClick] = useState<boolean>(false);
  const [wifiPermission, setWifiPermission] = useState();

  const swiper = useRef();
  const toast = useToast();
  const dispatch = useDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const sampleData = ['MLN1', 'MLN2', 'MLN3'];

  const [currentDay, setCurrentDay] = useState(new Date());

  const { data, error } = useSelector((state: RootState) => state.schedule)
  const userInfo = useSelector((state: RootState) => state.auth.userDetail)

  const weeks = React.useMemo(() => {
    const start = moment().add(0, 'weeks').startOf('week');

    return [-1, 0, 1].map(adj => {
      return Array.from({ length: 7 }).map((_, index) => {
        const date = moment(start).add(adj, 'week').add(index, 'day');

        return {
          weekday: date.format('ddd'),
          date: date.toDate(),
        };
      });
    });
  }, []);


  const getWeekFromDate = (inputDate: Date): WeekDay[] => {
    const startOfWeek = moment(inputDate).startOf('week');
    const week: WeekDay[] = [];

    for (let i = 0; i < 7; i++) {
      const date = moment(startOfWeek).add(i, 'days').toDate();
      week.push({
        weekday: moment(date).format('ddd'),
        date: date,
      });
    }

    return week;
  };

  const grantedPermission = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location permission is required for WiFi connections',
        message:
          'SAMS application needs location permission as this is required  ' +
          'to scan for wifi networks.',
        buttonNegative: 'DENY',
        buttonPositive: 'ALLOW',
      },
    )
    return granted;
  }

  useEffect(() => {
    const cur = moment().format('YYYY-MM-DD');
    const lecturerId = userInfo?.result?.id
    const semesterId = '2' //fix cung ky hoc
    if (lecturerId && semesterId) {
      dispatch(getTodaySchedule({ lecturerId, semesterId }))
    }

    // console.log("In here ",
    //   getWeekFromDate(cur)
    // );
    const permission = grantedPermission();
    permission.then(info => setWifiPermission(info)).catch(err => "Got err here bro")
  }, [])

  useEffect(() => {
    if (wifiPermission === PermissionsAndroid.RESULTS.GRANTED) {
      const getWifiOnPress = async () => {
        let wifiList = await WifiManager.loadWifiList();
        console.log('wifi list', wifiList);
      }

      getWifiOnPress();
    } else {
      console.log("Denied to use Wifi");
    }
  }, [onClick, wifiPermission])

  useEffect(() => {
    if (data) {
      // toast.show('Welcome!', { type: 'success' });
      console.log("Data", data);
    }
  }, [data, toast]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.title}>
          <View style={styles.userInfoCtn}>
            <Image
              source={require('../../assets/imgs/music is powerful.jpg')}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.userName}>
                Nguyen Duc
              </Text>
              <Text>Front-end Developer</Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.4}
            style={styles.bellNotification}
            onPress={() => {
              //  navigation.navigate('ScheduleSwipe') 
              // setWifiPermission(grantedPermission())
            }}
          >
            <Image source={require('../../assets/icons/bell.png')}
              style={styles.bellIcon}
            />
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1 }}>
          <Swiper
            style={{ marginTop: 20, maxHeight: 60 }}
            index={1}
            ref={swiper}
            loop={false}
            showsPagination={false}
          >
            {weeks.map((dates, index) => {
              return (<View key={index} style={[styles.scheduleRow, { flex: 1 }]}>
                {
                  dates.map((item, i) => {
                    const isActive =
                      currentDay.toDateString() === item.date.toDateString();
                    return (
                      <Pressable
                        key={`dayCard_${i}`}
                        onPress={() => {
                          setCurrentDay(item.date)
                          setOnClick(!onClick);
                        }}
                        style={{ height: 54 }}
                      >
                        <DayCard day={item.date.getDate()} selected={isActive} weekday={item.weekday} />
                      </Pressable>
                    )
                  })
                }
              </View>)
            })}
          </Swiper>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.dashBoardCtn}>
          <Text style={GLOBAL_STYLES.titleLabel}>Today Attendance</Text>
          <View style={{ flexDirection: "row", justifyContent: 'space-between', gap: 10 }}>
            <SmallCard
              titleIcon={require('../../assets/icons/upcoming_x3.png')}
              titleTxt={`Upcoming Class`}
              detail='SWP391'
              subDetail='View Detail'
              key={'dashboardCard1'}
            />
            <SmallCard
              titleIcon={require('../../assets/icons/classIcon.png')}
              titleTxt='Today Class'
              detail='3/5'
              subDetail='Class done'
              key={'dashboardCard2'}
            />
          </View>
          <View style={styles.subjectPrepare}>
            <View style={styles.subjectPrepareTitle}>
              <View style={styles.titleIconCtn}>
                <Image source={require('../../assets/icons/classIcon.png')} style={styles.cardIcon} />
              </View>
              <Text style={[styles.titleTxt, { paddingRight: 48 }]}>Subject Prepare</Text>
            </View>
            <View style={styles.subjectDetailCtn}>
              {sampleData.map((item, i) => {
                if (i % 2 === 0) {
                  if (i === sampleData.length - 1) {
                    return <Text key={`subject_${i}`} style={[styles.detail, { textAlign: 'center', width: '100%' }]}>{item}</Text>
                  }
                  return (
                    <View key={`record_${i}`} style={{ flexDirection: 'row' }}>
                      <Text style={styles.detail}>{item}</Text>
                      {i + 1 < sampleData.length && (
                        <>
                          <View style={styles.divider} />
                          <Text style={styles.detail}>{sampleData[i + 1]}</Text>
                        </>
                      )}
                    </View>
                  )
                }
              })}
            </View>
          </View>
        </View>

        <View style={styles.classActivities}>
          <View style={styles.activitiesHeader}>
            <Text style={GLOBAL_STYLES.titleLabel}>Today Activities | {data.length}</Text>
            <TouchableOpacity>
              <Text style={{ color: FONT_COLORS.blueFontColor }}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={{ gap: 10 }}>
            {
              data.map((item, i) => {
                const timeSlot = Slots[item.slotNumber - 1].timeStart + ' - ' + Slots[item.slotNumber - 1].timeEnd
                return (
                  <ActivityCard
                    room={item.roomName}
                    status={item.status ?? 'Past'}
                    subjectCode={item.subjectCode}
                    time={timeSlot}
                    key={`schedule_${i}`} />
                )
              })
            }
          </View>
        </View>
      </View>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingVertical: 15,
    paddingHorizontal: 20
    // alignItems: 'flex-start'
  },
  title: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  userInfoCtn: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 65,
    height: 65,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: COLORS.borderColor
  },
  userName: {
    fontSize: 20,
    fontFamily: 'Lexend-Regular'
  },
  bellNotification: {
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: COLORS.borderColor
  },
  bellIcon: {
    width: 20,
    height: 20,
  },
  //Daily card
  scheduleRow: {
    width: width - 40,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  dayCardCtn: {
    flex: 1,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 54,
    height: 54,
    marginRight: 4,
  },
  body: {
    flex: 4,
    paddingVertical: 15,
    paddingHorizontal: 20
  },
  dashBoardCtn: {
    // flexDirection: 'row',
    // justifyContent: 'space-between'
  },
  titleLabel: {
    fontSize: 18,
    marginBottom: 10,
    fontFamily: 'Lexend-Regular'
  },
  subjectPrepare: {
    gap: 5,
    flexWrap: 'wrap',
    backgroundColor: "#FFF",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginVertical: 10,
  },
  subjectPrepareTitle: {
    gap: 8,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleIconCtn: {
    backgroundColor: '#F6F6F6',
    padding: 10,
    borderRadius: 10,
  },
  cardIcon: {
    width: 20,
    height: 20
  },
  titleTxt: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
  },
  subjectDetailCtn: {
    gap: 6
  },
  detail: {
    width: '45%',
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'Lexend-Medium',
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: '#000',
    marginHorizontal: 10,
  },
  classActivities: {
    marginTop: 5,
    marginBottom: 25
  },
  activitiesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
})

export default Home