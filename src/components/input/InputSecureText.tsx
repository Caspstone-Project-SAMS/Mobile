import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { TextInput } from 'react-native-paper';
import { COLORS } from '../../assets/styles/variables';

type props = {
    label: string,
    placeholder: string,
    setSecureText: Dispatch<SetStateAction<string>>
}

const InputSecureText: React.FC<props> = ({ label, setSecureText, placeholder }) => {
    const [secureTextEntry, setSecureTextEntry] = useState(true);

    const toggleSecureEntry = () => {
        setSecureTextEntry((prev) => !prev);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.labelTitle}>Type password</Text>
            <TextInput
                mode="outlined"
                label={label}
                activeOutlineColor={COLORS.skyBase}
                placeholder={placeholder ? placeholder : 'Nhập mật khẩu...'}
                outlineStyle={styles.inputOutline}
                secureTextEntry={secureTextEntry}
                style={{ backgroundColor: '#f1f4ff' }}
                right={
                    <TextInput.Icon
                        icon={secureTextEntry ? 'eye-off-outline' : 'eye-outline'}
                        color={'black'}
                        onPress={toggleSecureEntry}
                    />
                }
                //Passing set props
                onChangeText={setSecureText}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20
    },
    labelTitle: {
        fontSize: 14,
        marginBottom: 4,
        color: 'black',
        fontWeight: '500'
    },
    inputOutline: {
        borderRadius: 10
    }
});

export default InputSecureText;
