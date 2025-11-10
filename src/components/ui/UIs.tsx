import React from 'react';
import { StyleSheet, View, TouchableOpacity, useColorScheme, ViewStyle, TextStyle } from 'react-native';
import getThemedColors from '../../helpers/Theme';
import TextMedium from './TextMedium';
import TextHeavy from './TextHeavy';
import { CheckMarkSvg } from '../icons/ButtonSvgIcons';

interface RadioBtnProps {
    status?: 'checked' | 'unchecked';
    onPress: () => void;
    style?: ViewStyle;
    children: React.ReactNode;
}

export const RadioBtn: React.FC<RadioBtnProps> = ({ status = 'unchecked', onPress, style, children }) => {
    const colors = getThemedColors(useColorScheme());
    const isChecked = status === 'checked';
    
    const radioStyle = [
        styles.radio,
        { borderColor: colors.separator },
        isChecked && {
            backgroundColor: colors.appColor,
            borderColor: colors.appColor,
        }
    ];
    
    const radioInStyle = [
        styles.radioIn,
        isChecked && styles.radioInChecked
    ];
    
    return (
        <View style={[styles.wrapper, style]}>
            <TouchableOpacity style={styles.button} onPress={onPress}>
                <TextMedium style={[styles.buttonText, { color: colors.tText }]}>
                    {children}
                </TextMedium>
                <View style={radioStyle}>
                    <View style={radioInStyle} />
                </View>
            </TouchableOpacity>
        </View>
    );
};

interface CheckboxBtnProps {
    status?: 'checked' | 'unchecked';
    onPress: () => void;
    style?: ViewStyle;
    children: React.ReactNode;
}

export const CheckboxBtn: React.FC<CheckboxBtnProps> = ({ status = 'unchecked', onPress, style, children }) => {
    const colors = getThemedColors(useColorScheme());
    const isChecked = status === 'checked';
    
    const checkboxStyle = [
        styles.checkbox,
        { borderColor: colors.separator },
        isChecked && {
            backgroundColor: colors.appColor,
            borderColor: colors.appColor,
        }
    ];
    
    return (
        <View style={[styles.wrapper, style]}>
            <TouchableOpacity style={styles.button} onPress={onPress}>
                <TextMedium style={[styles.buttonText, { color: colors.tText }]}>
                    {children}
                </TextMedium>
                <View style={checkboxStyle}>
                    {isChecked && <CheckMarkSvg color='#FFF' />}
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    } as ViewStyle,
    button: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
    } as ViewStyle,
    radio: {
        backgroundColor: '#F1F2F6',
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
    } as ViewStyle,
    radioIn: {
        backgroundColor: '#F1F2F6',
        width: 8,
        height: 8,
        borderRadius: 8,
    } as ViewStyle,
    radioInChecked: {
        backgroundColor: '#FFF',
    } as ViewStyle,
    checkbox: {
        backgroundColor: '#F1F2F6',
        width: 18,
        height: 18,
        borderRadius: 4,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
    } as ViewStyle,
    buttonText: {
        fontSize: 15,
    } as TextStyle,
});
