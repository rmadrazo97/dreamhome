import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    Platform,
    Dimensions,
    ViewStyle,
    TextStyle
} from 'react-native';
import { SafeAreaConsumer } from 'react-native-safe-area-context';
import MapView, { Marker, Circle } from 'react-native-maps';
import { connect } from 'react-redux';
import NavigationService from '../helpers/NavigationService';
import { extractPostParams } from "../helpers/store";
import { fomartCurrOut, valid_coords } from '../helpers/currency';
import { translate } from "../helpers/i18n";
import CloseButton from '../components/inners/CloseButton';
import MapCard from '../components/inners/MapCard';
import TextMedium from '../components/ui/TextMedium';
import TextHeavy from '../components/ui/TextHeavy';
import { ThemeColors, NavigationProp, Listing, Location } from '../types';
import { AppState } from '../types/redux';

const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

// Types
interface MapScreenState {
    mIndex: number;
    selectedListing: Listing | null;
    region: {
        latitude: number;
        longitude: number;
        latitudeDelta: number;
        longitudeDelta: number;
    };
}

interface MapScreenProps {
    navigation: NavigationProp;
    apColors: ThemeColors;
    listings: Listing[];
    userLocation: Location | null;
}

interface ReduxState {
    listings: Listing[];
    userLocation: Location | null;
}

