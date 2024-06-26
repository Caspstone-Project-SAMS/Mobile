import React from 'react';
import { Text, TextProps } from 'react-native';

interface CustomTextProps extends TextProps {
    children: React.ReactNode;
}

const CustomText: React.FC<CustomTextProps> = ({ style, children, ...props }) => {
    return (
        <Text {...props} style={[style, { fontFamily: 'Lexend-Light' }]}>
            {children}
        </Text>
    );
};

export default CustomText;