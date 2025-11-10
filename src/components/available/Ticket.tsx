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
interface TicketData {
    _id: string;
    name: string;
    available: number;
    [key: string]: any;
}

interface TicketProps {
    data: TicketData;
    price: number;
    priceBased: string;
    onPress?: (data: TicketData) => void;
    style?: ViewStyle;
}

const Ticket: React.FC<TicketProps> = ({
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

    const ticketPrice = useCallback(() => {
        return translate(priceBased, 'slot_price', { 
            price: fomartCurrOut(price) 
        });
    }, [priceBased, price]);

    const ticketAvailability = useCallback(() => {
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
                    {data.name}
                </TextHeavy>
                <TextRegular style={[styles.datesMetaDetails, { color: colors.pText }]}>
                    {ticketPrice()}{ticketAvailability()}
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

export default Ticket;