import React, { useState, useCallback } from 'react';
import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    useColorScheme,
    ViewStyle,
    TextStyle,
    ImageStyle
} from 'react-native';

import getThemedColors from '../../helpers/Theme';
import { translate } from '../../helpers/i18n';
import { fomartCurrOut } from '../../helpers/currency';
import TextRegular from '../ui/TextRegular';
import TextHeavy from '../ui/TextHeavy';
import Qtts from '../ui/Qtts';
import { ThemeColors, Slot } from '../../types';

// Types
interface SlotsState {
    booked: any[];
}

interface SlotsProps {
    slots: Slot[];
    apColors: ThemeColors;
    prices: any;
    onSelectSlots: (slots: any[]) => void;
}

const Slots: React.FC<SlotsProps> = ({ slots, apColors, prices, onSelectSlots }) => {
    const [state, setState] = useState<SlotsState>({
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
                title: `${slot.start} - ${slot.end}`,
                ...prices
            }];
        }

        onSelectSlots(updatedBooked);
        setState(prevState => ({ ...prevState, booked: updatedBooked }));
    }, [state.booked, onSelectSlots, prices]);

    const getSlotQuantity = useCallback((slotId: string) => {
        const bookedSlot = state.booked.find(bk => bk._id === slotId);
        return bookedSlot ? bookedSlot.quantity : 0;
    }, [state.booked]);

    const { booked } = state;

    if (!slots || slots.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <TextRegular style={[styles.emptyText, { color: apColors.regularText }]}>
                    {translate('no_slots_available')}
                </TextRegular>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {slots.map((slot, index) => {
                const bQtt = getSlotQuantity(slot._id);
                
                return (
                    <View key={slot._id} style={[styles.slotCard, { 
                        backgroundColor: apColors.secondBg,
                        borderColor: apColors.separator
                    }]}>
                        <View style={styles.slotContent}>
                            {/* Slot Time */}
                            <View style={styles.slotTimeContainer}>
                                <TextHeavy style={[styles.slotTime, { color: apColors.hText }]}>
                                    {slot.start} - {slot.end}
                                </TextHeavy>
                                {slot.title && (
                                    <TextRegular style={[styles.slotTitle, { color: apColors.regularText }]}>
                                        {slot.title}
                                    </TextRegular>
                                )}
                            </View>

                            {/* Slot Price */}
                            <View style={styles.slotPriceContainer}>
                                <TextHeavy style={[styles.slotPrice, { color: apColors.appColor }]}>
                                    {fomartCurrOut(slot.price)}
                                </TextHeavy>
                                <TextRegular style={[styles.priceLabel, { color: apColors.addressText }]}>
                                    {translate('per_person')}
                                </TextRegular>
                            </View>

                            {/* Slot Quantity */}
                            <View style={styles.slotQuantityContainer}>
                                <TextRegular style={[styles.quantityLabel, { color: apColors.regularText }]}>
                                    {translate('quantity')}:
                                </TextRegular>
                                <Qtts
                                    value={bQtt}
                                    max={slot.max_quantity || 10}
                                    apColors={apColors}
                                    onChange={(qtt) => onChangeQtt(qtt, slot)}
                                />
                            </View>
                        </View>

                        {/* Slot Description */}
                        {slot.description && (
                            <View style={styles.slotDescription}>
                                <TextRegular style={[styles.descriptionText, { color: apColors.regularText }]}>
                                    {slot.description}
                                </TextRegular>
                            </View>
                        )}

                        {/* Slot Features */}
                        {slot.features && slot.features.length > 0 && (
                            <View style={styles.slotFeatures}>
                                {slot.features.map((feature, featureIndex) => (
                                    <TextRegular 
                                        key={featureIndex}
                                        style={[styles.featureText, { color: apColors.addressText }]}
                                    >
                                        • {feature}
                                    </TextRegular>
                                ))}
                            </View>
                        )}

                        {/* Selected Badge */}
                        {bQtt > 0 && (
                            <View style={[styles.selectedBadge, { backgroundColor: apColors.appColor }]}>
                                <TextRegular style={styles.selectedText}>
                                    {bQtt} {translate('selected')}
                                </TextRegular>
                            </View>
                        )}
                    </View>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
    } as ViewStyle,
    emptyContainer: {
        paddingVertical: 40,
        alignItems: 'center',
    } as ViewStyle,
    emptyText: {
        fontSize: 16,
    } as TextStyle,
    slotCard: {
        marginBottom: 15,
        borderRadius: 8,
        borderWidth: 1,
        overflow: 'hidden',
        position: 'relative',
    } as ViewStyle,
    slotContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
    } as ViewStyle,
    slotTimeContainer: {
        flex: 1,
    } as ViewStyle,
    slotTime: {
        fontSize: 16,
        marginBottom: 4,
    } as TextStyle,
    slotTitle: {
        fontSize: 14,
    } as TextStyle,
    slotPriceContainer: {
        alignItems: 'center',
        marginHorizontal: 15,
    } as ViewStyle,
    slotPrice: {
        fontSize: 18,
        marginBottom: 2,
    } as TextStyle,
    priceLabel: {
        fontSize: 12,
    } as TextStyle,
    slotQuantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    } as ViewStyle,
    quantityLabel: {
        fontSize: 14,
        marginRight: 10,
    } as TextStyle,
    slotDescription: {
        paddingHorizontal: 15,
        paddingBottom: 10,
    } as ViewStyle,
    descriptionText: {
        fontSize: 14,
        lineHeight: 20,
    } as TextStyle,
    slotFeatures: {
        paddingHorizontal: 15,
        paddingBottom: 15,
    } as ViewStyle,
    featureText: {
        fontSize: 12,
        marginBottom: 2,
    } as TextStyle,
    selectedBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    } as ViewStyle,
    selectedText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
    } as TextStyle,
});

export default Slots;
