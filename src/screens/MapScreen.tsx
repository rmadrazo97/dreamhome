import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    Dimensions,
    ViewStyle,
    TextStyle
} from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import { connect, useSelector } from 'react-redux';
import NavigationService from '../helpers/NavigationService';
import { extractPostParams } from "../helpers/store";
import { valid_coords } from '../helpers/currency';
import { translate } from "../helpers/i18n";
import { themedColors } from '../constants/Colors';
import CloseButton from '../components/inners/CloseButton';
import MapCard from '../components/inners/MapCard';
import TextMedium from '../components/ui/TextMedium';
import TextHeavy from '../components/ui/TextHeavy';
import { NavigationProp, Listing, Location } from '../types';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    listings: Listing[];
    userLocation: Location | null;
}

interface ReduxState {
    listings: Listing[];
    userLocation: Location | null;
}

const MapScreen: React.FC<MapScreenProps> = ({ navigation, listings, userLocation }) => {
    const apColors = useSelector((state: any) => state.apColors) || themedColors.default;
    
    // Default to Guatemala City coordinates if no user location
    const defaultLat = 14.6349;
    const defaultLng = -90.5069;
    
    const [state, setState] = useState<MapScreenState>({
        mIndex: 0,
        selectedListing: null,
        region: {
            latitude: userLocation?.lat || defaultLat,
            longitude: userLocation?.lng || defaultLng,
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
        const { viewableItems } = info;
        
        if (viewableItems.length > 0) {
            const newIndex = viewableItems[0].index;
            setState(prevState => {
                if (prevState.mIndex === newIndex) {
                    return prevState;
                }
                
                // Animate map to selected listing
                const selectedListing = listings[newIndex];
                if (selectedListing) {
                    const lat = selectedListing.latitude ?? selectedListing.location?.lat;
                    const lng = selectedListing.longitude ?? selectedListing.location?.lng;
                    if (lat && lng && valid_coords(lat, lng)) {
                        mapRef.current?.animateToRegion({
                            latitude: lat,
                            longitude: lng,
                            latitudeDelta: LATITUDE_DELTA,
                            longitudeDelta: LONGITUDE_DELTA,
                        }, 1000);
                    }
                }
                
                return {
                    ...prevState,
                    mIndex: newIndex,
                    selectedListing: listings[newIndex] || null,
                };
            });
        }
    }, [listings]);

    const handleMarkerPress = useCallback((listing: Listing, index: number) => {
        setState(prevState => ({
            ...prevState,
            mIndex: index,
            selectedListing: listing,
        }));

        // Scroll to selected listing in FlatList
        listingListRef.current?.scrollToIndex({ index, animated: true });
    }, []);

    const handleListingPress = useCallback((listing: Listing, index: number) => {
        if (state.mIndex === index) {
                navigation.navigate('Listing', { id: listing.ID as number, title: listing.title });
                return;
        }
        setState(prevState => ({
            ...prevState,
            mIndex: index,
            selectedListing: listing,
        }));
        if (listing) {
            const lat = listing.latitude ?? listing.location?.lat;
            const lng = listing.longitude ?? listing.location?.lng;
            if (lat && lng && valid_coords(lat, lng)) {
                mapRef.current?.animateToRegion({
                    latitude: lat,
                    longitude: lng,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                }, 1000);
            }
        }
    }, [navigation, state.mIndex]);

    const handleClose = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const renderListing = useCallback(({ item, index }: { item: Listing; index: number }) => (
        <MapCard
            listing={item}
            apColors={apColors}
            onPress={() => handleListingPress(item, index)}
            isSelected={index === state.mIndex}
        />
    ), [apColors, handleListingPress, state.mIndex]);

    const renderMarker = useCallback((listing: Listing, index: number) => {
        // Support both formats: direct latitude/longitude or nested location object
        const lat = listing.latitude ?? listing.location?.lat;
        const lng = listing.longitude ?? listing.location?.lng;
        
        if (!lat || !lng || !valid_coords(lat, lng)) {
            return null;
        }
        
        return (
            <Marker
                key={listing.id}
                coordinate={{
                    latitude: lat,
                    longitude: lng,
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
                        {listing.title}
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
            const lat = firstListing.latitude ?? firstListing.location?.lat;
            const lng = firstListing.longitude ?? firstListing.location?.lng;
            if (lat != null && lng != null && valid_coords(lat, lng)) {
                setState(prevState => ({
                    ...prevState,
                    region: {
                        latitude: lat as number,
                        longitude: lng as number,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                    }
                }));
            }
        }
    }, [userLocation, listings]);

    const { region } = state;

    // Ensure region is valid before rendering map
    const isValidRegion = region.latitude !== 0 && region.longitude !== 0 && 
                          !isNaN(region.latitude) && !isNaN(region.longitude);

    return (
                <SafeAreaView style={[styles.container, { 
                    backgroundColor: apColors.appBg,
                }]}>
                    {/* Map */}
                    {isValidRegion ? (
                        <MapView
                            ref={mapRef}
                            style={styles.map}
                            initialRegion={region}
                            region={region}
                            showsUserLocation={false}
                            showsMyLocationButton={false}
                            mapType="standard"
                            loadingEnabled={true}
                            loadingIndicatorColor={apColors.appColor}
                            onMapReady={() => {
                                console.log('Map ready');
                            }}
                        >
                        {markers}
                        
                        {/* User location circle */}
                        {/* {userLocation && valid_coords(userLocation.lat, userLocation.lng) && (
                            <Circle
                                center={{
                                    latitude: userLocation.lat,
                                    longitude: userLocation.lng,
                                }}
                                radius={10}
                                // strokeColor={apColors.appColor}
                                // fillColor={apColors.appColor + '20'}
                            />
                        )} */}
                        </MapView>
                    ) : (
                        <View style={[styles.map, { backgroundColor: apColors.secondBg, justifyContent: 'center', alignItems: 'center' }]}>
                            <TextHeavy style={{ color: apColors.regularText }}>
                                {translate('loading', '', {})}
                            </TextHeavy>
                        </View>
                    )}

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
                                {listings.length + ' ' + translate('results', '', {})}
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
                </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    } as ViewStyle,
    map: {
        flex: 1,
        backgroundColor: 'transparent',
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
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 15,
        paddingBottom: 15,
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
        minWidth: 100,
        maxWidth: 250,
        padding: 10,
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
const mapStateToProps = (state: any): ReduxState => ({
    listings: state.listings?.items || [],
    userLocation: (state.user?.location || state.userLocation) || null,
});

export default connect(mapStateToProps)(MapScreen);