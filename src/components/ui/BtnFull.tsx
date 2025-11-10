import React from 'react';
import { StyleSheet, View, TouchableOpacity, useColorScheme, ViewStyle, TextStyle } from 'react-native';
import TextHeavy from './TextHeavy';
import getThemedColors from '../../helpers/Theme';

interface BtnFullProps {
    onPress: () => void;
    disabled?: boolean;
    style?: ViewStyle;
    children: React.ReactNode;
}

const BtnFull: React.FC<BtnFullProps> = ({ onPress, disabled = false, style, children }) => {
    const colors = getThemedColors(useColorScheme());
    
    return (
        <View style={[styles.wrapper, style]}>
            <TouchableOpacity 
                style={[styles.button, { backgroundColor: colors.appColor }]} 
                onPress={onPress} 
                disabled={disabled}
            >
                <TextHeavy style={styles.buttonText}>
                    {children}
                </TextHeavy>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {} as ViewStyle,
    button: {
        height: 44,
        borderRadius: 8,
        justifyContent: 'center',
    } as ViewStyle,
    buttonText: {
        color: '#fff',
        fontSize: 17,
        textAlign: 'center',
    } as TextStyle,
});

export default BtnFull;