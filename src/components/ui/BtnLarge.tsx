import React from 'react';
import { StyleSheet, TouchableOpacity, useColorScheme, ViewStyle, TextStyle } from 'react-native';
import TextHeavy from './TextHeavy';
import getThemedColors from '../../helpers/Theme';

interface BtnLargeProps {
    onPress: () => void;
    disabled?: boolean;
    bordered?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    children: React.ReactNode;
}

const BtnLarge: React.FC<BtnLargeProps> = ({ 
    onPress, 
    disabled = false, 
    bordered = false, 
    style, 
    textStyle, 
    children 
}) => {
    const colors = getThemedColors(useColorScheme());
    
    const buttonStyle = [
        styles.button,
        { backgroundColor: colors.appColor },
        bordered && styles.buttonBordered,
        bordered && { borderColor: colors.appColor },
        style
    ];
    
    const textStyles = [
        styles.buttonText,
        bordered && { color: colors.appColor },
        textStyle
    ];
    
    return (
        <TouchableOpacity 
            style={buttonStyle} 
            onPress={onPress} 
            disabled={disabled}
        >
            <TextHeavy style={textStyles}>
                {children}
            </TextHeavy>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 8,
        justifyContent: 'center',
        paddingHorizontal: 30,
        paddingVertical: 8,
    } as ViewStyle,
    buttonBordered: {
        backgroundColor: 'transparent',
        borderWidth: 1,
    } as ViewStyle,
    buttonText: {
        color: '#FFF',
        fontSize: 15,
        lineHeight: 20,
        textAlign: 'center',
    } as TextStyle,
});

export default BtnLarge;