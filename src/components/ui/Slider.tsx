import React, { useState, useCallback, useMemo } from 'react';
import { StyleSheet, Text, View, ViewStyle, TextStyle } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { ThemeColors } from '../../types';

interface CustomSliderProps {
    min: number;
    max: number;
    values?: number | number[];
    onValuesChange?: (values: number[]) => void;
    apColors: ThemeColors;
    style?: ViewStyle;
}

const CustomSlider: React.FC<CustomSliderProps> = ({ 
    min, 
    max, 
    values, 
    onValuesChange, 
    apColors, 
    style 
}) => {
    const [multiSliderValue, setMultiSliderValue] = useState<number[]>(() => {
        if (values) {
            if (Array.isArray(values) && values.length === 2) {
                return [...values];
            } else {
                return [min, values as number];
            }
        }
        return [min, max];
    });

    const multiSliderValuesChange = useCallback((values: number[]) => {
        setMultiSliderValue(values);
        onValuesChange?.(values);
    }, [onValuesChange]);

    const [first, second] = multiSliderValue;

    const selectedStyle = useMemo(() => ({
        backgroundColor: apColors.appColor,
    }), [apColors.appColor]);

    const unselectedStyle = useMemo(() => ({
        backgroundColor: apColors.separator,
    }), [apColors.separator]);

    const markerStyle = useMemo(() => ({
        backgroundColor: apColors.appColor,
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#FFF',
    }), [apColors.appColor]);

    const pressedMarkerStyle = useMemo(() => ({
        backgroundColor: apColors.appColor,
        width: 24,
        height: 24,
        borderRadius: 12,
    }), [apColors.appColor]);

    return (
        <View style={[styles.container, style]}>
            <View style={styles.valuesContainer}>
                <Text style={[styles.valueText, { color: apColors.regularText }]}>
                    {first}
                </Text>
                <Text style={[styles.valueText, { color: apColors.regularText }]}>
                    {second}
                </Text>
            </View>
            
            <MultiSlider
                values={multiSliderValue}
                sliderLength={280}
                onValuesChange={multiSliderValuesChange}
                min={min}
                max={max}
                step={1}
                allowOverlap={false}
                snapped
                selectedStyle={selectedStyle}
                unselectedStyle={unselectedStyle}
                containerStyle={styles.sliderContainer}
                trackStyle={styles.trackStyle}
                markerStyle={markerStyle}
                pressedMarkerStyle={pressedMarkerStyle}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingVertical: 20,
    } as ViewStyle,
    valuesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 280,
        marginBottom: 20,
    } as ViewStyle,
    valueText: {
        fontSize: 16,
        fontWeight: 'bold',
    } as TextStyle,
    sliderContainer: {
        height: 40,
    } as ViewStyle,
    trackStyle: {
        height: 4,
        borderRadius: 2,
    } as ViewStyle,
});

export default CustomSlider;