import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
    TextInput,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    RefreshControl,
    Platform,
    PermissionsAndroid,
    ActivityIndicator,
    Alert
} from 'react-native';
import { SafeAreaConsumer } from 'react-native-safe-area-context';
import { connect } from 'react-redux';
import Geolocation from '@react-native-community/geolocation';

import { translate } from "../helpers/i18n";
import { extractPostParams } from "../helpers/store";
import TextRegular from '../components/ui/TextRegular';
import TextHeavy from '../components/ui/TextHeavy';
import { SearchSvg, CloseSvg, MarkerSvg } from '../components/icons/ButtonSvgIcons';
import { ThemeColors, NavigationProp, Listing, Location } from '../types';

// Types
interface NearScreenState {
    listings: Listing[];
    loading: boolean;
    refreshing: boolean;
    searchText: string;
    selectedCategory: string;
    userLocation: Location | null;
    locationPermission: boolean;
    filteredListings: Listing[];
}

interface NearScreenProps {
    navigation: NavigationProp;
    apColors: ThemeColors;
    listings: Listing[];
    categories: any[];
    site: any;
    listingsLoading: boolean;
}

const NearScreen: React.FC<NearScreenProps> = ({ navigation, apColors, listings, categories, listingsLoading }) => {
    const [state, setState] = useState<NearScreenState>({
        listings: [],
        loading: true,
        refreshing: false,
        searchText: '',
        selectedCategory: '',
        userLocation: null,
        locationPermission: false,
        filteredListings: [],
    });

    // Navigation options
    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    const requestLocationPermission = useCallback(async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: translate('location_permission'),
                        message: translate('location_permission_message'),
                        buttonNeutral: translate('ask_me_later'),
                        buttonNegative: translate('cancel'),
                        buttonPositive: translate('ok'),
                    }
                );
                
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    setState(prevState => ({ ...prevState, locationPermission: true }));
                    return true;
                } else {
                    setState(prevState => ({ ...prevState, locationPermission: false }));
                    return false;
                }
            } catch (err) {
                console.warn(err);
                return false;
            }
        }
        return true;
    }, []);

    const getCurrentLocation = useCallback(() => {
        Geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setState(prevState => ({
                    ...prevState,
                    userLocation: { 
                        id: 0, 
                        name: 'Current Location', 
                        lat: latitude, 
                        lng: longitude 
                    },
                }));
            },
            (error) => {
                console.log('Location error:', error);
                Alert.alert(
                    translate('location_error'),
                    translate('location_error_message'),
                    [{ text: translate('ok') }]
                );
            },
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
    }, []);

    const loadListings = useCallback(async () => {
        try {
            // Use the listings from props (which come from Redux store)
            const listingsData = listings || [];
            
            setState(prevState => ({
                ...prevState,
                listings: listingsData,
                loading: false,
                refreshing: false,
            }));
            
        } catch (error) {
            console.error('Error loading listings:', error);
            setState(prevState => ({
                ...prevState,
                loading: false,
                refreshing: false,
            }));
        }
    }, [listings]);

    const filterListings = useCallback(() => {
        let filtered = [...state.listings];

        // Filter by search text
        if (state.searchText) {
            filtered = filtered.filter(listing => 
                listing.title?.toLowerCase().includes(state.searchText.toLowerCase()) ||
                listing.address?.toLowerCase().includes(state.searchText.toLowerCase())
            );
        }

        // Filter by category
        if (state.selectedCategory) {
            filtered = filtered.filter(listing => 
                listing.categories?.some(cat => cat.id.toString() === state.selectedCategory)
            );
        }

        // Filter by nearby location (simplified - just return all for now)
        // TODO: Implement proper distance-based filtering
        if (state.userLocation) {
            // For now, just return all listings when location is available
            // In a real implementation, you would calculate distance and filter
        }

        setState(prevState => ({
            ...prevState,
            filteredListings: filtered,
        }));
    }, [state.listings, state.searchText, state.selectedCategory, state.userLocation]);

    const handleRefresh = useCallback(() => {
        setState(prevState => ({ ...prevState, refreshing: true }));
        loadListings();
    }, [loadListings]);

    const handleSearchChange = useCallback((text: string) => {
        setState(prevState => ({ ...prevState, searchText: text }));
    }, []);

    const handleCategorySelect = useCallback((category: string) => {
        setState(prevState => ({ 
            ...prevState, 
            selectedCategory: prevState.selectedCategory === category ? '' : category 
        }));
    }, []);

    const handleLocationPress = useCallback(() => {
        if (state.locationPermission) {
            getCurrentLocation();
        } else {
            requestLocationPermission().then((granted) => {
                if (granted) {
                    getCurrentLocation();
                }
            });
        }
    }, [state.locationPermission, requestLocationPermission, getCurrentLocation]);

    const handleListingPress = useCallback((listing: Listing) => {
        const params = extractPostParams(listing);
        navigation.navigate('Listing', { 
            ...params,
            id: listing.id,
            title: listing.title,
        });
    }, [navigation]);

    useEffect(() => {
        loadListings();
        requestLocationPermission();
    }, [loadListings, requestLocationPermission]);

    useEffect(() => {
        filterListings();
    }, [filterListings]);

    // Update filtered listings when listings prop changes
    useEffect(() => {
        if (listings && listings?.length > 0) {
            setState(prevState => ({
                ...prevState,
                listings: listings,
            }));
        }
    }, [listings]);

    const { 
        loading, 
        refreshing, 
        searchText, 
        selectedCategory, 
        locationPermission, 
        filteredListings 
    } = state;

    // Memoized components for better performance
    const refreshControl = useMemo(() => (
        <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={apColors?.appColor || '#4DB7FE'}
            colors={[apColors?.appColor || '#4DB7FE']}
        />
    ), [refreshing, handleRefresh, apColors?.appColor]);

    const searchInput = useMemo(() => (
        <TextInput
            style={[styles.searchInput, { 
                color: apColors?.regularText || '#1E2432',
            }]}
            placeholder={translate('search_nearby')}
            placeholderTextColor={apColors?.fieldLbl || '#BEC2CE'}
            value={searchText}
            onChangeText={handleSearchChange}
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
        />
    ), [searchText, handleSearchChange, apColors]);

    const locationButton = useMemo(() => (
        <TouchableOpacity 
            style={[styles.locationButton, { 
                backgroundColor: locationPermission ? apColors?.appColor || '#4DB7FE' : apColors?.separator || '#EAECEF' 
            }]}
            onPress={handleLocationPress}
            accessibilityLabel={translate('get_location')}
            accessibilityHint={translate('get_location_hint')}
        >
            <MarkerSvg color="#FFF" />
        </TouchableOpacity>
    ), [locationPermission, apColors, handleLocationPress]);

    // Add null check for apColors after all hooks
    if (!apColors) {
        return <View style={{ flex: 1 }} />
    }

    return (
        <SafeAreaConsumer>
            {insets => (
                <View style={[styles.container, { 
                    backgroundColor: apColors?.appBg || '#FFFFFF',
                    paddingTop: insets?.top || 0,
                    paddingLeft: insets?.left || 0,
                    paddingRight: insets?.right || 0
                }]}>
                    <View style={[styles.header, { backgroundColor: apColors?.secondBg || '#F7F8FA', borderBottomColor: apColors?.separator || '#EAECEF' }]}>
                        <View style={styles.searchContainer}>
                            <SearchSvg color={apColors?.addressText || '#B8BBC6'} />
                            {searchInput}
                            {searchText ? (
                                <TouchableOpacity 
                                    onPress={() => handleSearchChange('')}
                                    accessibilityLabel={translate('clear_search')}
                                >
                                    <CloseSvg color={apColors?.addressText || '#B8BBC6'} />
                                </TouchableOpacity>
                            ) : null}
                        </View>
                        
                        {locationButton}
                    </View>

                    <ScrollView
                        style={styles.scrollView}
                        refreshControl={refreshControl}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.categoriesSection}>
                            <TextHeavy style={[styles.sectionTitle, { color: apColors?.hText || '#1E2432' }]}>
                                {translate('filter.categories')}
                            </TextHeavy>
                            <ScrollView 
                                horizontal 
                                showsHorizontalScrollIndicator={false}
                                style={styles.categoriesScroll}
                            >
                                {(categories || []).map((category: any) => (
                                    <TouchableOpacity
                                        key={category.id}
                                        style={[
                                            styles.categoryButton,
                                            {
                                                backgroundColor: selectedCategory === category.id.toString() 
                                                    ? apColors?.appColor || '#4DB7FE' 
                                                    : apColors?.separator || '#EAECEF'
                                            }
                                        ]}
                                        onPress={() => handleCategorySelect(category.id.toString())}
                                    >
                                        <Text style={[
                                            styles.categoryText,
                                            selectedCategory === category.id.toString() 
                                                ? styles.categoryTextSelected
                                                : { color: apColors?.regularText || '#1E2432' }
                                        ]}>
                                            {category.name || ''}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        <View style={styles.listingsSection}>
                            <View style={styles.listingsHeader}>
                                <TextHeavy style={[styles.sectionTitle, { color: apColors?.hText || '#1E2432' }]}>
                                    {translate('nearby_listings')}
                                </TextHeavy>
                                <TextRegular style={[styles.resultsCount, { color: apColors.addressText }]}>
                                    {`${filteredListings?.length || 0} ${translate('results')}`}
                                </TextRegular>
                            </View>

                            {loading || listingsLoading ? (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator 
                                        size="large" 
                                        color={apColors.appColor} 
                                    />
                                    <Text style={[styles.loadingText, { color: apColors.regularText }]}>
                                        {translate('loading') + '...'}
                                    </Text>
                                </View>
                            ) : filteredListings?.length > 0 ? (
                                <View style={styles.listingsContainer}>
                                    {filteredListings.map((listing: Listing) => (
                                        <TouchableOpacity
                                            key={listing.id}
                                            style={[styles.listingItem, { 
                                                backgroundColor: apColors?.secondBg || '#F7F8FA',
                                                borderColor: apColors?.separator || '#EAECEF'
                                            }]}
                                            onPress={() => handleListingPress(listing)}
                                        >
                                            <View style={styles.listingContent}>
                                                <TextHeavy style={[styles.listingTitle, { color: apColors?.hText || '#1E2432' }]}>
                                                    {listing.title || ''}
                                                </TextHeavy>
                                                {listing.address && (
                                                    <TextRegular style={[styles.listingAddress, { color: apColors?.addressText || '#B8BBC6' }]}>
                                                        {String(listing.address || '')}
                                                    </TextRegular>
                                                )}
                                                {(listing.price != null && listing.price !== '' && 
                                                    (typeof listing.price === 'string' || typeof listing.price === 'number')) && (
                                                    <TextHeavy style={[styles.listingPrice, { color: apColors?.appColor || '#4DB7FE' }]}>
                                                        {String(listing.price)}
                                                    </TextHeavy>
                                                )}
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            ) : (
                                <View style={styles.emptyContainer}>
                                    <Text style={[styles.emptyText, { color: apColors.regularText }]}>
                                        {translate('no_listings_found')}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </ScrollView>
                </View>
            )}
        </SafeAreaConsumer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomWidth: 1,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        fontFamily: 'System',
        backgroundColor: 'transparent',
    },
    locationButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollView: {
        flex: 1,
    },
    categoriesSection: {
        paddingHorizontal: 15,
        paddingVertical: 15,
        marginTop: 10,
    },
    categoriesScroll: {
        marginTop: 10,
    },
    categoryButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 10,
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '500',
    },
    categoryTextSelected: {
        color: '#FFFFFF',
    },
    listingsSection: {
        paddingHorizontal: 15,
        paddingVertical: 15,
    },
    listingsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    resultsCount: {
        fontSize: 14,
    },
    loadingContainer: {
        paddingVertical: 40,
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        marginTop: 10,
    },
    emptyContainer: {
        paddingVertical: 40,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
    },
    listingsContainer: {
        gap: 10,
    },
    listingItem: {
        borderRadius: 8,
        borderWidth: 1,
        padding: 15,
        marginBottom: 10,
    },
    listingContent: {
        flex: 1,
    },
    listingTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    listingAddress: {
        fontSize: 14,
        marginBottom: 5,
    },
    listingPrice: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

const mapStateToProps = (state: any) => ({
    apColors: state.apColors,
    listings: state.listings?.items || [],
    categories: state.site?.cats || [],
    site: state.site,
    listingsLoading: state.listings?.loading || false,
});

export default connect(mapStateToProps)(NearScreen);
