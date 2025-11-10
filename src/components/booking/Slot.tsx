import React, { useCallback } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    useColorScheme,
    ViewStyle,
    TextStyle,
} from 'react-native';
import getThemedColors from '../../helpers/Theme';
import TextRegular from '../ui/TextRegular';
import TextHeavy from '../ui/TextHeavy';
import Qtts from '../ui/Qtts';

// Types
interface SlotData {
    _id: string;
    start: string;
    end: string;
    guests: number;
    [key: string]: any;
}

interface SlotProps {
    data: SlotData;
    onSelectSlot?: (value: number) => void;
    qtt?: number;
    style?: ViewStyle;
}

const Slot: React.FC<SlotProps> = ({ 
    data, 
    onSelectSlot, 
    qtt = 0, 
    style 
}) => {
    const colors = getThemedColors(useColorScheme());

    const handleQuantityChange = useCallback((value: number) => {
        if (onSelectSlot) {
            onSelectSlot(value);
        }
    }, [onSelectSlot]);

    const handleSlotPress = useCallback(() => {
        if (onSelectSlot) {
            onSelectSlot(qtt || 0);
        }
    }, [onSelectSlot, qtt]);

    return (
        <TouchableOpacity 
            style={[styles.datesMeta, style]} 
            onPress={handleSlotPress}
            activeOpacity={0.7}
        >
            <View style={styles.datesMetaLeft}>
                <TextHeavy style={[styles.datesMetaTitle, { color: colors.tText }]}>
                    {data.start} - {data.end}
                </TextHeavy>
                <TextRegular style={[styles.datesMetaDetails, { color: colors.addressText }]}>
                    Available: {data.guests}
                </TextRegular>
            </View>
            <View style={styles.datesMetaRight}>
                <Qtts 
                    min={0} 
                    max={data.guests} 
                    onChange={handleQuantityChange} 
                    value={qtt}
                />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    datesMeta: {
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    } as ViewStyle,
    datesMetaLeft: {
        flex: 1,
    } as ViewStyle,
    datesMetaRight: {
        marginLeft: 15,
    } as ViewStyle,
    datesMetaTitle: {
        fontSize: 15,
        marginBottom: 5,
    } as TextStyle,
    datesMetaDetails: {
        fontSize: 13,
    } as TextStyle,
});

export default Slot;