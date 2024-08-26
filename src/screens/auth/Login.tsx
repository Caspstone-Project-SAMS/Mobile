import React, { useEffect, useState } from "react";
import { Image, Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TextInput, MD3Colors, Text as PaperTxt, Checkbox } from "react-native-paper";
import { COLORS, FONT_COLORS } from "../../assets/styles/variables";
import { DividerWithTxt } from "../../components/global/DividerWithTxt";
import { GLOBAL_STYLES } from "../../assets/styles/styles";
import CustomBtn from "../../components/global/CustomBtn";
import useDispatch from "../../redux/UseDispatch";
import { login, updateUser } from "../../redux/slice/Auth";
import { AsyncStorageHelpers } from "../../hooks/helpers/AsyncStorage";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/Store";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [isRemember, setIsRemember] = useState(false);
    const userInfo = useSelector((state: RootState) => state.auth);

    const dispatch = useDispatch()
    // const navigation = useNavigation()
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();


    const [focusInput, setFocusInput] = useState<string | undefined>();
    const handleLogin = async () => {
        await dispatch(login({ username: email, password, isRemember }));
    };

    const handleSendEmail = () => {
        const recipient = 'ducnhhse161458@fpt.edu.vn';
        const subject = 'Create Account For SAMS Application';
        const body = `Your name: \nYour email: \nYour phone number: `;

        const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        Linking.openURL(mailtoUrl).catch(err => console.error('Error:', err));
    };

    // redirect to home if session valid - 7days
    useEffect(() => {
        const autoLogin = async () => {
            const currentTime = new Date().getTime();
            const oldSession = await AsyncStorageHelpers.getObjData('session');
            if (oldSession) {
                const { expiredTime } = JSON.parse(oldSession);
                if (expiredTime >= currentTime) {
                    dispatch(updateUser())
                }
            } else {
                AsyncStorageHelpers.removeValue('userAuth');
                AsyncStorageHelpers.removeValue('session');
            }
        }
        autoLogin();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image
                    source={require('../../assets/imgs/logo_cut-removebg-preview.png')}
                    style={{
                        width: 100,
                        height: 100,
                    }}
                />
                <Text style={styles.title}>
                    Welcome back 👋 {'\n'}
                    to <Text style={styles.specialTxt} onPress={() => console.log("Onclick sams")}>SAMS</Text>
                </Text>
                <Text style={styles.blurTxt}>Hello there, login to continue</Text>
            </View>
            <View style={styles.body}>
                <TextInput
                    mode="outlined"
                    label='Email'
                    placeholder="Email"
                    outlineStyle={focusInput === 'email'
                        ? styles.outlineInputFocus
                        : styles.defaultOutline}
                    onFocus={() => setFocusInput('email')}
                    onBlur={() => setFocusInput(undefined)}
                    style={[styles.input, { marginTop: 10, backgroundColor: "#FFF" }]}
                    theme={{
                        colors: {
                            primary: COLORS.skyBlue,
                            text: FONT_COLORS.greyFontColor,
                        },
                    }}
                    onChangeText={val => setEmail(val)}
                />
                <TextInput
                    mode="outlined"
                    label='Password'
                    placeholder="Password"
                    secureTextEntry={secureTextEntry}
                    style={[styles.input, { backgroundColor: "#FFF" }]}
                    outlineStyle={
                        focusInput === 'password'
                            ? styles.outlineInputFocus
                            : styles.defaultOutline
                    }
                    onFocus={() => setFocusInput('password')}
                    onBlur={() => setFocusInput(undefined)}
                    theme={{
                        colors: {
                            primary: COLORS.skyBlue,
                            text: FONT_COLORS.greyFontColor
                        }
                    }}
                    onChangeText={val => setPassword(val)}
                    right={
                        <TextInput.Icon
                            icon={secureTextEntry ? 'eye-off-outline' : 'eye-outline'}
                            color={MD3Colors.primary0}
                            onPress={() => setSecureTextEntry(!secureTextEntry)}
                        />
                    }
                />
                <View style={styles.moreActionLogin}>
                    <View style={GLOBAL_STYLES.horizontalBetweenCenter}>
                        <Checkbox
                            status={isRemember ? 'checked' : 'unchecked'}
                            onPress={() => {
                                setIsRemember(!isRemember);
                            }}
                            color="#2563EB"
                        />
                        <Text>Remember me</Text>
                    </View>
                    <TouchableOpacity
                        style={{
                            marginVertical: 20,
                        }}
                        onPress={() => { navigation.navigate('FORGOT_PASSWORD') }}
                    >
                        <PaperTxt style={styles.forgotPassTxt}>Forgot Password?</PaperTxt>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => handleLogin()}
                >
                    <CustomBtn text="Login" />
                </TouchableOpacity>

                <DividerWithTxt customStyle={styles.divider} color={FONT_COLORS.blurFontColor} text="Or continue with Google account" />

                <TouchableOpacity>
                    <CustomBtn
                        text="Google"
                        key={'ggBtn'}
                        customStyle={styles.ggBtn}
                        icon={
                            <Image style={{ width: 30, height: 30, marginRight: 7 }} source={{ uri: 'https://cdn-icons-png.freepik.com/512/281/281764.png?ga=GA1.1.1218810189.1708404630' }} />
                        }
                        colorTxt={{ color: FONT_COLORS.greyFontColor }}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.footerCtn}>
                <PaperTxt>
                    Didn't have an account? {' '}
                </PaperTxt>
                <TouchableOpacity style={{ display: 'flex', alignItems: 'center' }}
                    onPress={() => handleSendEmail()}
                >
                    <PaperTxt style={{ color: COLORS.skyBase, textAlignVertical: 'center' }}>Contact Us!</PaperTxt>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#FFF'
    },
    header: {
        paddingTop: 5,
        paddingBottom: 10
    },
    title: {
        fontSize: 27,
        fontWeight: '500'
    },
    specialTxt: {
        color: '#0087fe',
    },
    blurTxt: {
        color: '#bcbcbc'
    },
    body: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    input: {
        marginTop: 10,
        width: 'auto',
        backgroundColor: '#f1f4ff',
        paddingHorizontal: 8,
    },
    moreActionLogin: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    outlineInputFocus: {
        borderColor: COLORS.skyBase,
        borderRadius: 10
    },
    defaultOutline: {
        borderRadius: 10
    },
    forgotPassTxt: {
        color: COLORS.skyBase,
        textAlign: 'right',
    },
    divider: {
        paddingVertical: 20
    },
    loginBtn: {
        borderRadius: 10,
        paddingVertical: 5
    },
    ggBtn: {
        borderWidth: 1,
        borderColor: COLORS.borderColor,
        backgroundColor: '#FFF'
    },
    footerCtn: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'auto',
    },
});   
