import React, { useState, useEffect, useCallback } from 'react';
import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
    ImageStyle
} from 'react-native';
import axios from 'axios';

import { translate } from '../../helpers/i18n';
import { fomartCurrOut } from '../../helpers/currency';
import TextRegular from '../ui/TextRegular';
import TextMedium from '../ui/TextMedium';
import TextHeavy from '../ui/TextHeavy';
import Qtts from '../ui/Qtts';
import RoomImages from '../inners/RoomImages';
import { ThemeColors, Room } from '../../types';

// Types
interface RoomsState {
    rooms: Room[];
    available: any[];
    loading: boolean;
    booked: any[];
}

interface RoomsProps {
    checkin: string;
    checkout: string;
    lid: string;
    priceBased: any;
    apColors: ThemeColors;
    onSelectRooms?: (rooms: Room[]) => void;
}

const Rooms: React.FC<RoomsProps> = ({ 
    checkin, 
    checkout, 
    lid, 
    priceBased, 
    apColors, 
    onSelectRooms 
}) => {
    const [state, setState] = useState<RoomsState>({
        rooms: [],
        available: [],
        loading: true,
        booked: [],
    });

    const loadRooms = useCallback(async () => {
        try {
            setState(prevState => ({ ...prevState, loading: true }));
            
            const response = await axios.get(`/booking/rooms?checkin=${checkin}&checkout=${checkout}&id=${lid}`);
            const { available, rooms } = response.data;
            
            if (available && rooms && Array.isArray(available) && available.length > 0 && Array.isArray(rooms) && rooms.length > 0) {
                setState(prevState => ({
                    ...prevState,
                    available,
                    rooms,
                    loading: false
                }));
            } else {
                setState(prevState => ({
                    ...prevState,
                    available: [],
                    rooms: [],
                    loading: false
                }));
            }
        } catch (error) {
            console.error('Error loading rooms:', error);
            setState(prevState => ({
                ...prevState,
                available: [],
                rooms: [],
                loading: false
            }));
        }
    }, [checkin, checkout, lid]);

    useEffect(() => {
        loadRooms();
    }, [loadRooms]);

    const onChangeQtt = useCallback((qtt: number, room: Room) => {
        const { booked } = state;
        const findIdx = booked.findIndex(rm => rm.ID === room.id);
        
        if (findIdx !== -1) {
            if (qtt > 0) {
                const updatedBooked = [...booked];
                updatedBooked[findIdx] = { ...updatedBooked[findIdx], quantities: qtt };
                setState(prevState => ({ ...prevState, booked: updatedBooked }));
            } else {
                const updatedBooked = booked.filter(rm => rm.ID !== room.id);
                setState(prevState => ({ ...prevState, booked: updatedBooked }));
            }
        } else if (qtt > 0) {
            const newBooked = [...booked, { ...room, quantities: qtt }];
            setState(prevState => ({ ...prevState, booked: newBooked }));
        }

        // Notify parent component
        if (onSelectRooms) {
            const updatedBooked = qtt > 0 
                ? (findIdx !== -1 
                    ? booked.map(rm => rm.ID === room.id ? { ...rm, quantities: qtt } : rm)
                    : [...booked, { ...room, quantities: qtt }])
                : booked.filter(rm => rm.ID !== room.id);
            
            onSelectRooms(updatedBooked);
        }
    }, [state.booked, onSelectRooms]);

    const getRoomQuantity = useCallback((roomId: string) => {
        const bookedRoom = state.booked.find(rm => rm.ID === roomId);
        return bookedRoom ? bookedRoom.quantities : 0;
    }, [state.booked]);

    const isRoomAvailable = useCallback((roomId: string) => {
        const availableRoom = state.available.find(av => av.room_id === roomId);
        return availableRoom && availableRoom.available > 0;
    }, [state.available]);

    const getRoomPrice = useCallback((room: Room) => {
        if (priceBased && priceBased.price) {
            return priceBased.price;
        }
        return room.price;
    }, [priceBased]);

    const { rooms, loading } = state;

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={apColors.appColor} />
                <TextRegular style={[styles.loadingText, { color: apColors.regularText }]}>
                    {translate('loading_rooms')}...
                </TextRegular>
            </View>
        );
    }

    if (rooms.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <TextRegular style={[styles.emptyText, { color: apColors.regularText }]}>
                    {translate('no_rooms_available')}
                </TextRegular>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {rooms.map((room, index) => (
                <View key={room.id} style={[styles.roomCard, { 
                    backgroundColor: apColors.secondBg,
                    borderColor: apColors.separator
                }]}>
                    {/* Room Images */}
                    {(room as any).images && (room as any).images.length > 0 && (
                        <RoomImages 
                            images={(room as any).images} 
                            apColors={apColors}
                        />
                    )}

                    <View style={styles.roomContent}>
                        {/* Room Title */}
                        <TextHeavy style={[styles.roomTitle, { color: apColors.hText }]}>
                            {room.title}
                        </TextHeavy>

                        {/* Room Description */}
                        {(room as any).description && (
                            <TextRegular style={[styles.roomDescription, { color: apColors.regularText }]}>
                                {(room as any).description}
                            </TextRegular>
                        )}

                        {/* Room Features */}
                        {(room as any).features && (room as any).features.length > 0 && (
                            <View style={styles.roomFeatures}>
                                {(room as any).features.slice(0, 3).map((feature: string, featureIndex: number) => (
                                    <TextMedium 
                                        key={featureIndex}
                                        style={[styles.roomFeature, { color: apColors.addressText }]}
                                    >
                                        • {feature}
                                    </TextMedium>
                                ))}
                            </View>
                        )}

                        {/* Room Price and Quantity */}
                        <View style={styles.roomFooter}>
                            <View style={styles.priceContainer}>
                                <TextHeavy style={[styles.roomPrice, { color: apColors.appColor }]}>
                                    {fomartCurrOut(getRoomPrice(room))}
                                </TextHeavy>
                                <TextRegular style={[styles.priceLabel, { color: apColors.addressText }]}>
                                    {translate('per_night')}
                                </TextRegular>
                            </View>

                            <View style={styles.quantityContainer}>
                                <TextRegular style={[styles.quantityLabel, { color: apColors.regularText }]}>
                                    {translate('quantity')}:
                                </TextRegular>
                                <Qtts
                                    value={getRoomQuantity(String(room.id))}
                                    max={isRoomAvailable(String(room.id)) ? 10 : 0}
                                    onChange={(qtt) => onChangeQtt(qtt, room)}
                                />
                            </View>
                        </View>

                        {/* Availability Status */}
                        {!isRoomAvailable(String(room.id)) && (
                            <View style={[styles.unavailableBadge, { backgroundColor: apColors.appColor }]}>
                                <TextRegular style={styles.unavailableText}>
                                    {translate('unavailable')}
                                </TextRegular>
                            </View>
                        )}
                    </View>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
    } as ViewStyle,
    loadingContainer: {
        paddingVertical: 40,
        alignItems: 'center',
    } as ViewStyle,
    loadingText: {
        marginTop: 10,
        fontSize: 16,
    } as TextStyle,
    emptyContainer: {
        paddingVertical: 40,
        alignItems: 'center',
    } as ViewStyle,
    emptyText: {
        fontSize: 16,
    } as TextStyle,
    roomCard: {
        marginBottom: 15,
        borderRadius: 8,
        borderWidth: 1,
        overflow: 'hidden',
    } as ViewStyle,
    roomContent: {
        padding: 15,
    } as ViewStyle,
    roomTitle: {
        fontSize: 18,
        marginBottom: 8,
    } as TextStyle,
    roomDescription: {
        fontSize: 14,
        marginBottom: 10,
        lineHeight: 20,
    } as TextStyle,
    roomFeatures: {
        marginBottom: 15,
    } as ViewStyle,
    roomFeature: {
        fontSize: 12,
        marginBottom: 4,
    } as TextStyle,
    roomFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    } as ViewStyle,
    priceContainer: {
        flex: 1,
    } as ViewStyle,
    roomPrice: {
        fontSize: 20,
        marginBottom: 2,
    } as TextStyle,
    priceLabel: {
        fontSize: 12,
    } as TextStyle,
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    } as ViewStyle,
    quantityLabel: {
        fontSize: 14,
        marginRight: 10,
    } as TextStyle,
    unavailableBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    } as ViewStyle,
    unavailableText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
    } as TextStyle,
});

export default Rooms;