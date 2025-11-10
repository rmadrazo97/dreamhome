import React, { useState, useCallback } from 'react';
import { ThemeColors, Slot } from '../../types';
import {
    StyleSheet,
    View,
    useColorScheme,
    ViewStyle,
    TextStyle,
} from 'react-native';

import getThemedColors from '../../helpers/Theme';
import { translate } from '../../helpers/i18n';
import { fomartCurrOut } from '../../helpers/currency';
import TextRegular from '../ui/TextRegular';
import TextHeavy from '../ui/TextHeavy';
import Qtts from '../ui/Qtts';

// Types
interface TimeSlotsState {
    booked: any[];
}

interface TimeSlotsProps {
    slots: Slot[];
    apColors: ThemeColors;
    prices: any;
    onSelectSlots: (slots: any[]) => void;
    style?: ViewStyle;
}

const TimeSlots: React.FC<TimeSlotsProps> = ({ 
    slots, 
    apColors, 
    prices, 
    onSelectSlots, 
    style 
}) => {
    const [state, setState] = useState<TimeSlotsState>({
        booked: []
    });

    const onChangeQtt = useCallback((qtt: number, slot: Slot) => {
        const { booked } = state;
        const findIdx = booked.findIndex(bk => bk._id === slot._id);
        
        let updatedBooked;
        if (findIdx !== -1) {
            updatedBooked = [...booked];
            updatedBooked[findIdx] = {
                ...updatedBooked[findIdx],
                quantity: qtt,
                adults: qtt
            };
        } else {
            updatedBooked = [...booked, {
                _id: slot._id,
                quantity: qtt,
                adults: qtt,
                title: slot.time || `${(slot as any).start} - ${(slot as any).end}`,
                ...prices
            }];
        }

        onSelectSlots(updatedBooked);
        setState(prevState => ({ ...prevState, booked: updatedBooked }));
    }, [state, onSelectSlots, prices]);

    const getSlotQuantity = useCallback((slotId: string) => {
        const bookedSlot = state.booked.find(bk => bk._id === slotId);
        return bookedSlot ? bookedSlot.quantity : 0;
    }, [state.booked]);

    if (!slots || slots.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <TextRegular style={[styles.emptyText, { color: apColors.regularText }]}>
                    {translate('no_time_slots_available')}
                </TextRegular>
            </View>
        );
    }

    return (
        <View style={[styles.container, style]}>
            <View style={styles.inner}>
                {slots.map((slot, index) => {
                    const bQtt = getSlotQuantity(slot._id);
                    const adStyle = index > 0 ? {
                        marginTop: 15, 
                        paddingTop: 15, 
                        borderTopWidth: 1, 
                        borderTopColor: apColors.separator
                    } : {};
                    
                    return (
                        <TimeSlotItem
                            key={slot._id}
                            data={slot}
                            priceBased={prices}
                            prices={prices}
                            style={adStyle}
                            qtt={bQtt}
                            onChangeQtt={(qtt) => onChangeQtt(qtt, slot)}
                            apColors={apColors}
                        />
                    );
                })}
            </View>
        </View>
    );
};

// Child component for individual time slot
interface TimeSlotItemProps {
    data: Slot;
    priceBased: any;
    prices: any;
    style: any;
    qtt: number;
    onChangeQtt: (qtt: number) => void;
    apColors: ThemeColors;
}

const TimeSlotItem: React.FC<TimeSlotItemProps> = ({ 
    data, 
    priceBased, 
    prices, 
    style, 
    qtt, 
    onChangeQtt, 
    apColors: _apColors 
}) => {
    const colors = getThemedColors(useColorScheme());
    const { available } = data;
    const { price } = prices;

    return (
        <View style={[styles.childWrap, style]}>
            <View style={styles.datesMetaLeft}>
                <TextHeavy style={[styles.datesMetaTitle, { color: colors.tText }]}>
                    {data.time || `${(data as any).start} - ${(data as any).end}`}
                </TextHeavy>
                <TextRegular style={[styles.datesMetaDetails, { color: colors.addressText }]}>
                    {translate(priceBased, 'bk_slot_avai', { count: parseInt(String(available), 10) })}
                </TextRegular>
                <TextRegular style={[styles.datePrice, { color: colors.appColor }]}>
                    {fomartCurrOut(price)}
                </TextRegular>
            </View>
            <View style={styles.datesMetaRight}>
                <Qtts 
                    min={0} 
                    max={parseInt(String(available), 10)} 
                    onChange={onChangeQtt} 
                    value={qtt}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
    } as ViewStyle,
    inner: {
        // Container for slots
    } as ViewStyle,
    emptyContainer: {
        paddingVertical: 40,
        alignItems: 'center',
    } as ViewStyle,
    emptyText: {
        fontSize: 16,
    } as TextStyle,
    childWrap: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
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
        marginBottom: 4,
    } as TextStyle,
    datePrice: {
        fontSize: 13,
    } as TextStyle,
});

export default TimeSlots;