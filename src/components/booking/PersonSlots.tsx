import React, { useState, useCallback } from 'react';
import { ThemeColors, Slot } from '../../types';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    useColorScheme,
    ViewStyle,
    TextStyle,
} from 'react-native';

import getThemedColors from '../../helpers/Theme';
import { translate } from '../../helpers/i18n';
import { formatInt, formatFloat, fomartCurrOut } from '../../helpers/currency';
import Person from './Person';
import TextRegular from '../ui/TextRegular';
import TextHeavy from '../ui/TextHeavy';

// Types
interface PersonSlotsState {
    booked: any[];
}

interface PersonSlotsProps {
    data: Slot[];
    apColors: ThemeColors;
    priceBased: any;
    prices: any;
    onSelectItems: (items: any[]) => void;
    style?: ViewStyle;
}

const PersonSlots: React.FC<PersonSlotsProps> = ({ 
    data, 
    apColors, 
    priceBased, 
    prices, 
    onSelectItems, 
    style 
}) => {
    const [state, setState] = useState<PersonSlotsState>({
        booked: []
    });

    const onSelectPersons = useCallback((persons: any, item: Slot) => {
        const { adults, children, infants } = persons;
        const { booked } = state;
        const findIdx = booked.findIndex(bk => bk._id === item._id);
        
        let updatedBooked;
        if (findIdx !== -1) {
            updatedBooked = [...booked];
            updatedBooked[findIdx] = {
                ...updatedBooked[findIdx],
                quantity: 1,
                adults,
                children,
                infants
            };
        } else {
            updatedBooked = [...booked, {
                _id: item._id,
                quantity: 1,
                adults,
                children,
                infants,
                title: item.time || `${item.start} - ${item.end}`,
            }];
        }

        onSelectItems(updatedBooked);
        setState(prevState => ({ ...prevState, booked: updatedBooked }));
    }, [state.booked, onSelectItems]);

    if (!data || data.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <TextRegular style={[styles.emptyText, { color: apColors.regularText }]}>
                    {translate('no_person_slots_available')}
                </TextRegular>
            </View>
        );
    }

    return (
        <View style={[styles.container, style]}>
            <View style={styles.inner}>
                {data.map((item, index) => {
                    const adStyle = index > 0 ? {
                        marginTop: 15, 
                        paddingTop: 15, 
                        borderTopWidth: 1, 
                        borderTopColor: apColors.separator
                    } : {};
                    
                    return (
                        <PersonSlotItem
                            key={item._id}
                            data={item}
                            priceBased={priceBased}
                            prices={prices}
                            style={adStyle}
                            onSelectPersons={(pers) => onSelectPersons(pers, item)}
                            apColors={apColors}
                        />
                    );
                })}
            </View>
        </View>
    );
};

// Child component for individual person slot
interface PersonSlotItemProps {
    data: Slot;
    priceBased: any;
    prices: any;
    style: any;
    onSelectPersons: (persons: any) => void;
    apColors: ThemeColors;
}

const PersonSlotItem: React.FC<PersonSlotItemProps> = ({ 
    data, 
    priceBased, 
    prices, 
    style, 
    onSelectPersons, 
    apColors 
}) => {
    const colors = getThemedColors(useColorScheme());
    const { time, available, guests } = data;
    const { price, children_price, infant_price } = prices;
    const aviNum = formatInt(available);

    return (
        <View style={[styles.childWrap, style]}>
            <View style={styles.datesMetaLeft}>
                <TextHeavy style={[styles.datesMetaTitle, { color: colors.tText }]}>
                    {time || `${data.start} - ${data.end}`}
                </TextHeavy>
                <TextRegular style={[styles.datesMetaDetails, { color: colors.addressText }]}>
                    {translate(priceBased, 'bk_slot_avai', { count: aviNum })}
                </TextRegular>
            </View>
            <View style={styles.datesMetaRight}>
                <Person 
                    available={guests} 
                    onSelectPersons={onSelectPersons} 
                    priceBased={priceBased} 
                    prices={{ price, children_price, infant_price }} 
                    apColors={colors}
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
        alignItems: 'flex-start',
        paddingVertical: 10,
    } as ViewStyle,
    datesMetaLeft: {
        flex: 1,
    } as ViewStyle,
    datesMetaRight: {
        flex: 1,
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

export default PersonSlots;