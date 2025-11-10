import React from 'react';
import { Text, TextProps, useColorScheme } from 'react-native';
import { decode } from 'html-entities';
import getThemedColors from '../../helpers/Theme';
import { mediumFontFamily } from '../../constants/Colors';

interface TextMediumProps extends TextProps {
    children?: React.ReactNode;
}

const TextMedium: React.FC<TextMediumProps> = ({ children, style, ...props }) => {
    const colors = getThemedColors(useColorScheme());
    
    const textValue = typeof children === 'string' || children instanceof String 
        ? children 
        : String(children || '');
    
    return (
        <Text 
            {...props} 
            style={[
                { fontFamily: mediumFontFamily, color: colors.mediumText }, 
                style
            ]}
        >
            {decode(textValue, { level: 'all' })}
        </Text>
    );
};

export default TextMedium;