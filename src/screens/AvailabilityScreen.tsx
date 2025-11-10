import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ThemeColors, NavigationProp } from '../types';
import { 
    ScrollView, 
    StyleSheet,
    View,
    Dimensions,
    ViewStyle,
    TextStyle,
} from 'react-native';
import { SafeAreaConsumer } from 'react-native-safe-area-context';
import { translate, dateFormat } from "../helpers/i18n";
import Btn from '../components/ui/Btn';
import TextRegular from '../components/ui/TextRegular';
import TextMedium from '../components/ui/TextMedium';
import TextHeavy from '../components/ui/TextHeavy';
import TextBold from '../components/ui/TextBold';
import Availability from '../components/inners/Availability';
import Slot from '../components/available/Slot';
import Ticket from '../components/available/Ticket';
import TimeSlot from '../components/available/TimeSlot';
import { checkInOutSelect } from '../actions/booking';
import { connect } from 'react-redux';
import { AppState } from '../types';

// Types
interface DateSelection {
    dateString?: string;
    timestamp?: number;
    price?: number;
    children_price?: number;
    infant_price?: number;
    metas?: {
        price?: number;
        price_adult?: number;
        price_children?: number;
        price_infant?: number;
        slots?: SlotData[];
        ev_tickets?: TicketData[];
        person_slots?: TimeSlotData[];
        ltime_slots?: TimeSlotData[];
    };
}

interface SlotData {
    _id: string;
    [key: string]: any;
}

interface TicketData {
    _id: string;
    [key: string]: any;
}

interface TimeSlotData {
    _id: string;
    [key: string]: any;
}

interface ListingData {
    availability?: any;
    price?: number;
    children_price?: number;
    infant_price?: number;
    price_based?: string;
}

interface AvailabilityScreenProps {
    navigation: NavigationProp;
    apColors: ThemeColors;
    listing: ListingData;
    checkInOutSelect: (data: { dateOne: DateSelection; dateTwo: DateSelection }) => void;
}

interface AvailabilityScreenState {
    dateOne: DateSelection;
    dateTwo: DateSelection;
}

