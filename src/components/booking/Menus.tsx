import React, { useState, useCallback } from 'react';
import { ThemeColors, Menu } from '../../types';
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
import TextRegular from '../ui/TextRegular';
import TextHeavy from '../ui/TextHeavy';
import Qtts from '../ui/Qtts';

// Types
interface MenusState {
    booked: any[];
}

interface MenusProps {
    data: Menu[];
    apColors: ThemeColors;
    priceBased: any;
    onSelectTickets: (tickets: any[]) => void;
    style?: ViewStyle;
}

const Menus: React.FC<MenusProps> = ({ 
    data, 
    apColors, 
    priceBased, 
    onSelectTickets, 
    style 
}) => {
    const [state, setState] = useState<MenusState>({
        booked: []
    });

    const onChangeQtt = useCallback((qtt: number, item: Menu) => {
        const { booked } = state;
        const findIdx = booked.findIndex(bk => bk._id === item._id);
        
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
                _id: item._id,
                quantity: qtt,
                adults: qtt,
                title: item.name,
                price: formatFloat(item.price)
            }];
        }

        onSelectTickets(updatedBooked);
        setState(prevState => ({ ...prevState, booked: updatedBooked }));
    }, [state.booked, onSelectTickets]);

    const getMenuQuantity = useCallback((menuId: string) => {
        const bookedMenu = state.booked.find(bk => bk._id === menuId);
        return bookedMenu ? bookedMenu.quantity : 0;
    }, [state.booked]);

    if (!data || data.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <TextRegular style={[styles.emptyText, { color: apColors.regularText }]}>
                    {translate('no_menus_available')}
                </TextRegular>
            </View>
        );
    }

    return (
        <View style={[styles.container, style]}>
            <View style={styles.inner}>
                {data.map((item, index) => {
                    const bQtt = getMenuQuantity(item._id);
                    const adStyle = index > 0 ? {
                        marginTop: 15, 
                        paddingTop: 15, 
                        borderTopWidth: 1, 
                        borderTopColor: apColors.separator
                    } : {};
                    
                    return (
                        <MenuItem
                            key={item._id}
                            data={item}
                            priceBased={priceBased}
                            style={adStyle}
                            qtt={bQtt}
                            onChangeQtt={(qtt) => onChangeQtt(qtt, item)}
                            apColors={apColors}
                        />
                    );
                })}
            </View>
        </View>
    );
};

// Child component for individual menu item
interface MenuItemProps {
    data: Menu;
    priceBased: any;
    style: any;
    qtt: number;
    onChangeQtt: (qtt: number) => void;
    apColors: ThemeColors;
}

const MenuItem: React.FC<MenuItemProps> = ({ 
    data, 
    priceBased, 
    style, 
    qtt, 
    onChangeQtt, 
    apColors 
}) => {
    const colors = getThemedColors(useColorScheme());
    const { name, price, available } = data;
    const aviNum = formatInt(available);

    return (
        <View style={[styles.childWrap, style]}>
            <View style={styles.datesMetaLeft}>
                <TextHeavy style={[styles.datesMetaTitle, { color: colors.tText }]}>
                    {name}
                </TextHeavy>
                <TextRegular style={[styles.datesMetaDetails, { color: colors.addressText }]}>
                    {translate(priceBased, 'bk_slot_avai', { count: aviNum })}
                </TextRegular>
                <TextRegular style={[styles.datePrice, { color: colors.appColor }]}>
                    {fomartCurrOut(price)}
                </TextRegular>
            </View>
            <View style={styles.datesMetaRight}>
                <Qtts 
                    min={0} 
                    max={aviNum} 
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
        // Container for menus
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

export default Menus;