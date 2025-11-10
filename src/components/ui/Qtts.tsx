import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, useColorScheme, ViewStyle, TextStyle } from 'react-native';
import TextRegular from './TextRegular';
import TextHeavy from './TextHeavy';
import getThemedColors from '../../helpers/Theme';
import { formatInt } from '../../helpers/currency';

interface QttsProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    style?: ViewStyle;
}

const Qtts: React.FC<QttsProps> = ({ value, onChange, min = 0, max = 1, style }) => {
    const [currentValue, setCurrentValue] = useState(value);
    const colors = getThemedColors(useColorScheme());
    
    const formattedMin = formatInt(min);
    const formattedMax = formatInt(max);
    
    const handlePress = useCallback((isDecrement: boolean) => {
        let newValue = currentValue;
        
        if (isDecrement) {
            if (currentValue > formattedMin) {
                newValue = currentValue - 1;
            }
        } else {
            if (currentValue < formattedMax) {
                newValue = currentValue + 1;
            }
        }
        
        if (newValue !== currentValue) {
            setCurrentValue(newValue);
            onChange(newValue);
        }
    }, [currentValue, formattedMin, formattedMax, onChange]);
    
    useEffect(() => {
        setCurrentValue(value);
    }, [value]);
    
    const isMinDisabled = currentValue <= formattedMin;
    const isMaxDisabled = currentValue >= formattedMax;
    
    const minButtonStyle = isMinDisabled ? { opacity: 0.3 } : {};
    const maxButtonStyle = isMaxDisabled ? { opacity: 0.3 } : {};
    
    return (
        <View style={[styles.wrapper, style]}>
            <View style={styles.inner}>
                <TouchableOpacity 
                    style={[
                        styles.btns, 
                        { borderColor: colors.appColor }, 
                        minButtonStyle
                    ]} 
                    onPress={() => handlePress(true)} 
                    disabled={isMinDisabled}
                >
                    <TextRegular style={[styles.btnText, { color: colors.appColor }]}>
                        -
                    </TextRegular>
                </TouchableOpacity>
                
                <TextHeavy style={styles.qttText}>
                    {currentValue}
                </TextHeavy>
                
                <TouchableOpacity 
                    style={[
                        styles.btns, 
                        { borderColor: colors.appColor }, 
                        maxButtonStyle
                    ]} 
                    onPress={() => handlePress(false)} 
                    disabled={isMaxDisabled}
                >
                    <TextRegular style={[styles.btnText, { color: colors.appColor, lineHeight: 23, fontSize: 20 }]}>
                        +
                    </TextRegular>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {} as ViewStyle,
    inner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    } as ViewStyle,
    btns: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    } as ViewStyle,
    qttText: {
        marginLeft: 10,
        marginRight: 10,
        fontSize: 15,
        lineHeight: 24,
        width: 30,
        textAlign: 'center',
    } as TextStyle,
    btnText: {
        fontSize: 24,
        lineHeight: 23,
        textAlignVertical: 'center',
    } as TextStyle,
});

export default Qtts;