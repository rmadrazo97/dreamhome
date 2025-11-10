import React, { useCallback } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    ViewStyle,
    TextStyle
} from 'react-native';

import { translate } from '../../helpers/i18n';
import TextRegular from '../ui/TextRegular';
import TextHeavy from '../ui/TextHeavy';
import { ThemeColors } from '../../types';

// Types
interface QuantityProps {
    value: number;
    max?: number;
    min?: number;
    apColors: ThemeColors;
    onChange: (value: number) => void;
}

const Quantity: React.FC<QuantityProps> = ({ 
    value, 
    max = 10, 
    min = 0, 
    apColors, 
    onChange 
}) => {
    const handleDecrease = useCallback(() => {
        if (value > min) {
            onChange(value - 1);
        }
    }, [value, min, onChange]);

    const handleIncrease = useCallback(() => {
        if (value < max) {
            onChange(value + 1);
        }
    }, [value, max, onChange]);

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[
                    styles.button,
                    {
                        backgroundColor: value <= min ? apColors.separator : apColors.appColor,
                        borderColor: apColors.appColor
                    }
                ]}
                onPress={handleDecrease}
                disabled={value <= min}
            >
                <TextHeavy style={[
                    styles.buttonText,
                    { 
                        color: value <= min ? apColors.addressText : '#FFF' 
                    }
                ]}>
                    -
                </TextHeavy>
            </TouchableOpacity>

            <View style={[styles.valueContainer, { borderColor: apColors.separator }]}>
                <TextHeavy style={[styles.valueText, { color: apColors.hText }]}>
                    {value}
                </TextHeavy>
            </View>

            <TouchableOpacity
                style={[
                    styles.button,
                    {
                        backgroundColor: value >= max ? apColors.separator : apColors.appColor,
                        borderColor: apColors.appColor
                    }
                ]}
                onPress={handleIncrease}
                disabled={value >= max}
            >
                <TextHeavy style={[
                    styles.buttonText,
                    { 
                        color: value >= max ? apColors.addressText : '#FFF' 
                    }
                ]}>
                    +
                </TextHeavy>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    } as ViewStyle,
    button: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    } as ViewStyle,
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
    } as TextStyle,
    valueContainer: {
        width: 60,
        height: 40,
        borderWidth: 1,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10,
    } as ViewStyle,
    valueText: {
        fontSize: 16,
        fontWeight: 'bold',
    } as TextStyle,
});

export default Quantity;