import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
    ScrollView, 
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    ViewStyle,
    TextStyle,
    Alert
} from 'react-native';
import { SafeAreaConsumer } from 'react-native-safe-area-context';
import moment from 'moment';
import { connect } from 'react-redux';

import { translate, dateFormat, dateTimeFormat } from "../helpers/i18n";
import { fomartCurrOut, formatFloat, formatInt } from '../helpers/currency';
import Listing from '../components/booking/Listing';
import TextMedium from '../components/ui/TextMedium';
import TextHeavy from '../components/ui/TextHeavy';
import TextRegular from '../components/ui/TextRegular';
import BtnFull from '../components/ui/BtnFull';
import Rooms from '../components/booking/Rooms';
import Slots from '../components/booking/Slots';
import Tickets from '../components/booking/Tickets';
import Menus from '../components/booking/Menus';
import Quantity from '../components/booking/Quantity';
import Person from '../components/booking/Person';
import PersonSlots from '../components/booking/PersonSlots';
import TimeSlots from '../components/booking/TimeSlots';
import LServices from '../components/booking/LServices';
import { processToCheckout } from '../actions/booking';
import { ThemeColors, NavigationProp, Room, Slot, Service, Menu, AppState, RouteProp } from '../types';

// Types
interface BookingScreenState {
    rooms: Room[];
    rooms_old_data: Room[];
    tour_slots: Slot[];
    tickets: any[];
    book_services: Service[];
    bk_menus: Menu[];
    bk_qtts: number;
    bk_persons: number;
    bk_person_slots: any[];
    bk_time_slots: any[];
    loading: boolean;
    total_price: number;
    checkin: string;
    checkout: string;
    listing: any;
    error: string | null;
}

interface BookingScreenProps {
    navigation: NavigationProp;
    apColors: ThemeColors;
    booking: any;
    listing: any;
    user: any;
    route: RouteProp<'Booking'>;
}

