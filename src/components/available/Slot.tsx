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
interface SlotData {
    _id: string;
    start: string;
    end: string;
    guests: number;
    [key: string]: any;
}

interface SlotProps {
    data: SlotData;
    price: number;
    priceBased: string;
    onPress?: (data: SlotData) => void;
    style?: ViewStyle;
}

const Slot: React.FC<SlotProps> = ({
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
            count: parseInt(String(data.guests), 10) 
        });
    }, [priceBased, data.guests]);

    return (
        <TouchableOpacity 
            style={[styles.datesMeta, { borderTopColor: colors.separator }, style]}
            onPress={handlePress}
            activeOpacity={0.7}
        >
            <View style={styles.datesMetaLeft}>
                <TextHeavy style={[styles.datesMetaTitle, { color: colors.tText }]}>
                    {data.start} - {data.end}
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

export default Slot;