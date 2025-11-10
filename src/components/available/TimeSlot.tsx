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
import { fomartCurrOut } from '../../helpers/currency';
import { translate } from '../../helpers/i18n';
import TextRegular from '../ui/TextRegular';
import TextHeavy from '../ui/TextHeavy';

// Types
interface TimeSlotData {
    _id: string;
    time: string;
    available: number;
    [key: string]: any;
}

interface TimeSlotProps {
    data: TimeSlotData;
    price: number;
    priceBased: string;
    onPress?: (data: TimeSlotData) => void;
    style?: ViewStyle;
}

const TimeSlot: React.FC<TimeSlotProps> = ({
    data,
    price,
    priceBased,
    onPress,
    style
}) => {
    const colors = getThemedColors(useColorScheme());

    const handlePress = useCallback(() => {
        if (onPress) {
            onPress(data);
        }
    }, [onPress, data]);

    const slotPrice = useCallback(() => {
        return translate(priceBased, 'slot_price', { 
            price: fomartCurrOut(price) 
        });
    }, [priceBased, price]);

    const slotAvailability = useCallback(() => {
        return translate(priceBased, 'slot_available', { 
            count: parseInt(String(data.available), 10) 
        });
    }, [priceBased, data.available]);

    return (
        <TouchableOpacity 
            style={[styles.datesMeta, { borderTopColor: colors.separator }, style]}
            onPress={handlePress}
            activeOpacity={0.7}
        >
            <View style={styles.datesMetaLeft}>
                <TextHeavy style={[styles.datesMetaTitle, { color: colors.tText }]}>
                    {data.time}
                </TextHeavy>
                <TextRegular style={[styles.datesMetaDetails, { color: colors.pText }]}>
                    {slotPrice()}{slotAvailability()}
                </TextRegular>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    datesMeta: {
        paddingVertical: 10,
        borderTopWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    } as ViewStyle,
    datesMetaLeft: {
        flex: 1,
    } as ViewStyle,
    datesMetaTitle: {
        fontSize: 15,
        marginBottom: 5,
    } as TextStyle,
    datesMetaDetails: {
        fontSize: 13,
    } as TextStyle,
});

export default TimeSlot;