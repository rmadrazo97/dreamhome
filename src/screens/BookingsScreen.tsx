import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
    View,
    Image,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    ViewStyle,
    TextStyle,
    ImageStyle
} from 'react-native';
import { connect } from 'react-redux';

import { translate } from "../helpers/i18n";
import { fomartCurrOut } from '../helpers/currency';
import { ThemeColors, NavigationProp, AppState } from '../types';
import { themedColors } from '../constants/Colors';

import TextRegular from '../components/ui/TextRegular';
import TextMedium from '../components/ui/TextMedium';
import TextHeavy from '../components/ui/TextHeavy';
import Loader from '../components/Loader';

import { getBookings } from '../actions/user';
import { SafeAreaView } from 'react-native-safe-area-context';

// Types
interface Booking {
    ID: number;
    ltitle: string;
    thumbnail?: string;
    address?: string;
    total: number;
    status: string;
}

interface BookingsScreenProps {
    navigation: NavigationProp;
    apColors: ThemeColors;
    user: {
        isLoggedIn: boolean;
        ID?: number | string;
        bookings: Booking[];
        loading: boolean;
        lmore: boolean;
        bkspages: number;
        [key: string]: any;
    };
    site: any;
    getBookings: (id: string | number, paged?: number, lmore?: boolean) => void;
}

interface CardProps {
    id: number;
    post: Booking;
    onPress: () => void;
    apColors: ThemeColors;
}

// Card Component
const Card: React.FC<CardProps> = ({ post, onPress, apColors }) => {
    const { ltitle, thumbnail, address, total, status } = post;
    
    return (
        <View style={[styles.cardWrap, {
            backgroundColor: apColors.appBg,
            borderColor: apColors.separator,
        }]}>
            <TouchableOpacity onPress={onPress} style={styles.cardInner}>
                <View style={styles.bkListingWrap}>
                    {thumbnail && thumbnail !== '' && (
                        <Image 
                            source={{ uri: thumbnail }} 
                            style={[styles.cardImage, { borderColor: apColors.separator }]} 
                        />
                    )}
                    <View style={styles.bkListingRight}>
                        <TextMedium style={styles.lTitle}>{ltitle}</TextMedium>
                        {address && address !== '' && (
                            <TextRegular style={[styles.lAddress, { color: apColors.addressText }]}>
                                {address}
                            </TextRegular>
                        )}
                    </View>
                </View>
                
                <View style={[styles.bkTotal, { borderTopColor: apColors.separator }]}>
                    <TextRegular style={styles.totalText}>
                        {translate('bookings', 'total')}
                    </TextRegular>
                    <TextHeavy style={[styles.totalAmount, { color: apColors.appColor }]}>
                        {fomartCurrOut(total)}
                    </TextHeavy>
                </View>
                
                <View style={[styles.bkTotal, { borderTopColor: apColors.separator }]}>
                    <TextRegular style={styles.totalText}>
                        {translate('bookings', 'status')}
                    </TextRegular>
                    <TextHeavy style={styles.totalText}>
                        {translate('bookings', status)}
                    </TextHeavy>
                </View>
            </TouchableOpacity>
        </View>
    );
};

