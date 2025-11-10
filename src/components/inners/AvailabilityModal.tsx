import React, { useState, useMemo, useCallback } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    Modal,
    Dimensions,
    ViewStyle,
    TextStyle,
} from 'react-native';
import moment from 'moment';
import { connect } from 'react-redux';
import CloseButton from './CloseButton';
import TextMedium from '../ui/TextMedium';
import TextHeavy from '../ui/TextHeavy';
import Availability from './Availability';
import Slot from '../booking/Slot';
import NavigationService from '../../helpers/NavigationService';
import { AppState } from '../../types';

// Types
interface DateSelection {
    dateString?: string;
    timestamp?: number;
    metas?: {
        slots?: SlotData[];
    };
}

interface SlotData {
    _id: string;
    start: string;
    end: string;
    guests: number;
    [key: string]: any;
}

interface AvailabilityData {
    available?: { [key: string]: any };
    bookingType?: string;
    checkAvailable?: boolean;
    months_available?: number;
}

interface ListingData {
    data?: {
        availability?: AvailabilityData;
    };
}

interface AvailabilityModalProps {
    showDates: boolean;
    _onCloseDates: () => void;
    listing: ListingData;
}

interface AvailabilityModalState {
    dateOne: DateSelection;
    dateTwo: DateSelection;
}

const AvailabilityModal: React.FC<AvailabilityModalProps> = ({
    showDates,
    _onCloseDates,
    listing
}) => {
    const [state, setState] = useState<AvailabilityModalState>({
        dateOne: {},
        dateTwo: {}
    });

    const windowHeight = Dimensions.get('window').height;

    const availability = useMemo(() => {
        if (listing?.data?.availability) {
            return listing.data.availability;
        }
        return {};
    }, [listing]);

    const onDatesSelect = useCallback((vals: DateSelection[]) => {
        let dateOne: DateSelection = vals[0] || {};
        let dateTwo: DateSelection = {};
        
        if (vals.length === 2) {
            dateOne = vals[1];
            dateTwo = vals[0];
        }
        
        setState({ dateOne, dateTwo });
    }, []);

    const onSelectSlot = useCallback((slot: SlotData) => {
        NavigationService.navigate('Booking', { slot });
    }, []);

    const { dateOne, dateTwo } = state;
    
    const checkin = useMemo(() => {
        return dateOne?.dateString || '';
    }, [dateOne]);

    const checkout = useMemo(() => {
        return dateTwo?.dateString || '';
    }, [dateTwo]);

    const bottomHeight = useMemo(() => {
        return checkin ? 180 : 0;
    }, [checkin]);

    const slotsJsx = useMemo(() => {
        if (!dateOne?.metas?.slots || !Array.isArray(dateOne.metas.slots)) {
            return [];
        }

        return dateOne.metas.slots.map((slot: SlotData) => (
            <Slot
                key={slot._id}
                data={slot}
                onPress={() => onSelectSlot(slot)}
            />
        ));
    }, [dateOne?.metas?.slots, onSelectSlot]);

    const formatDate = useCallback((dateString: string) => {
        if (!dateString) return '';
        return moment(dateString).format('MMMM DD, YYYY');
    }, []);

    return (
        <Modal
            transparent={false}
            animationType="slide"
            visible={showDates}
            onRequestClose={_onCloseDates}
        >
            <View style={styles.datesModal}>
                <View style={styles.datesModalHeader}>
                    <CloseButton 
                        isBlack={true} 
                        onPress={_onCloseDates} 
                        style={styles.datesModalCloser}
                    />
                    <TextMedium style={styles.modalTitle}>
                        SELECT DATES
                    </TextMedium>
                    <View style={styles.modalHeaderSpacer} />
                </View>

                <View style={[
                    styles.datesModalInner,
                    { height: windowHeight - 92 - bottomHeight }
                ]}>
                    <Availability 
                        availabilityData={availability} 
                        onDatesSelect={onDatesSelect}
                        apColors={{} as any}
                    />
                </View>

                <View style={styles.datesModalFooter}>
                    <ScrollView 
                        style={styles.container} 
                        contentContainerStyle={styles.contentContainer}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.datesInOut}>
                            <TextHeavy style={styles.datesInOutIn}>
                                {formatDate(checkin)}
                            </TextHeavy>
                            {checkout && (
                                <TextHeavy style={styles.datesInOutOut}>
                                    {' - '}{formatDate(checkout)}
                                </TextHeavy>
                            )}
                        </View>
                        {slotsJsx}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    } as ViewStyle,
    contentContainer: {
        paddingHorizontal: 20,
        borderTopWidth: 1,
        borderTopColor: '#E4E4E4',
    } as ViewStyle,
    datesModal: {
        flex: 1,
        backgroundColor: '#fff',
    } as ViewStyle,
    datesModalHeader: {
        width: '100%',
        height: 92,
        borderBottomWidth: 1,
        borderBottomColor: '#EAECEF',
        backgroundColor: '#F7F8FA',
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        paddingBottom: 12,
        paddingHorizontal: 15,
    } as ViewStyle,
    datesModalCloser: {
        // Close button positioning
    } as ViewStyle,
    modalTitle: {
        fontSize: 15,
        color: '#1E2432',
        textAlign: 'center',
    } as TextStyle,
    modalHeaderSpacer: {
        width: 28,
    } as ViewStyle,
    datesModalInner: {
        width: '100%',
        minHeight: 350,
    } as ViewStyle,
    datesModalFooter: {
        height: 180,
        width: '100%',
    } as ViewStyle,
    datesInOut: {
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    } as ViewStyle,
    datesInOutIn: {
        fontSize: 15,
        color: '#1E2432',
    } as TextStyle,
    datesInOutOut: {
        fontSize: 15,
        color: '#1E2432',
    } as TextStyle,
    datesMeta: {
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#E4E4E4',
    } as ViewStyle,
    datesMetaTitle: {
        fontSize: 15,
        color: '#1E2432',
        marginBottom: 5,
    } as TextStyle,
    datesMetaDetails: {
        fontSize: 13,
        color: '#BEC2CE',
    } as TextStyle,
});

// Map the redux state to your props
const mapStateToProps = (_state: AppState) => ({
    listing: { data: { availability: {} } } as any, // Mock data for now
});

// Map your action creators to your props
const mapDispatchToProps = {};

// Export the connected component
export default connect(mapStateToProps, mapDispatchToProps)(AvailabilityModal);