import React, { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-paper";

const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image
                    source={require('../../assets/imgs/logo_cut_close.png')}
                    style={{
                        // width: 150,
                        // height: 150,
                        // justifyContent: 'center'
                    }}
                />
                <Text style={styles.title}>
                    Welcome back 👋 {'\n'}
                    to <Text style={styles.specialTxt}>SAMS</Text>
                </Text>
                <Text style={styles.blurTxt}>Hello there, login to continue</Text>
            </View>
            <View>
                <TextInput
                    placeholder="Email"
                    label='Email'
                    mode="outlined"
                    style={[styles.input, { marginTop: 10 }]}
                    value={email}
                // onChangeText={handleEmailChange}
                />

                <TextInput
                    placeholder="Password"
                    style={styles.input}
                    secureTextEntry
                    value={password}
                // onChangeText={handlePasswordChange}
                />
            </View>
        </View>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 15
    },
    header: {

    },
    title: {
        // color: '#0f1317',
        fontSize: 27,
        fontWeight: '500'
    },
    specialTxt: {
        color: '#0087fe',
    },
    blurTxt: {
        color: '#bcbcbc'
    },
    input: {
        marginTop: 25,
        width: 350,
        backgroundColor: '#f1f4ff',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        paddingHorizontal: 20
    },
});   