// Main Component
const BookingsScreen: React.FC<BookingsScreenProps> = ({ 
    navigation, 
    apColors, 
    user, 
    getBookings 
}) => {
    const colors = apColors || themedColors.default;
    const [paged, setPaged] = useState(1);
    
    const { isLoggedIn, ID, bookings, loading, lmore, bkspages } = user;

    // Initial load and when user logs in
    useEffect(() => {
        if (isLoggedIn && ID) {
            getBookings(ID);
            setPaged(1);
        }
    }, [isLoggedIn, ID, getBookings]);

    // Handle pagination when reaching end of list
    const handleEndReached = useCallback((_info: { distanceFromEnd: number }) => {
        if (ID && lmore === false && bkspages > 0) {
            const nextPage = paged + 1;
            getBookings(ID, nextPage, true);
            setPaged(nextPage);
        }
    }, [ID, lmore, bkspages, paged, getBookings]);

    // Handle pull to refresh
    const handleRefresh = useCallback(() => {
        if (ID) {
            getBookings(ID);
            setPaged(1);
        }
    }, [ID, getBookings]);

    // Navigate to single booking
    const goToSingle = useCallback((booking: Booking) => {
        const params = {
            id: booking.ID,
            backRoute: 'Bookings',
        };
        (navigation as any).navigate('SBooking', params);
    }, [navigation]);

    // Memoized render item
    const renderItem = useCallback(({ item }: { item: Booking }) => (
        <Card 
            id={item.ID} 
            post={item} 
            onPress={() => goToSingle(item)} 
            apColors={colors}
        />
    ), [goToSingle, colors]);

    // Memoized key extractor
    const keyExtractor = useCallback((item: Booking) => String(item.ID), []);

    // Memoized empty component
    const listEmptyComponent = useMemo(() => (
        <View style={styles.listEmpty}>
            <TextRegular style={[styles.emptyText, { color: colors.lMoreText }]}>
                {loading ? translate('bookings', 'loading') : translate('bookings', 'no_results')}
            </TextRegular>
        </View>
    ), [loading, colors.lMoreText]);

    // Memoized footer component
    const listFooterComponent = useMemo(() => (
        <View style={styles.listFooter}>
            {lmore && <ActivityIndicator animating={true} />}
            {bookings.length > 0 && bkspages === 0 && (
                <TextRegular style={[styles.footerText, { color: colors.lMoreText }]}>
                    {translate('bookings', 'no_more')}
                </TextRegular>
            )}
        </View>
    ), [lmore, bookings.length, bkspages, colors.lMoreText]);

    return (
        <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: colors.secondBg }]}>
            {loading && <Loader loading={true} />}
            <FlatList
                data={bookings}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                style={styles.flatList}
                onRefresh={handleRefresh}
                refreshing={loading}
                onEndReached={handleEndReached}
                onEndReachedThreshold={0.1}
                ListEmptyComponent={listEmptyComponent}
                ListFooterComponent={listFooterComponent}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
};

// Redux connection
const mapStateToProps = (state: AppState) => ({
    user: {
        ...state.user,
        bookings: (state.user as any).bookings || [],
        loading: (state.user as any).loading || false,
        lmore: (state.user as any).lmore || false,
        bkspages: (state.user as any).bkspages || 0,
    },
    site: state.site,
    apColors: (state as any).apColors || themedColors.default,
});

const mapDispatchToProps = {
    getBookings
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingsScreen);

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
    } as ViewStyle,
    flatList: {
        paddingTop: 15,
    } as ViewStyle,
    cardWrap: {
        paddingHorizontal: 15,
        paddingVertical: 20,
        marginBottom: 10,
        borderTopWidth: 1,
        borderBottomWidth: 1,
    } as ViewStyle,
    cardInner: {
        // flexDirection: 'row',
    } as ViewStyle,
    bkListingWrap: {
        flexDirection: 'row',
    } as ViewStyle,
    bkListingRight: {
        flex: 1,
    } as ViewStyle,
    lTitle: {
        fontSize: 15,
        lineHeight: 20,
    } as TextStyle,
    cardImage: {
        marginRight: 10,
        width: 60,
        height: 60,
        borderWidth: 1,
    } as ImageStyle,
    bkTotal: {
        borderTopWidth: 0.5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        paddingTop: 10,
    } as ViewStyle,
    totalText: {
        fontSize: 17,
        lineHeight: 22,
    } as TextStyle,
    totalAmount: {
        fontSize: 17,
        lineHeight: 22,
    } as TextStyle,
    cardTitle: {
        fontSize: 20,
        lineHeight: 24,
        marginRight: 25,
    } as TextStyle,
    bookmarkIcon: {
        position: 'absolute',
        top: -2,
        right: 0,
    } as ViewStyle,
    lAddress: {
        fontSize: 11,
        lineHeight: 15,
        marginTop: 2,
    } as TextStyle,
    listEmpty: {
        paddingVertical: 20,
    } as ViewStyle,
    listFooter: {
        paddingVertical: 20,
    } as ViewStyle,
    emptyText: {
        fontSize: 15,
        textAlign: 'center',
    } as TextStyle,
    footerText: {
        fontSize: 15,
        textAlign: 'center',
    } as TextStyle,
});