const BookingScreen: React.FC<BookingScreenProps> = ({ 
    navigation, 
    apColors,
    route
}) => {
    console.log('route', route.params);
    const [state, setState] = useState<BookingScreenState>({
        rooms: [],
        rooms_old_data: [],
        tour_slots: [],
        tickets: [],
        book_services: [],
        bk_menus: [],
        bk_qtts: 0,
        bk_persons: 0,
        bk_person_slots: [],
        bk_time_slots: [],
        loading: true,
        total_price: 0,
        checkin: '',
        checkout: '',
        listing: null,
        error: null,
    });

    // Navigation options
    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    // Initialize booking data from route params
    useEffect(() => {
        try {
            const routeParams = route.params;
            if (routeParams) {
                setState(prevState => ({
                    ...prevState,
                    listing: routeParams.listing || null,
                    loading: false,
                }));
            } else {
                setState(prevState => ({
                    ...prevState,
                    loading: false,
                }));
            }
        } catch (error) {
            console.error('Error initializing booking data:', error);
            setState(prevState => ({
                ...prevState,
                loading: false,
                error: 'Failed to load booking data',
            }));
        }
    }, [navigation]);

    // Memoized total calculation
    const totalPrice = useMemo(() => {
        let total = 0;

        try {
            // Calculate rooms total
            state.rooms.forEach(room => {
                const bookedRoom = state.rooms_old_data.find(r => r.id === room.id);
                if (bookedRoom) {
                    total += parseFloat(String(room.price)) * bookedRoom.quantities;
                }
            });

            // Calculate slots total
            state.tour_slots.forEach(slot => {
                total += parseFloat(String(slot.price)) * slot.quantity;
            });

            // Calculate tickets total
            state.tickets.forEach(ticket => {
                total += parseFloat(String(ticket.price)) * ticket.quantity;
            });

            // Calculate services total
            state.book_services.forEach(service => {
                total += parseFloat(String(service.price)) * service.quantity;
            });

            // Calculate menus total
            state.bk_menus.forEach(menu => {
                total += parseFloat(String(menu.price)) * menu.quantity;
            });
        } catch (error) {
            console.error('Error calculating total price:', error);
        }

        return total;
    }, [state.rooms, state.rooms_old_data, state.tour_slots, state.tickets, state.book_services, state.bk_menus]);

    // Update total price when dependencies change
    useEffect(() => {
        setState(prevState => ({
            ...prevState,
            total_price: totalPrice,
        }));
    }, [totalPrice]);

    // Event handlers with proper error handling
    const handleSelectRooms = useCallback((rooms: Room[]) => {
        try {
            setState(prevState => ({
                ...prevState,
                rooms,
            }));
        } catch (error) {
            console.error('Error selecting rooms:', error);
            Alert.alert('Error', 'Failed to select rooms');
        }
    }, []);

    const handleSelectSlots = useCallback((slots: Slot[]) => {
        try {
            setState(prevState => ({
                ...prevState,
                tour_slots: slots,
            }));
        } catch (error) {
            console.error('Error selecting slots:', error);
            Alert.alert('Error', 'Failed to select slots');
        }
    }, []);

    const handleSelectTickets = useCallback((tickets: any[]) => {
        try {
            setState(prevState => ({
                ...prevState,
                tickets,
            }));
        } catch (error) {
            console.error('Error selecting tickets:', error);
            Alert.alert('Error', 'Failed to select tickets');
        }
    }, []);

    const handleSelectServices = useCallback((services: Service[]) => {
        try {
            setState(prevState => ({
                ...prevState,
                book_services: services,
            }));
        } catch (error) {
            console.error('Error selecting services:', error);
            Alert.alert('Error', 'Failed to select services');
        }
    }, []);

    const handleSelectMenus = useCallback((menus: Menu[]) => {
        try {
            setState(prevState => ({
                ...prevState,
                bk_menus: menus,
            }));
        } catch (error) {
            console.error('Error selecting menus:', error);
            Alert.alert('Error', 'Failed to select menus');
        }
    }, []);

    const handleQuantityChange = useCallback((qtt: number) => {
        try {
            setState(prevState => ({
                ...prevState,
                bk_qtts: qtt,
            }));
        } catch (error) {
            console.error('Error changing quantity:', error);
            Alert.alert('Error', 'Failed to update quantity');
        }
    }, []);

    const handlePersonsChange = useCallback((persons: number) => {
        try {
            setState(prevState => ({
                ...prevState,
                bk_persons: persons,
            }));
        } catch (error) {
            console.error('Error changing persons:', error);
            Alert.alert('Error', 'Failed to update persons');
        }
    }, []);

    const handlePersonSlotsChange = useCallback((personSlots: any[]) => {
        try {
            setState(prevState => ({
                ...prevState,
                bk_person_slots: personSlots,
            }));
        } catch (error) {
            console.error('Error changing person slots:', error);
            Alert.alert('Error', 'Failed to update person slots');
        }
    }, []);

    const handleTimeSlotsChange = useCallback((timeSlots: any[]) => {
        try {
            setState(prevState => ({
                ...prevState,
                bk_time_slots: timeSlots,
            }));
        } catch (error) {
            console.error('Error changing time slots:', error);
            Alert.alert('Error', 'Failed to update time slots');
        }
    }, []);

    const handleProceedToCheckout = useCallback(() => {
        try {
            // Validate required data
            if (!state.listing) {
                Alert.alert('Error', 'Please select a listing');
                return;
            }

            if (state.total_price <= 0) {
                Alert.alert('Error', 'Please select at least one item');
                return;
            }

            const bookingData = {
                rooms: state.rooms,
                tour_slots: state.tour_slots,
                tickets: state.tickets,
                book_services: state.book_services,
                bk_menus: state.bk_menus,
                bk_qtts: state.bk_qtts,
                bk_persons: state.bk_persons,
                bk_person_slots: state.bk_person_slots,
                bk_time_slots: state.bk_time_slots,
                total_price: state.total_price,
                checkin: state.checkin,
                checkout: state.checkout,
                listing: state.listing,
            };

            // Dispatch to Redux
            processToCheckout(bookingData);

            // Navigate to checkout
            navigation.navigate('Checkout');
        } catch (error) {
            console.error('Error proceeding to checkout:', error);
            Alert.alert('Error', 'Failed to proceed to checkout');
        }
    }, [state, navigation]);

    // Memoized sections to prevent unnecessary re-renders
    const listingSection = useMemo(() => {
        if (!state.listing) return null;
        
        return (
            <Listing 
                data={state.listing} 
                apColors={apColors}
            />
        );
    }, [state.listing, apColors]);

    const roomsSection = useMemo(() => {
        if (state.rooms.length === 0) return null;
        
        return (
            <View style={styles.section}>
                <TextHeavy style={[styles.sectionTitle, { color: apColors.hText }]}>
                    {translate('select_rooms')}
                </TextHeavy>
                <Rooms
                    checkin={state.checkin}
                    checkout={state.checkout}
                    lid={state.listing?.id}
                    priceBased={state.listing}
                    apColors={apColors}
                    onSelectRooms={handleSelectRooms}
                />
            </View>
        );
    }, [state.rooms, state.checkin, state.checkout, state.listing, apColors, handleSelectRooms]);

    const timeSlotsSection = useMemo(() => {
        if (state.tour_slots.length === 0) return null;
        
        return (
            <View style={styles.section}>
                <TextHeavy style={[styles.sectionTitle, { color: apColors.hText }]}>
                    {translate('select_time_slots')}
                </TextHeavy>
                <TimeSlots
                    slots={state.tour_slots}
                    apColors={apColors}
                    onSelectSlots={handleSelectSlots}
                />
            </View>
        );
    }, [state.tour_slots, apColors, handleSelectSlots]);

    const ticketsSection = useMemo(() => {
        if (state.tickets.length === 0) return null;
        
        return (
            <View style={styles.section}>
                <TextHeavy style={[styles.sectionTitle, { color: apColors.hText }]}>
                    {translate('select_tickets')}
                </TextHeavy>
                <Tickets
                    tickets={state.tickets}
                    apColors={apColors}
                    onSelectTickets={handleSelectTickets}
                />
            </View>
        );
    }, [state.tickets, apColors, handleSelectTickets]);

    const servicesSection = useMemo(() => {
        if (state.book_services.length === 0) return null;
        
        return (
            <View style={styles.section}>
                <TextHeavy style={[styles.sectionTitle, { color: apColors.hText }]}>
                    {translate('select_services')}
                </TextHeavy>
                <LServices
                    services={state.book_services}
                    apColors={apColors}
                    onSelectServices={handleSelectServices}
                />
            </View>
        );
    }, [state.book_services, apColors, handleSelectServices]);

    const menusSection = useMemo(() => {
        if (state.bk_menus.length === 0) return null;
        
        return (
            <View style={styles.section}>
                <TextHeavy style={[styles.sectionTitle, { color: apColors.hText }]}>
                    {translate('select_menus')}
                </TextHeavy>
                <Menus
                    menus={state.bk_menus}
                    apColors={apColors}
                    onSelectMenus={handleSelectMenus}
                />
            </View>
        );
    }, [state.bk_menus, apColors, handleSelectMenus]);

    const personSlotsSection = useMemo(() => {
        if (state.bk_person_slots.length === 0) return null;
        
        return (
            <View style={styles.section}>
                <TextHeavy style={[styles.sectionTitle, { color: apColors.hText }]}>
                    {translate('person_slots')}
                </TextHeavy>
                <PersonSlots
                    slots={state.bk_person_slots}
                    apColors={apColors}
                    onSelectSlots={handlePersonSlotsChange}
                />
            </View>
        );
    }, [state.bk_person_slots, apColors, handlePersonSlotsChange]);

    const timeSlotsSection2 = useMemo(() => {
        if (state.bk_time_slots.length === 0) return null;
        
        return (
            <View style={styles.section}>
                <TextHeavy style={[styles.sectionTitle, { color: apColors.hText }]}>
                    {translate('time_slots')}
                </TextHeavy>
                <TimeSlots
                    slots={state.bk_time_slots}
                    apColors={apColors}
                    onSelectSlots={handleTimeSlotsChange}
                />
            </View>
        );
    }, [state.bk_time_slots, apColors, handleTimeSlotsChange]);

    // Error state
    if (state.error) {
        return (
            <View style={[styles.container, { backgroundColor: apColors.appBg }]}>
                <View style={styles.errorContainer}>
                    <Text style={[styles.errorText, { color: apColors.errorText }]}>
                        {state.error}
                    </Text>
                    <TouchableOpacity 
                        style={[styles.retryButton, { backgroundColor: apColors.appColor }]}
                        onPress={() => setState(prevState => ({ ...prevState, error: null, loading: true }))}
                    >
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    // Loading state
    if (state.loading) {
        return (
            <View style={[styles.container, { backgroundColor: apColors.appBg }]}>
                <View style={styles.loadingContainer}>
                    <Text style={[styles.loadingText, { color: apColors.regularText }]}>
                        {translate('loading')}...
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <SafeAreaConsumer>
            {insets => (
                <View style={[styles.container, { 
                    backgroundColor: apColors.appBg,
                    paddingTop: insets.top,
                    paddingLeft: insets.left,
                    paddingRight: insets.right
                }]}>
                    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                        {/* Listing Info */}
                        {listingSection}

                        {/* Rooms Section */}
                        {roomsSection}

                        {/* Time Slots Section */}
                        {timeSlotsSection}

                        {/* Tickets Section */}
                        {ticketsSection}

                        {/* Services Section */}
                        {servicesSection}

                        {/* Menus Section */}
                        {menusSection}

                        {/* Quantity Section */}
                        <View style={styles.section}>
                            <TextHeavy style={[styles.sectionTitle, { color: apColors.hText }]}>
                                {translate('quantity')}
                            </TextHeavy>
                            <Quantity
                                value={state.bk_qtts}
                                apColors={apColors}
                                onChange={handleQuantityChange}
                            />
                        </View>

                        {/* Persons Section */}
                        <View style={styles.section}>
                            <TextHeavy style={[styles.sectionTitle, { color: apColors.hText }]}>
                                {translate('persons')}
                            </TextHeavy>
                            <Person
                                value={state.bk_persons}
                                apColors={apColors}
                                onChange={handlePersonsChange}
                            />
                        </View>

                        {/* Person Slots Section */}
                        {personSlotsSection}

                        {/* Time Slots Section */}
                        {timeSlotsSection2}

                        {/* Total Price */}
                        <View style={[styles.totalSection, { backgroundColor: apColors.secondBg, borderTopColor: apColors.separator }]}>
                            <View style={styles.totalRow}>
                                <TextHeavy style={[styles.totalLabel, { color: apColors.hText }]}>
                                    {translate('total')}:
                                </TextHeavy>
                                <TextHeavy style={[styles.totalPrice, { color: apColors.appColor }]}>
                                    {fomartCurrOut(state.total_price)}
                                </TextHeavy>
                            </View>
                        </View>
                    </ScrollView>

                    {/* Bottom Button */}
                    <View style={[styles.bottomButton, { backgroundColor: apColors.appBg, borderTopColor: apColors.separator }]}>
                        <TouchableOpacity
                            style={[styles.checkoutButton, { backgroundColor: apColors.appColor }]}
                            onPress={handleProceedToCheckout}
                        >
                            <TextHeavy style={styles.checkoutButtonText}>
                                {translate('proceed_to_checkout')}
                            </TextHeavy>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </SafeAreaConsumer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    } as ViewStyle,
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    } as ViewStyle,
    loadingText: {
        fontSize: 16,
    } as TextStyle,
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    } as ViewStyle,
    errorText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    } as TextStyle,
    retryButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    } as ViewStyle,
    retryButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    } as TextStyle,
    scrollView: {
        flex: 1,
    } as ViewStyle,
    section: {
        paddingHorizontal: 15,
        paddingVertical: 10,
    } as ViewStyle,
    sectionTitle: {
        fontSize: 18,
        marginBottom: 15,
    } as TextStyle,
    totalSection: {
        paddingHorizontal: 15,
        paddingVertical: 20,
        borderTopWidth: 1,
    } as ViewStyle,
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    } as ViewStyle,
    totalLabel: {
        fontSize: 18,
    } as TextStyle,
    totalPrice: {
        fontSize: 20,
    } as TextStyle,
    bottomButton: {
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderTopWidth: 1,
    } as ViewStyle,
    checkoutButton: {
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
    } as ViewStyle,
    checkoutButtonText: {
        color: '#FFF',
        fontSize: 16,
    } as TextStyle,
});

// Redux connection with proper types
const mapStateToProps = (state: AppState) => ({
    booking: state.booking,
    listing: state.listings,
    user: state.user,
});

export default connect(mapStateToProps)(BookingScreen);