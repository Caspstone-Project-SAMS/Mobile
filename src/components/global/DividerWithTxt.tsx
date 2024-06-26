import { StyleSheet, View, ViewStyle } from "react-native";
import { Text } from "react-native-paper";

interface DividerWithTextProps {
    text: string;
    color: string;
    customStyle?: ViewStyle,
}

export const DividerWithTxt: React.FC<DividerWithTextProps> = ({ text, color, customStyle }) => {
    const style = customStyle ? customStyle : {}
    return (
        <View style={[styles.container, style]}>
            <View style={[styles.line, { backgroundColor: color }]} />
            <Text style={[styles.text, { color: color }]}>{text}</Text>
            <View style={[styles.line, { backgroundColor: color }]} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10
    },
    line: {
        flex: 1,
        height: 1,
    },
    text: {
        marginHorizontal: 10,
        fontSize: 16,
    },
});