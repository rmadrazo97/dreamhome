import React, { useState, useCallback } from 'react';
import { ThemeColors, Service } from '../../types';
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
interface LServicesState {
    booked: any[];
}

interface LServicesProps {
    data: Service[];
    apColors: ThemeColors;
    priceBased: any;
    onSelectItems: (items: any[]) => void;
    style?: ViewStyle;
}

const LServices: React.FC<LServicesProps> = ({ 
    data, 
    apColors, 
    priceBased, 
    onSelectItems, 
    style 
}) => {
    const [state, setState] = useState<LServicesState>({
        booked: []
    });

    const onChangeQtt = useCallback((qtt: number, item: Service) => {
        const { booked } = state;
        const findIdx = booked.findIndex(bk => bk._id === item._id);
        
        let updatedBooked;
        if (findIdx !== -1) {
            updatedBooked = [...booked];
            updatedBooked[findIdx] = {
                ...updatedBooked[findIdx],
                quantity: qtt
            };
        } else {
            updatedBooked = [...booked, {
                _id: item._id,
                quantity: qtt,
                title: item.name,
                price: formatFloat(item.price)
            }];
        }

        onSelectItems(updatedBooked);
        setState(prevState => ({ ...prevState, booked: updatedBooked }));
    }, [state.booked, onSelectItems]);

    const getServiceQuantity = useCallback((serviceId: string) => {
        const bookedService = state.booked.find(bk => bk._id === serviceId);
        return bookedService ? bookedService.quantity : 0;
    }, [state.booked]);

    if (!data || data.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <TextRegular style={[styles.emptyText, { color: apColors.regularText }]}>
                    {translate('no_services_available')}
                </TextRegular>
            </View>
        );
    }

    return (
        <View style={[styles.container, style]}>
            <View style={styles.inner}>
                {data.map((item, index) => {
                    // Normalize service data
                    const normalizedItem = {
                        ...item,
                        _id: item.service_id || item._id,
                        name: item.service_name || item.name,
                        price: item.service_price || item.price,
                        available: item.available || 10
                    };

                    const bQtt = getServiceQuantity(normalizedItem._id);
                    const adStyle = index > 0 ? {
                        marginTop: 15, 
                        paddingTop: 15, 
                        borderTopWidth: 1, 
                        borderTopColor: apColors.separator
                    } : {};
                    
                    return (
                        <ServiceItem
                            key={normalizedItem._id}
                            data={normalizedItem}
                            priceBased={priceBased}
                            style={adStyle}
                            qtt={bQtt}
                            onChangeQtt={(qtt) => onChangeQtt(qtt, normalizedItem)}
                            apColors={apColors}
                        />
                    );
                })}
            </View>
        </View>
    );
};

// Child component for individual service item
interface ServiceItemProps {
    data: any;
    priceBased: any;
    style: any;
    qtt: number;
    onChangeQtt: (qtt: number) => void;
    apColors: ThemeColors;
}

const ServiceItem: React.FC<ServiceItemProps> = ({ 
    data, 
    priceBased, 
    style, 
    qtt, 
    onChangeQtt, 
    apColors 
}) => {
    const colors = getThemedColors(useColorScheme());
    const { name, price, available } = data;

    return (
        <View style={[styles.childWrap, style]}>
            <View style={styles.datesMetaLeft}>
                <TextHeavy style={[styles.datesMetaTitle, { color: colors.tText }]}>
                    {name}
                </TextHeavy>
                <TextRegular style={[styles.datePrice, { color: colors.appColor }]}>
                    {fomartCurrOut(price)}
                </TextRegular>
            </View>
            <View style={styles.datesMetaRight}>
                <Qtts 
                    min={0} 
                    max={available} 
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
        // Container for services
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
    datePrice: {
        fontSize: 13,
    } as TextStyle,
});

export default LServices;