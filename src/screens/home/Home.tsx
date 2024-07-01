import React, { useEffect, useRef, useState } from 'react'
import { View, StyleSheet, Image, TouchableOpacity, Dimensions, Pressable, ScrollView } from 'react-native'
import moment from 'moment'
import { Text } from 'react-native-paper'
import Swiper from 'react-native-swiper'
import { ParamListBase, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

import { COLORS, FONT_COLORS } from '../../assets/styles/variables'
import SmallCard from './cards/SmallCard'
import ActivityCard from './cards/ActivityCard'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/Store'
import { getTodaySchedule } from '../../redux/slice/Schedule'
import useDispatch from '../../redux/UseDispatch'
import { useToast } from 'react-native-toast-notifications'
import { Slots } from '../../models/schedule/Slot'

type DayProps = {
  day: number,
  weekday: string,
  selected: boolean
}

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
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const swiper = useRef();
  const sampleData = ['MLN1', 'MLN2', 'MLN3'];

  const [currentDay, setCurrentDay] = useState(new Date());
  const [week, setWeek] = useState(0);
  const userInfo = useSelector((state: RootState) => state.auth.userDetail)
  const { data, error } = useSelector((state: RootState) => state.schedule)
  const dispatch = useDispatch();
  const toast = useToast();

  const weeks = React.useMemo(() => {
    const start = moment().add(week, 'weeks').startOf('week');

    return [-1, 0, 1].map(adj => {
      return Array.from({ length: 7 }).map((_, index) => {
        const date = moment(start).add(adj, 'week').add(index, 'day');

        return {
          weekday: date.format('ddd'),
          date: date.toDate(),
        };
      });
    });
  }, [week]);


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
  }, [])

  // useEffect(() => {
  //   if (error) {
  //     toast.show(`Error: ${error}`, { type: 'danger', duration: 1500 });
  //   }
  // }, [error]);

  useEffect(() => {
    if (data) {
      // toast.show('Welcome!', { type: 'success' });
      console.log("Data", data);
    }
  }, [data]);

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
            onPress={() => { navigation.navigate('ScheduleSwipe') }}
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
            loop={true}
            showsPagination={false}
            onIndexChanged={ind => {
              if (ind === 1) {
                return;
              }
              setTimeout(() => {
                const newIndex = ind - 1;
                const newWeek = week + newIndex;
                setWeek(newWeek);
                // setCurrentDay(moment(currentDay).add(newIndex, 'week').toDate());
                swiper.current!.scrollTo(1, false);
              }, 100);
            }}
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
          <Text style={styles.titleLabel}>Today Attendance</Text>
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
              <Text style={styles.titleTxt}>Subject Prepare</Text>
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
            <Text style={styles.titleLabel}>Today Activites | {data.length}</Text>
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
                    status='Upcoming'
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

const DayCard: React.FC<DayProps> = React.memo(({ day, weekday, selected }) => {
  const theme = selected ?
    {
      txtColor: '#FFF',
      subTxtColor: '#FFF',
      bgColor: '#0087FD'
    } : {
      txtColor: '#000',
      subTxtColor: '#000',
      bgColor: '#FFF'
    }

  return (
    <View style={[styles.dayCardCtn, { backgroundColor: theme.bgColor }]}>
      <Text style={{
        fontFamily: 'Lexend-Medium',
        fontSize: 16,
        color: theme.txtColor
      }}>{day}</Text>
      <Text style={{
        fontSize: 14,
        color: theme.subTxtColor
      }}>{weekday}</Text>
    </View>
  )
})

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
    // flexDirection: 'row',
    // flexWrap: 'wrap'
    // justifyContent: 'center'
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