const MapScreen: React.FC<MapScreenProps> = ({ navigation, apColors, listings, userLocation }) => {
    const [state, setState] = useState<MapScreenState>({
        mIndex: 0,
        selectedListing: null,
        region: {
            latitude: userLocation?.lat || 0,
            longitude: userLocation?.lng || 0,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
        }
    });

    const listingListRef = useRef<FlatList>(null);
    const mapRef = useRef<MapView>(null);

    const viewabilityConfig = useMemo(() => ({
        waitForInteraction: true,
        itemVisiblePercentThreshold: 97,
    }), []);

    // Navigation options
    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    const onViewableItemsChanged = useCallback((info: any) => {
        const { mIndex } = state;
        const { viewableItems } = info;
        
        if (viewableItems.length > 0) {
            const newIndex = viewableItems[0].index;
            if (newIndex !== mIndex) {
                setState(prevState => ({
                    ...prevState,
                    mIndex: newIndex,
                    selectedListing: listings[newIndex] || null,
                }));

                // Animate map to selected listing
                if (listings[newIndex] && valid_coords(listings[newIndex].location.lat, listings[newIndex].location.lng)) {
                    mapRef.current?.animateToRegion({
                        latitude: listings[newIndex].location.lat,
                        longitude: listings[newIndex].location.lng,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                    }, 1000);
                }
            }
        }
    }, [state.mIndex, listings]);

    const handleMarkerPress = useCallback((listing: Listing, index: number) => {
        setState(prevState => ({
            ...prevState,
            mIndex: index,
            selectedListing: listing,
        }));

        // Scroll to selected listing in FlatList
        listingListRef.current?.scrollToIndex({ index, animated: true });
    }, []);

    const handleListingPress = useCallback((listing: Listing) => {
        NavigationService.navigate('Listing', extractPostParams(listing));
    }, []);

    const handleClose = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const renderListing = useCallback(({ item, index }: { item: Listing; index: number }) => (
        <MapCard
            listing={item}
            apColors={apColors}
            onPress={() => handleListingPress(item)}
            isSelected={index === state.mIndex}
        />
    ), [apColors, handleListingPress, state.mIndex]);

    const renderMarker = useCallback((listing: Listing, index: number) => {
        if (!valid_coords(listing.location.lat, listing.location.lng)) {
            return null;
        }
        
        return (
            <Marker
                key={listing.id}
                coordinate={{
                    latitude: listing.location.lat,
                    longitude: listing.location.lng,
                }}
                onPress={() => handleMarkerPress(listing, index)}
            >
                <View style={[styles.markerContainer, { 
                    backgroundColor: index === state.mIndex ? apColors.appColor : apColors.secondBg,
                    borderColor: apColors.appColor
                }]}>
                    <TextHeavy style={[styles.markerText, { 
                        color: index === state.mIndex ? '#FFF' : apColors.regularText 
                    }]}>
                        {fomartCurrOut(listing.price)}
                    </TextHeavy>
                </View>
            </Marker>
        );
    }, [apColors, state.mIndex, handleMarkerPress]);

    // Memoized markers to prevent unnecessary re-renders
    const markers = useMemo(() => 
        listings.map((listing, index) => renderMarker(listing, index)).filter(Boolean),
        [listings, renderMarker]
    );

    useEffect(() => {
        // Set initial region based on user location or first listing
        if (userLocation && valid_coords(userLocation.lat, userLocation.lng)) {
            setState(prevState => ({
                ...prevState,
                region: {
                    latitude: userLocation.lat,
                    longitude: userLocation.lng,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                }
            }));
        } else if (listings.length > 0) {
            const firstListing = listings[0];
            if (valid_coords(firstListing.location.lat, firstListing.location.lng)) {
                setState(prevState => ({
                    ...prevState,
                    region: {
                        latitude: firstListing.location.lat,
                        longitude: firstListing.location.lng,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                    }
                }));
            }
        }
    }, [userLocation, listings]);

    const { mIndex, selectedListing, region } = state;

    return (
        <SafeAreaConsumer>
            {insets => (
                <View style={[styles.container, { 
                    backgroundColor: apColors.appBg,
                    paddingTop: insets.top,
                    paddingLeft: insets.left,
                    paddingRight: insets.right
                }]}>
                    {/* Map */}
                    <MapView
                        ref={mapRef}
                        style={styles.map}
                        initialRegion={region}
                        showsUserLocation={true}
                        showsMyLocationButton={true}
                    >
                        {markers}
                        
                        {/* User location circle */}
                        {userLocation && valid_coords(userLocation.lat, userLocation.lng) && (
                            <Circle
                                center={{
                                    latitude: userLocation.lat,
                                    longitude: userLocation.lng,
                                }}
                                radius={1000}
                                strokeColor={apColors.appColor}
                                fillColor={apColors.appColor + '20'}
                            />
                        )}
                    </MapView>

                    {/* Close Button */}
                    <View style={styles.closeButtonContainer}>
                        <CloseButton
                            color={apColors.backBtn}
                            onPress={handleClose}
                        />
                    </View>

                    {/* Listings List */}
                    <View style={[styles.listingsContainer, { backgroundColor: apColors.appBg }]}>
                        <View style={styles.listingsHeader}>
                            <TextHeavy style={[styles.listingsTitle, { color: apColors.hText }]}>
                                {translate('nearby_listings', '', {})}
                            </TextHeavy>
                            <TextMedium style={[styles.listingsCount, { color: apColors.addressText }]}>
                                {listings.length} {translate('results', '', {})}
                            </TextMedium>
                        </View>

                        <FlatList
                            ref={listingListRef}
                            data={listings}
                            renderItem={renderListing}
                            keyExtractor={(item) => item.id.toString()}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            onViewableItemsChanged={onViewableItemsChanged}
                            viewabilityConfig={viewabilityConfig}
                            contentContainerStyle={styles.listingsContent}
                        />
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
    map: {
        flex: 1,
    } as ViewStyle,
    closeButtonContainer: {
        position: 'absolute',
        top: 50,
        right: 15,
        zIndex: 1,
    } as ViewStyle,
    listingsContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        maxHeight: 200,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 15,
    } as ViewStyle,
    listingsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        marginBottom: 10,
    } as ViewStyle,
    listingsTitle: {
        fontSize: 18,
    } as TextStyle,
    listingsCount: {
        fontSize: 14,
    } as TextStyle,
    listingsContent: {
        paddingHorizontal: 15,
    } as ViewStyle,
    markerContainer: {
        width: 60,
        height: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
    } as ViewStyle,
    markerText: {
        fontSize: 12,
        fontWeight: 'bold',
    } as TextStyle,
});

// Redux connection
const mapStateToProps = (state: AppState): ReduxState => ({
    listings: state.listings?.items || [],
    userLocation: state.user?.location || null,
});

export default connect(mapStateToProps)(MapScreen);