import React from 'react';
import { Text, TextProps, useColorScheme } from 'react-native';
import { decode } from 'html-entities';
import getThemedColors from '../../helpers/Theme';
import { boldFontFamily } from '../../constants/Colors';

interface TextBoldProps extends TextProps {
    children?: React.ReactNode;
}

const TextBold: React.FC<TextBoldProps> = ({ children, style, ...props }) => {
    const colors = getThemedColors(useColorScheme());
    
    const textValue = typeof children === 'string' || children instanceof String 
        ? children 
        : String(children || '');
    
    return (
        <Text 
            {...props} 
            style={[
                { fontFamily: boldFontFamily, color: colors.boldText }, 
                style
            ]}
        >
            {decode(textValue, { level: 'all' })}
        </Text>
    );
};

export default TextBold;