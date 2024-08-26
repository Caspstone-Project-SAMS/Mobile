import { ScrollView, StyleSheet, View } from 'react-native'
import React from 'react'
import Title from '../../components/Title'
import { Text } from 'react-native-paper'
import { FONT_COLORS } from '../../assets/styles/variables'

const UnOrderItem: React.FC<{ text: string }> = ({ text }) => {
    return (
        <View style={styles.listItem}>
            <Text style={styles.bullet}>{'\u2022'}</Text>
            <Text style={styles.itemText}>{text}</Text>
        </View>
    )
}

const PrivatePolicy = ({ navigation }) => {
    return (
        <ScrollView style={styles.container}>
            <Title title='Privacy Policy' navigation={navigation} />
            <View>
                <Text style={[styles.subTxt, { marginVertical: 4 }]}>Last update: 26/08/2024</Text>
                <Text style={styles.description}>
                    We at Student Attendance Management System (SAMS) (SAMS Team, we are final year students doing our project at FPT University, guided by FPT lecturers.) are committed to protecting your privacy and providing you with concise, transparent ,and easily accessible information about your information and personal data.
                </Text>
            </View>
            <View>
                <Text style={styles.title}>This Privacy Policy details how we collect, use and share your information which may include personally identifiable information (“Personal Data”) when you use the Services.</Text>
                <Text style={styles.description}>
                    As you review our policy, keep in mind that it applies to all SAMS products and services that do not have a separate privacy policy or that link to this policy, which we call the “SAMS Services” or “Services.”

                    Please read this Privacy Policy carefully. By accessing or using our Services or otherwise manifesting your assent to this Privacy Policy, you are acknowledging that you have read and agree to this Privacy Policy, and our Terms of Service and Copyright Policy, which are incorporated herein by this reference. Terms not defined in this Privacy Policy shall have the meaning set forth in our Terms of Service.
                </Text>

                <Text style={styles.title}>1. What Kinds Of Information Do We Collect?</Text>

                <Text style={styles.subTitle}>Information you Provide us with</Text>
                <Text style={styles.description}>
                    We collect the content and other information you provide when you use our Services, including when you create an account and update your information. For example: When you create an account you included your email, when update you can add or change your display name or photos, phone number at any time, and receive notifications relating to your preferences, information about schedules and abnormal cases. However, please keep in mind certain aspects of the Services may not function properly or as intended unless you register and create an account.
                </Text>

                <Text style={styles.subTitle}>Device Information</Text>
                <Text style={styles.description}>
                    We collect information from or about the computers, phones, or other devices where you install or access our Services, depending on the permissions you've granted. We may associate the information we collect from your different devices, which helps us provide consistent Services across your devices. Here are some examples of the device information we collect:
                </Text>
                <Text style={styles.description}>
                    <UnOrderItem
                        text='Attributes such as the operating system, file and software names and types, signal strength, and device identifiers.'
                    />
                    <UnOrderItem
                        text='Connection information such as the name, browser type, language and time zone'
                    />
                </Text>
            </View>
        </ScrollView>
    )
}

export default PrivatePolicy

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 15,
        paddingHorizontal: 20,
        backgroundColor: '#FFF'
    },
    title: {
        fontSize: 16,
        fontFamily: 'Lexend-Regular',
        color: FONT_COLORS.blueFontColor,
        marginTop: 15,
        marginBottom: 6
    },
    subTitle: {
        fontSize: 14,
        fontFamily: 'Lexend-Light',
        color: FONT_COLORS.blueFontColor,
        marginVertical: 4
    },
    description: {

    },
    subTxt: {
        color: FONT_COLORS.blurFontColor
    },
    //Unorder list item
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    bullet: {
        fontSize: 18,
        marginRight: 10,
    },
    itemText: {
        fontSize: 14,
    },
})