const AvailabilityScreen: React.FC<AvailabilityScreenProps> = ({
    navigation,
    apColors,
    listing,
    checkInOutSelect
}) => {
    const [state, setState] = useState<AvailabilityScreenState>({
        dateOne: {},
        dateTwo: {},
    });

    const onDatesSelect = useCallback((vals: DateSelection[]) => {
        // Parse prices
        let {
            price = 0,
            children_price = 0,
            infant_price = 0,
            price_based = 'per_night',
        } = listing;

        let dateOne = vals[0];
        let dateTwo: DateSelection = {};

        // Pass prices to selected date
        if (dateOne.metas) {
            if (dateOne.metas.price) {
                price = dateOne.metas.price;
            } else if (dateOne.metas.price_adult) {
                price = dateOne.metas.price_adult;
            }
            if (dateOne.metas.price_children) {
                children_price = dateOne.metas.price_children;
            }
            if (dateOne.metas.price_infant) {
                infant_price = dateOne.metas.price_infant;
            }
        }

        dateOne.price = parseFloat(String(price));
        dateOne.children_price = parseFloat(String(children_price));
        dateOne.infant_price = parseFloat(String(infant_price));

        if (vals.length === 2) {
            dateTwo = vals[1];
        }

        checkInOutSelect({ dateOne, dateTwo });
        setState({ dateOne, dateTwo });
    }, [listing, checkInOutSelect]);

    const onSelectSlot = useCallback((slot: any) => {
        navigation.navigate('Booking');
    }, [navigation]);

    const { dateOne, dateTwo } = state;
    const availability = listing?.availability || {};
    
    const { checkin, checkout, hasBotInfos, botHeight } = useMemo(() => {
        let checkin = '';
        let checkout = '';
        let botHeight = 0;
        let hasBotInfos = false;

        if (dateOne.dateString && dateOne.dateString !== '') {
            checkin = dateOne.dateString;
            botHeight = 70;
            hasBotInfos = true;
        }
        
        if (dateTwo.dateString && dateTwo.dateString !== '') {
            checkout = dateTwo.dateString;
        }

        return { checkin, checkout, hasBotInfos, botHeight };
    }, [dateOne.dateString, dateTwo.dateString]);

    const { price_based = 'per_night' } = listing;

    const { slotsJsx, ticketsJsx, finalBotHeight } = useMemo(() => {
        let slots: React.ReactNode[] = [];
        let tickets: React.ReactNode[] = [];
        let height = botHeight;

        if (dateOne.metas) {
            const {
                slots: slotData,
                ev_tickets,
                person_slots,
                ltime_slots,
            } = dateOne.metas;

            // Process slots
            if (slotData && Array.isArray(slotData)) {
                slotData.forEach(sl => {
                    slots.push(
                        <Slot 
                            key={sl._id} 
                            price={dateOne.price || 0} 
                            priceBased={price_based} 
                            data={sl} 
                            onPress={() => onSelectSlot(sl)}
                        />
                    );
                });
                height = 200;
                hasBotInfos = true;
            }

            // Process tickets
            if (ev_tickets && Array.isArray(ev_tickets)) {
                ev_tickets.forEach(it => {
                    tickets.push(
                        <Ticket 
                            key={it._id} 
                            price={dateOne.price || 0} 
                            priceBased={price_based} 
                            data={it}
                        />
                    );
                });
                height = 200;
                hasBotInfos = true;
            }

            // Process person slots
            if (person_slots && Array.isArray(person_slots)) {
                person_slots.forEach(sl => {
                    slots.push(
                        <TimeSlot 
                            key={sl._id} 
                            price={dateOne.price || 0} 
                            priceBased={price_based} 
                            data={sl} 
                            onPress={() => onSelectSlot(sl)}
                        />
                    );
                });
                height = 200;
                hasBotInfos = true;
            }

            // Process time slots
            if (ltime_slots && Array.isArray(ltime_slots)) {
                ltime_slots.forEach(sl => {
                    slots.push(
                        <TimeSlot 
                            key={sl._id} 
                            price={dateOne.price || 0} 
                            priceBased={price_based} 
                            data={sl} 
                            onPress={() => onSelectSlot(sl)}
                        />
                    );
                });
                height = 200;
                hasBotInfos = true;
            }
        }

        return { 
            slotsJsx: slots, 
            ticketsJsx: tickets, 
            finalBotHeight: height 
        };
    }, [dateOne.metas, dateOne.price, price_based, botHeight, onSelectSlot]);

    return (
        <SafeAreaConsumer>
            {insets => (
                <View style={[
                    styles.container,
                    {
                        backgroundColor: apColors.appBg,
                        paddingBottom: insets.bottom,
                        paddingLeft: insets.left,
                        paddingRight: insets.right
                    }
                ]}>
                    <View style={styles.datesModalInner}>
                        <Availability 
                            availabilityData={availability} 
                            onDatesSelect={onDatesSelect} 
                            apColors={apColors}
                        />
                    </View>

                    {hasBotInfos && (
                        <View style={[styles.datesModalFooter, { minHeight: finalBotHeight }]}>
                            <ScrollView 
                                style={[styles.scrollView, { borderTopColor: apColors.separator }]} 
                                contentContainerStyle={styles.contentContainer}
                            >
                                <View style={styles.datesInOutWrap}>
                                    <View style={styles.datesInOut}>
                                        <TextHeavy style={[styles.datesInOutIn, { color: apColors.tText }]}>
                                            {dateFormat(checkin)}
                                        </TextHeavy>
                                        {checkout !== '' && (
                                            <TextHeavy style={[styles.datesInOutOut, { color: apColors.tText }]}>
                                                {dateFormat(checkout)}
                                            </TextHeavy>
                                        )}
                                    </View>
                                    {checkin !== '' && (
                                        <Btn onPress={() => onSelectSlot({})}>
                                            {translate(price_based, 'btn_continue', {})}
                                        </Btn>
                                    )}
                                </View>
                                {slotsJsx}
                                {ticketsJsx}
                            </ScrollView>
                        </View>
                    )}
                </View>
            )}
        </SafeAreaConsumer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    } as ViewStyle,
    datesModalInner: {
        flex: 1,
        minHeight: 350,
    } as ViewStyle,
    datesModalFooter: {
        // Dynamic height based on content
    } as ViewStyle,
    scrollView: {
        flex: 1,
        borderTopWidth: 1,
    } as ViewStyle,
    contentContainer: {
        paddingHorizontal: 15,
        paddingTop: 15,
    } as ViewStyle,
    datesInOutWrap: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    } as ViewStyle,
    datesInOut: {
        // Date display container
    } as ViewStyle,
    datesInOutIn: {
        fontSize: 15,
    } as TextStyle,
    datesInOutOut: {
        fontSize: 15,
        marginTop: 5,
    } as TextStyle,
});

// Map the redux state to your props
const mapStateToProps = (state: AppState) => ({
    listing: state.listings || {} as any,
});

// Map your action creators to your props
const mapDispatchToProps = {
    checkInOutSelect
};

// Export the connected component
export default connect(mapStateToProps, mapDispatchToProps)(AvailabilityScreen);