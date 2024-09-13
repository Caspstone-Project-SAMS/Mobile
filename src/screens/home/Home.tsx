import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { View, StyleSheet, Image, TouchableOpacity, Dimensions, Pressable, ScrollView, FlatList } from 'react-native'
import { Text } from 'react-native-paper'
import Swiper from 'react-native-swiper'
import moment from 'moment'
import { ParamListBase, useFocusEffect, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import useDispatch from '../../redux/UseDispatch'
import { useToast } from 'react-native-toast-notifications'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/Store'

import { COLORS, FONT_COLORS } from '../../assets/styles/variables'
import { getScheduleByDay, getTodaySchedule } from '../../redux/slice/Schedule'
import { DayCard } from './cards/DayCard'
import SmallCard from './cards/SmallCard'
import ActivityCard from './cards/ActivityCard'

import { PermissionsAndroid } from 'react-native';
import { GLOBAL_STYLES } from '../../assets/styles/styles'
import { getAllSemester } from '../../redux/slice/Semester'
import { ScheduleResponse } from '../../models/schedule/ScheduleResponse'
import { validateStatusSchedule } from '../../hooks/helpers/ScheduleHelper'
import { HelperService } from '../../hooks/helpers/HelperFunc'
import PrepareModule from '../../components/module/PrepareModule'
import { ScheduleService } from '../../hooks/Schedule'
import axios from 'axios'
import { DividerWithTxt } from '../../components/global/DividerWithTxt'
import OldActivityCard from './cards/OldActivityCard'
import ScheduleCard from '../class/cards/ScheduleCard'
import { NotificationService } from '../../hooks/Notification'
// import { connectWebSocket, disconnectWebSocket } from '../../redux/slice/WebSocket'

const { width } = Dimensions.get('window');
moment.updateLocale('ko', {
  week: {
    dow: 1,
    doy: 1,
  }
})

type Dashboard = {
  curUpClass: ScheduleResponse,
  upcomingTxt: string,
  todayClass: string,
  subjectPrepare: string[]
}
type SelectedInfo = {
  currentDate: Date,
  selectedDate: string
}

const Home = () => {
  const { data, todaySchedules, error } = useSelector((state: RootState) => state.schedule)
  const userInfo = useSelector((state: RootState) => state.auth.userDetail)
  const semesters = useSelector((state: RootState) => state.semester.data)
  // const socketMsg = useSelector((state: RootState) => state.websocket.socket);

  const swiper = useRef();
  const toast = useToast();
  const dispatch = useDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const [wifiPermission, setWifiPermission] = useState();
  const [onClick, setOnClick] = useState<boolean>(false);
  const [currentDay, setCurrentDay] = useState(new Date());
  const [currentSemester, setCurrentSemester] = useState<number>(5);
  const [dashBoardInfo, setDashboardInfo] = useState<Dashboard | undefined>(undefined);
  const [selectedInfo, setSelectedInfo] = useState<SelectedInfo>({ currentDate: new Date(), selectedDate: 'Today' });
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const [oldSchedules, setOldSchedules] = useState<any>();
  const [isHavingNotification, setIsHavingNotification] = useState(false)

  const weeks = useMemo(() => {
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


  //Return current|next slot, upcoming class, subject prepare, today class
  const lectureDashboardCalculator = () => {
    try {
      let hasEventToday = false
      let pastEvent = 0;
      const dashboardInfoVal: Dashboard = {
        curUpClass: {
          classID: 0,
          classCode: '',
          date: '',
          endTime: '',
          roomName: '',
          scheduleID: 0,
          slotNumber: 0,
          startTime: '',
          subjectCode: '',
          status: 'Past'
        },
        upcomingTxt: '',
        todayClass: '',
        subjectPrepare: []
      }
      const schedules = data;
      const today = moment(new Date()).format('YYYY-MM-DD');
      if (schedules && schedules.length > 0) {
        let isSetCurrentClass = false
        //Current date
        const todaySchedules = schedules.map(schedule => {
          if (schedule.date === today) {
            const startDateTime = new Date(`${schedule.date}T${schedule.startTime}`);
            const endDateTime = new Date(`${schedule.date}T${schedule.endTime}`);

            const status = validateStatusSchedule(startDateTime, endDateTime);
            if (status === 'Current' || status === 'Upcoming') {
              if (status === 'Current') {
                dashboardInfoVal.curUpClass = { ...schedule, status: status };
                isSetCurrentClass = true
              } else if (!isSetCurrentClass) {
                dashboardInfoVal.curUpClass = { ...schedule, status: status };
              }
              dashboardInfoVal.subjectPrepare.push(schedule.subjectCode)
              hasEventToday = true;
            }
            if (status === 'Past') {
              pastEvent++;
            }
            return { ...schedule, status }
          }
        }).filter(item => item !== undefined)
        // calculate upcoming, class left, subject prepare, when time not the end of the day
        if (hasEventToday) {
          let isFirst = false;
          //Subject prepare, upcomingtxt
          todaySchedules.forEach(schedule => {
            if (schedule.status === 'Upcoming') {
              if (!isFirst) {
                dashboardInfoVal.upcomingTxt = schedule.subjectCode;
                isFirst = true;
              }
              dashboardInfoVal.subjectPrepare.push(schedule.subjectCode);
            }
          })
          if (pastEvent !== 0) { // sau khi co tiet hoc ket thuc 
            dashboardInfoVal.todayClass = `${pastEvent}/${todaySchedules.length}`
          } else { // past event = 0, bat dau ngay
            const futureEvents = todaySchedules.filter(item => item.status === 'Upcoming')
            if (futureEvents.length > 0) { // chua bat dau tiet hoc
              dashboardInfoVal.todayClass = `0/${todaySchedules.length}`
            } else { // hoan thanh ngay
              dashboardInfoVal.todayClass = `${todaySchedules.length}/${todaySchedules.length}`
            }
          }

          const subjectArr = dashboardInfoVal.subjectPrepare
          dashboardInfoVal.subjectPrepare = HelperService.removeDuplicates(subjectArr);
          setDashboardInfo(dashboardInfoVal)
        }
      }
      // console.log("cateried ", todaySchedules);
      // console.log("dashboardInfo ", dashboardInfoVal);
    } catch (error) {
      console.log('error when calculating dashboard');
    }
  }

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

  const fetchOldSchedules = (semester: number) => {
    const userId = userInfo?.result?.id;
    const prev5 = moment().subtract(5, 'days').format('YYYY-MM-DD');
    const prev1 = moment().subtract(1, 'days').format('YYYY-MM-DD');

    if (userId && semester) {
      const getPromise = ScheduleService.getScheduleByDay(
        userId,
        semester,
        prev5,
        prev1,
      );
      getPromise.then(data => {
        console.log("This is the last 5 data ", data);
        const sortedList = data.sort((a, b) => moment(b.date).diff(moment(a.date)));

        const groupedData = sortedList.reduce((acc, currentItem) => {
          const date = currentItem.date;
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(currentItem);
          return acc;
        }, {});
        // console.log("This is formatted list ", groupedData);
        setOldSchedules(groupedData);
      }).catch(err => {
        if (axios.isAxiosError(err) && err.response)
          console.log("err in last 7 data", err.response.data);
      })
    }
  }

  const checkHavingNotification = () => {
    const userID = userInfo?.result?.id
    if (userID) {
      console.log("Checking is there having noti----------------");
      const promise = NotificationService.getNotificationsById(userID)
      promise.then(data => {
        let havingNoti = false
        data.forEach(item => {
          if (!item.read) {
            havingNoti = true;
            return
          }
        })
        setIsHavingNotification(havingNoti);
      }).catch(err => {
        console.log("err when get noti");
        setIsHavingNotification(false);
      })
    }
  }

  useEffect(() => {
    // if (userInfo && userInfo.token) {
    //   const webSocket = new WebSocket('wss://sams-project.com/ws/client?mobile=true', [
    //     'access_token',
    //     userInfo.token,
    //   ]);
    //   webSocket.onopen = () => console.log('WebSocket connected');
    //   webSocket.onmessage = (message) => console.log('Message received:', message.data);
    //   webSocket.onclose = () => console.log('WebSocket closed');
    //   dispatch(connectWebSocket(webSocket));
    // }
    // return dispatch(disconnectWebSocket());

    if (semesters && semesters.length === 0) {
      dispatch(getAllSemester());
    }

    if (todaySchedules && todaySchedules.length > 0) {
      const calculateDashboard = setInterval(() => {
        if (todaySchedules.length > 0) {
          lectureDashboardCalculator();
        } else {
          clearInterval(calculateDashboard);
        }
      }, 60000)

      return () => {
        clearInterval(calculateDashboard);
      }
    }
  }, [])

  useEffect(() => {
    const lecturerId = userInfo?.result?.id
    let semesterId = 2
    if (semesters && semesters.length !== 0) {
      semesters.forEach(item => {
        if (item.semesterStatus === 2) {
          setCurrentSemester(item.semesterID);
          semesterId = item.semesterID;
        }
      })
    }
    if (lecturerId && semesterId) {
      dispatch(getTodaySchedule({ lecturerId, semesterId }));
      // console.log("Fetching ole, semester: ", semesterId);
      fetchOldSchedules(semesterId);
    }

    const permission = grantedPermission();
    permission.then(info => setWifiPermission(info)).catch(err => "Got err here bro")
  }, [semesters])

  useEffect(() => {
    //Fetch schedule by day
    const daySelected = moment(currentDay).format('YYYY-MM-DD');
    const lecturerId = userInfo?.result?.id;
    console.log("Current Day selected----------------- ", currentDay);
    if (lecturerId && semesters && currentSemester) {
      dispatch(getScheduleByDay({ lecturerId, semesterId: currentSemester, date: daySelected }))
    }
    //Display date info
    if (currentDay.getDate() === selectedInfo.currentDate.getDate()) {
      setSelectedInfo(prev => ({ ...prev, selectedDate: 'Today' }))
    } else {
      const fmtDate = moment(currentDay).format('DD-MM')
      setSelectedInfo(prev => ({ ...prev, selectedDate: fmtDate }))
    }
  }, [currentDay])

  useEffect(() => {
    lectureDashboardCalculator();
  }, [todaySchedules, data]);

  useFocusEffect(
    useCallback(() => {
      // Code to run when the screen is focused
      setCurrentDay(new Date())
      checkHavingNotification()

      return () => {
        // Code to run when the screen is unfocused
        console.log('Screen is unfocused');
      };
    }, [])
  );

  // useEffect(() => {
  //   console.log("Socket changed ", socketMsg);
  // }, [socketMsg])
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.title}>
          <View style={styles.userInfoCtn}>
            <Image
              source={
                userInfo?.result?.avatar ? (
                  {
                    uri: userInfo.result.avatar,
                  }
                ) :
                  (
                    require('../../assets/imgs/lecturer_icon.png')
                  )
              }
              style={styles.avatar}
            />
            <View>
              <Text onPress={() => { lectureDashboardCalculator() }} style={styles.userName}>
                {userInfo?.result?.displayName}
              </Text>
              <Text>{userInfo?.result?.role.name}</Text>
            </View>
          </View>

          <View style={{ position: 'relative' }}>
            <TouchableOpacity
              activeOpacity={0.4}
              style={styles.bellNotification}
              onPress={() => {
                navigation.navigate('Notification')
                //  navigation.navigate('ScheduleSwipe') 
                // setWifiPermission(grantedPermission())
              }}
            >
              <Image source={require('../../assets/icons/bell.png')}
                style={styles.bellIcon}
              />
              {
                isHavingNotification && (
                  <View style={[styles.badgeDot, { position: 'absolute', top: 1, right: 0 }]}></View>
                )
              }
            </TouchableOpacity>
          </View>
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
          <View style={GLOBAL_STYLES.horizontalBetweenCenter}>
            <Text style={GLOBAL_STYLES.titleLabel}>Today Attendance</Text>
            {/* <PrepareModule /> */}
          </View>
          <View style={{ flexDirection: "row", justifyContent: 'space-between', gap: 10 }}>
            <SmallCard
              titleIcon={require('../../assets/icons/upcoming_x3.png')}
              titleTxt={`Upcoming Class`}
              detail={dashBoardInfo?.upcomingTxt ? (dashBoardInfo.curUpClass.classCode) : ('Done')}
              subDetail='View Detail'
              key={'dashboardCard1'}
              isUpcoming={true}
              upComingSchedule={dashBoardInfo?.curUpClass}
            />
            <SmallCard
              titleIcon={require('../../assets/icons/classIcon.png')}
              titleTxt='Today Class'
              detail={dashBoardInfo?.todayClass ? (dashBoardInfo.todayClass) : ('Done')}
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
              {
                dashBoardInfo?.subjectPrepare ? dashBoardInfo.subjectPrepare.map((item, i) => {
                  if (i % 2 === 0) { // so chan thi render khac nhau, i = 0 => true
                    if (i === dashBoardInfo.subjectPrepare.length - 1) { // Neu do dai bang 1 thi chi return ve 1 item
                      return <Text key={`subject_${i}`} style={[styles.detail, { textAlign: 'center', width: '100%' }]}>{item}</Text>
                    }
                    return ( //Return 2 item va 1 divider
                      <View key={`record_${i}`} style={{ flexDirection: 'row' }}>
                        <Text style={styles.detail}>{item}</Text>
                        {i + 1 < dashBoardInfo.subjectPrepare.length && (
                          <>
                            <View style={styles.divider} />
                            <Text style={styles.detail}>{dashBoardInfo.subjectPrepare[i + 1]}</Text>
                          </>
                        )}
                      </View>
                    )
                  }
                }) : (<Text style={[styles.detail, { width: '100%' }]}>Done</Text>)
              }
            </View>
          </View>
        </View>

        <View style={styles.classActivities}>
          <View style={styles.activitiesHeader}>
            <Text style={GLOBAL_STYLES.titleLabel}>{selectedInfo.selectedDate} Activities | {data.length}</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Schedule')}
            >
              <Text style={{ color: FONT_COLORS.blueFontColor }}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={{ gap: 10 }}>
            {
              data.length > 0 ? data.map((item, i) => {
                const startTime = item.startTime.substring(0, 5);
                const endTime = item.endTime.substring(0, 5);
                return (
                  <TouchableOpacity
                    onPress={() => navigation.navigate('ClassDetail', { schedule: item })}
                    key={`schedule_${i}`}
                  >
                    <ActivityCard
                      room={item.roomName}
                      status={item.status ?? 'Past'}
                      subjectCode={item.subjectCode}
                      startTime={startTime}
                      endTime={endTime}
                    />
                  </TouchableOpacity>
                )
              }) : (
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Image
                    style={{ width: 100, height: 100 }}
                    source={require('../../assets/imgs/nodata_black.png')} alt='No data image' />
                  <Text>No Schedule Found</Text>
                </View>
              )
            }
          </View>
        </View>

        {oldSchedules &&
          <View style={styles.previousClasses}>
            <Text style={GLOBAL_STYLES.titleLabel}>Previous class (Last 5 days)</Text>

            <View style={{ gap: 10 }}>
              {
                Object.entries(oldSchedules).map(([key, value], index) => (
                  <View
                    style={{ gap: 10 }}
                    key={`date_${key}`}
                  >
                    <DividerWithTxt text={moment(key, 'YYYY-MM-DD', true).format('DD/MM/YY')} color='#000' />
                    {
                      Array.isArray(value) && value.map((item) => {
                        const startTime = item.startTime.substring(0, 5);
                        const endTime = item.endTime.substring(0, 5);
                        const isOpen = index === 0;

                        return (
                          <OldActivityCard
                            classSize={0}
                            date={key}
                            slotNumber={item.slotNumber}
                            startTime={startTime}
                            endTime={endTime}
                            status={item.scheduleStatus}
                            key={`old_schedule_${item.scheduleID}`}
                            room={item.roomName}
                            studentAttended={item.attendStudent}
                            opened={isOpen}
                            classCode={item.classCode}
                          />
                        )
                      })
                    }
                  </View>
                ))
              }
            </View>
          </View>
        }
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
  badgeDot: {
    width: 10,
    height: 10,
    borderRadius: 6,
    alignSelf: 'center',
    backgroundColor: 'red',
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
  },
  previousClasses: {
    marginTop: 15,
    marginBottom: 25
  },
  activitiesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
})

export default Home