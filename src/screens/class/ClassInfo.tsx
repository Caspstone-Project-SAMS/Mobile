import { Image, ImageSourcePropType, StyleSheet, View } from 'react-native'
import React from 'react'
import { Avatar, Card, IconButton, Text } from 'react-native-paper'
import Title from '../../components/Title'
import { FONT_COLORS } from '../../assets/styles/variables'
import { GLOBAL_STYLES } from '../../assets/styles/styles'

type SectionChip = {
    label: string,
    icon: ImageSourcePropType,
    info: string
}
const SectionDetailChip: React.FC<SectionChip> = ({ icon, info, label }) => {
    return (
        <View style={styles.detailSection}>
            <Text style={{ color: FONT_COLORS.blurFontColor }}>{label}</Text>
            <View style={[GLOBAL_STYLES.card, { padding: 8, gap: 5, flexDirection: 'row', alignItems: 'center' }]}>
                <Image
                    source={icon}
                    style={{ width: 24, height: 24 }}
                />
                <Text>{info}</Text>
            </View>
        </View>
    )
}

const ClassInfo = ({ route, navigation }) => {
    const { classData: { classCode, classID, classStatus, room, semester, subject } } = route.params

    return (
        <View style={styles.container}>
            <Title title={`${classCode}`} navigation={navigation} />
            <View>
                <Text style={styles.label}>Detail</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                    <SectionDetailChip
                        label='Student number:'
                        icon={require('../../assets/imgs/student_raising_hand.png')}
                        info='28'
                        key={`studentNum`}
                    />

                    <SectionDetailChip
                        label='Class status:'
                        icon={require('../../assets/icons/status_icon.png')}
                        info='On Going'
                        key={`classStatus`}
                    />

                    <SectionDetailChip
                        label='Subject:'
                        icon={require('../../assets/icons/book_icon.png')}
                        info='IOT102T'
                        key={`classSubject`}
                    />

                    <SectionDetailChip
                        label='Semester:'
                        icon={require('../../assets/icons/semester_icon.png')}
                        info='SU24'
                        key={`classSemester`}
                    />
                </View>
            </View>
        </View>
    )
}

export default ClassInfo

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
        paddingBottom: 15,
        paddingHorizontal: 20,
        backgroundColor: '#FFF',
    },
    label: {
        fontSize: 18,
        color: FONT_COLORS.greyFontColor,
        fontFamily: 'Lexend-Regular'
    },
    detailSection: {
        gap: 5,
        width: '45%',
        marginTop: 10
    }
})