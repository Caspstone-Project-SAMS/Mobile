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
                    We at Student Attendance Management System (SAMS) (SAMS Team, we are final year students doing our project at FPT University, guided by FPT lecturers.) are committed to protecting your privacy and providing you with concise, transparent ,and easily accessible information about your information and personal data. {'\n'}While starting the journey of project development, due to lack of experience, it is very likely that errors will occur during the usage process. We will try our best to limit this situation and hope you will forgive us if any mistakes occur.
                </Text>
            </View>
            <View style={{ marginBottom: 50 }}>
                <Text style={styles.title}>This Privacy Policy details how we collect, use and share your information which may include personally identifiable information (“Personal Data”) when you use the Services.</Text>
                <Text style={styles.description}>
                    As you review our policy, keep in mind that it applies to all SAMS products and services that do not have a separate privacy policy or that link to this policy, which we call the “SAMS Services” or “Services.”

                    Please read this Privacy Policy carefully. By accessing or using our Services or otherwise manifesting your assent to this Privacy Policy, you are acknowledging that you have read and agree to this Privacy Policy, and our Terms of Service and Copyright Policy, which are incorporated here in by this reference. Terms not defined in this Privacy Policy shall have the meaning set forth in our Terms of Service.
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
                <View style={{ width: 'auto' }}>
                    <UnOrderItem
                        text='Attributes such as the operating system, file and software names and types, signal strength, and device identifiers.'
                    />
                    <UnOrderItem
                        text='Connection information such as the name, browser type, language and time zone.'
                    />
                    <UnOrderItem
                        text='Our Services do not collect precise information about your location.'
                    />
                </View>

                <Text style={styles.subTitle}>Images--EXIF Data</Text>
                <Text style={styles.description}>
                    When you upload images onto our Services, please note that we will not remove the EXIF data that is contained in those images. EXIF is short for Exchangeable Image File Format, which is a standard that defines specific information related to an image or other media captured by a digital camera, containing information on the image such as shutter speed, camera exposure, date and time the image was taken and even GPS location. We will not use the EXIF data, but when you upload the images, you understand that the EXIF data will be stored by us as part of the images
                </Text>

                <Text style={styles.subTitle}>Information from IOT Device Sources</Text>
                <Text style={styles.description}>
                    We can receive information from other sources about your use of SAMS Services. For example, if you register fingerprint thourgh our IOT devices, then IOT devices will send your fingerprint data, which is encrypted and securely store. We do not sell, trade, or share your fingerprint data with any third parties. Your privacy is important to us, and we are committed to ensuring that your biometric data is not used for any purpose other than attendance management.
                </Text>

                <Text style={styles.title}>2. How is Collected Information Used?</Text>
                <Text style={styles.subTitle}>Providing Services</Text>
                <Text style={styles.description}>
                    We use the information to provide Services, Students can mark their attendance in real-time using the fingerprint scanner. The system immediately processes and records the attendance.
                    We manage student records, class schedules, and related academic information to ensure that the educational process is smooth and well-organized.
                    The system integrates with IOT modules to provide additional features such as config data for module and mark attendance in classrooms.
                </Text>

                <Text style={styles.subTitle}>Product research and development</Text>
                <Text style={styles.description}>
                    We use the information we have to develop, test and improve our Services, including but not limited to conducting surveys, research, testing, troubleshooting new products and features. We may use information such as customer demographics, schedules,... based on the data you provided to us, such as the number of “attendance status” of every schedule for a specific report generated.
                </Text>

                <Text style={styles.title}>3. How is Collected Information Shared?</Text>
                <Text style={styles.description}>
                    We do not sell, trade, or share your fingerprint data with any third parties. Your privacy is important to us, and we are committed to ensuring that your biometric data is not used for any purpose other than attendance management.
                </Text>

                <Text style={styles.title}>4. Contact Us</Text>
                <Text style={styles.description}>
                    Team members:
                </Text>
                <View>
                    <UnOrderItem text='Lê Đăng Khoa (IOT and BE): khoaldse161404@fpt.edu.vn' />
                    <UnOrderItem text='Nguyễn Hồ Hồng Đức (Web and Mobile - FE): ducnhhse161458@fpt.edu.vn' />
                    <UnOrderItem text='Trần Thái Quốc (BE): quocttse151503@fpt.edu.vn' />
                    <UnOrderItem text='Lê Hoàng Việt (Web - FE): vietlhse151177@fpt.edu.vn' />
                </View>
            </View>
        </ScrollView>
    )
}

export default PrivatePolicy

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 15,
        paddingHorizontal: 20,
        paddingBottom: 40,
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
        width: 'auto',
        marginBottom: 5,
        flexWrap: 'wrap'
    },
    bullet: {
        fontSize: 18,
        marginRight: 10,
    },
    itemText: {
        fontSize: 14,
        flex: 1,
        flexWrap: 'wrap'
    },
})