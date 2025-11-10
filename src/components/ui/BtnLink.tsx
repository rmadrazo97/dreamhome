import React from 'react';
import { StyleSheet, TouchableOpacity, useColorScheme, ViewStyle, TextStyle } from 'react-native';
import TextRegular from './TextRegular';
import getThemedColors from '../../helpers/Theme';

interface BtnLinkProps {
    onPress: () => void;
    disabled?: boolean;
    center?: boolean;
    size?: number;
    textStyle?: TextStyle;
    style?: ViewStyle;
    children: React.ReactNode;
}

const BtnLink: React.FC<BtnLinkProps> = ({ 
    onPress, 
    disabled = false, 
    center = false, 
    size, 
    textStyle, 
    style, 
    children 
}) => {
    const colors = getThemedColors(useColorScheme());
    
    const wrapperStyle = [
        styles.wrapper,
        center && { alignItems: 'center' },
        style
    ];
    
    const textStyles = [
        styles.buttonText,
        { color: colors.appColor },
        size && { fontSize: size },
        textStyle
    ];
    
    return (
        <TouchableOpacity 
            style={wrapperStyle} 
            onPress={onPress} 
            disabled={disabled}
        >
            <TextRegular style={textStyles}>
                {children}
            </TextRegular>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        paddingVertical: 10,
        paddingHorizontal: 15,
    } as ViewStyle,
    buttonText: {
        fontSize: 17,
        lineHeight: 22,
    } as TextStyle,
});

export default BtnLink;