import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import {
    Image,
    TextInput,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    RefreshControl,
    Platform,
    PermissionsAndroid,
    ViewStyle,
    TextStyle,
    ImageStyle,
    ActivityIndicator
} from 'react-native';
import { SafeAreaConsumer } from 'react-native-safe-area-context';
import Geolocation from '@react-native-community/geolocation';
import { connect } from 'react-redux';
import { useSelector } from 'react-redux';

import { filterByLoc, filterByCat, filterNearBy, getSiteDatas, getLatestListings } from '../helpers/store';
import { translate } from "../helpers/i18n";
import { extractPostParams } from "../helpers/store";
import { SearchSvg, CloseSvg, AvatarSvg, MarkerSvg } from '../components/icons/ButtonSvgIcons';
import Search from '../components/explore/Search';
import ImageBanner from '../components/explore/ImageBanner';
import DiscoverNew from '../components/explore/DiscoverNew';
import { User, SiteData, Listing } from '../types';
import { StackNavigationProp } from '@react-navigation/stack';
import { themedColors } from '../constants/Colors';
import Locations from '../components/explore/Locations';
import LocationsCol from '../components/explore/LocationsCol';

// Types
interface SearchResult {
    type: 'listing' | 'loc' | 'cat';
    title: string;
    id: number;
    thumbnail?: string;
}

interface HomeScreenState {
    data: any[];
    showSearch: boolean;
    stext: string;
    results: SearchResult[];
    showClear: boolean;
    scrollDir: string;
    latestListings: Listing[];
    loadingListings: boolean;
    refreshing: boolean;
}

type RootStackParamList = {
    Home: undefined;
    Listing: { id: number; title: string };
    Archive: undefined;
    ProfileStack: { screen: string };
    SignIn: undefined;
};

interface HomeScreenProps {
    navigation: StackNavigationProp<RootStackParamList>;
    apTheme: 'light' | 'dark';
    user: User;
    site: SiteData;
    listings: {
        items: Listing[];
        pages: {
            current: number;
            total: number;
        };
        loading: boolean;
    };
}

// Component
const HomeScreen: React.FC<HomeScreenProps> = ({ 
    navigation, 
    user,
}) => {
    const apColors = useSelector((state: any) => state.apColors) || themedColors.default;
    const site = useSelector((state: any) => state.site);
    const listings = useSelector((state: any) => state.listings);
    
    const [state, setState] = useState<HomeScreenState>({
        data: [],
        showSearch: false,
        stext: '',
        results: [],
        showClear: false,
        scrollDir: '',
        latestListings: [],
        loadingListings: false,
        refreshing: false,
    });

    const searchInputRef = useRef<TextInput>(null);

    // Fetch listings on mount
    useEffect(() => {
        loadLatestListings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Load latest listings from API
    const loadLatestListings = useCallback(async () => {
        try {
            setState(prevState => ({ ...prevState, loadingListings: true }));
            const result = await getLatestListings(16);
            setState(prevState => ({ 
                ...prevState, 
                latestListings: result.items || [],
                loadingListings: false 
            }));
        } catch (error) {
            console.error('Error loading latest listings:', error);
            setState(prevState => ({ ...prevState, loadingListings: false }));
        }
    }, []);

    // Navigation options
    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    const goToListing = useCallback((p: any) => {
        navigation.navigate('Listing', extractPostParams(p));
    }, [navigation]);

    const openSearch = useCallback(() => {
        setState(prevState => {
            const newShowSearch = !prevState.showSearch;
            
            setTimeout(() => {
                if (searchInputRef.current) {
                    searchInputRef.current.focus();
                }
            }, 1000);
            
            return { ...prevState, showSearch: newShowSearch };
        });
    }, []);

    const hideSearch = useCallback(() => {
        setState(prevState => ({
            ...prevState,
            showSearch: false,
            showClear: false,
            stext: ''
        }));
    }, []);

    const onInputChange = useCallback((stext: string) => {
        setState(prevState => {
            let showClear = false;
            let results: SearchResult[] = [];

            if (stext.length > 0) {
                showClear = true;
                const sLText = stext.toLowerCase();

                // Search in latest listings from API
                if (prevState.latestListings && Array.isArray(prevState.latestListings) && prevState.latestListings.length > 0) {
                    const resultListings = prevState.latestListings.filter(
                        lpost => lpost.title && lpost.title.toLowerCase().indexOf(sLText) !== -1
                    );
                    if (Array.isArray(resultListings) && resultListings.length > 0) {
                        resultListings.forEach(rtax => {
                            results.push({
                                type: 'listing',
                                title: rtax.title,
                                id: rtax.ID || rtax.id,
                                thumbnail: rtax.thumbnail,
                            });
                        });
                    }
                }

                // Fallback to site listings if API listings not available
                if (results.length === 0 && site) {
                    const { listings: siteListings } = site;
                    if (siteListings && Array.isArray(siteListings) && siteListings.length > 0) {
                        const resultListings = siteListings.filter(
                            lpost => lpost.title && lpost.title.toLowerCase().indexOf(sLText) !== -1
                        );
                        if (Array.isArray(resultListings) && resultListings.length > 0) {
                            resultListings.forEach(rtax => {
                                results.push({
                                    type: 'listing',
                                    title: rtax.title,
                                    id: rtax.ID,
                                    thumbnail: rtax.thumbnail,
                                });
                            });
                        }
                    }
                }

                // Search for locations
                if (site) {
                    const { locs } = site;
                    if (locs && Array.isArray(locs) && locs.length > 0) {
                        const resultLocs = locs.filter(
                            tax => tax.title && tax.title.toLowerCase().indexOf(sLText) !== -1
                        );
                        if (Array.isArray(resultLocs) && resultLocs.length > 0) {
                            resultLocs.forEach(rtax => {
                                results.push({
                                    type: 'loc',
                                    title: rtax.title,
                                    id: rtax.id,
                                });
                            });
                        }
                    }
                }

            }

            return {
                ...prevState,
                showClear,
                stext,
                results
            };
        });
    }, [site]);

    const onClearText = useCallback(() => {
        setState(prevState => ({
            ...prevState,
            stext: '',
            showClear: false
        }));
    }, []);

    const onClickLoc = useCallback((term: { id: number }) => {
        if (term.id) {
            filterByLoc(term.id);
            navigation.navigate('Archive');
        }
    }, [navigation]);

    const onClickCat = useCallback((term: { id: number }) => {
        if (term.id) {
            filterByCat(term.id);
            navigation.navigate('Archive');
        }
    }, [navigation]);

    const getGeoLocation = useCallback(async () => {
        try {
            await Geolocation.getCurrentPosition(
                (position) => {
                    if (position.coords) {
                        const { latitude, longitude } = position.coords;
                        filterNearBy(latitude, longitude);
                        navigation.navigate('Archive');
                    }
                },
                (error) => {
                    console.log('Geolocation error:', error);
                },
                { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
            );
        } catch (error) {
            console.log('Geolocation error:', error);
        }
    }, [navigation]);

    const onNearBy = useCallback(async () => {
        if (Platform.OS === 'ios') {
            Geolocation.requestAuthorization();
            getGeoLocation();
        } else {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: translate('locrequest', 'title', {}),
                        message: translate('locrequest', 'message', {}),
                        buttonNeutral: translate('locrequest', 'buttonNeutral', {}),
                        buttonNegative: translate('locrequest', 'buttonNegative', {}),
                        buttonPositive: translate('locrequest', 'buttonPositive', {}),
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    getGeoLocation();
                }
            } catch (err) {
                console.warn(err);
            }
        }
    }, [getGeoLocation]);

    const onRefresh = useCallback(async () => {
        try {
            setState(prevState => ({ ...prevState, refreshing: true }));
            await Promise.all([
                getSiteDatas(),
                loadLatestListings(),
            ]);
            setState(prevState => ({ ...prevState, refreshing: false }));
        } catch (error) {
            console.error('Error refreshing data:', error);
            setState(prevState => ({ ...prevState, refreshing: false }));
        }
    }, [loadLatestListings]);

    const { isLoggedIn, avatar } = user;
    const { 
        showSearch, 
        stext, 
        results, 
        showClear, 
        latestListings, 
        loadingListings,
        refreshing 
    } = state;

    // Use API latest listings if available, fallback to site listings
    const displayListings = useMemo(() => {
        return latestListings.length > 0 ? latestListings : (site?.listings || []);
    }, [latestListings, site?.listings]);

    // Add null check for apColors after all hooks
    if (!apColors) {
        return null;
    }

    const headerSearchStyle: ViewStyle = {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: apColors?.appBg || '#FFFFFF',
    };

    return (
        <SafeAreaConsumer>
            {insets => (
                <View style={[styles.container, { backgroundColor: apColors?.appBg || '#FFFFFF', paddingTop: insets?.top || 0, paddingLeft: insets?.left || 0, paddingRight: insets?.right || 0 }]}>
                    <View style={headerSearchStyle}>
                        <TouchableOpacity onPress={openSearch} style={{ flex: 1, height: 40 }}>
                            <Search />
                        </TouchableOpacity>
                        
                        {isLoggedIn ? (
                            <TouchableOpacity 
                                style={{ paddingLeft: 20 }} 
                                onPress={() => navigation.navigate('ProfileStack', { screen: 'Profile' })}
                            >
                                {avatar ? (
                                    <Image
                                        source={{ uri: avatar }}
                                        style={[styles.avatar, { borderColor: apColors?.avatarIcon || '#979797' }]}
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <View style={[styles.avatar, { borderColor: apColors?.avatarIcon || '#979797', alignItems: 'center', justifyContent: 'center' }]}>
                                        <AvatarSvg fill={apColors?.avatarIcon || '#979797'} />
                                    </View>
                                )}
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity 
                                style={{ paddingLeft: 20 }} 
                                onPress={() => navigation.navigate('SignIn')}
                            >
                                <View style={[styles.avatar, { borderColor: apColors?.avatarIcon || '#979797', alignItems: 'center', justifyContent: 'center' }]}>
                                    <AvatarSvg fill={apColors?.avatarIcon || '#979797'} />
                                </View>
                            </TouchableOpacity>
                        )}
                    </View>

                    {showSearch && (
                        <View style={[styles.searchContainer, { backgroundColor: apColors?.appBg || '#FFFFFF' }]}>
                            <View style={[styles.searchInputContainer, { backgroundColor: apColors?.searchBg || 'rgba(142,142,147,0.12)' }]}>
                                <SearchSvg color={apColors?.searchText || '#C7C7CC'} />
                                <TextInput
                                    ref={searchInputRef}
                                    style={[styles.searchInput, { color: apColors?.regularText || '#1E2432' }]}
                                    placeholder={translate('search_placeholder', '', {})}
                                    placeholderTextColor={apColors?.searchText || '#C7C7CC'}
                                    value={stext}
                                    onChangeText={onInputChange}
                                />
                                {showClear && (
                                    <TouchableOpacity onPress={onClearText}>
                                        <CloseSvg color={apColors?.searchText || '#C7C7CC'} />
                                    </TouchableOpacity>
                                )}
                            </View>
                            
                            {results.length > 0 && (
                                <ScrollView style={styles.searchResults}>
                                    {results.map((result, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={styles.searchResultItem}
                                            onPress={() => {
                                                if (result.type === 'listing') {
                                                    goToListing({ id: result.id, title: result.title });
                                                } else if (result.type === 'loc') {
                                                    onClickLoc({ id: result.id });
                                                } else if (result.type === 'cat') {
                                                    onClickCat({ id: result.id });
                                                }
                                                hideSearch();
                                            }}
                                        >
                                            <Text style={[styles.searchResultText, { color: apColors?.regularText || '#1E2432' }]}>
                                                {result.title}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            )}
                        </View>
                    )}

                    <ScrollView
                        style={{ flex: 1 }}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing || listings.loading}
                                onRefresh={onRefresh}
                                tintColor={apColors?.appColor || '#4DB7FE'}
                            />
                        }
                    >
                        
                        <TouchableOpacity 
                            style={[styles.nearbyButton, { backgroundColor: apColors?.appColor || '#4DB7FE' }]}
                            onPress={onNearBy}
                        >
                            <MarkerSvg fill="#FFF" />
                            <Text style={styles.nearbyButtonText}>
                                {translate('nearby', '', {})}
                            </Text>
                        </TouchableOpacity>
                        
                        {loadingListings ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator 
                                    size="small" 
                                    color={apColors?.appColor || '#4DB7FE'} 
                                />
                            </View>
                        ) : (
                            <DiscoverNew 
                                navigation={navigation}
                                apColors={apColors} 
                                eleObj={{
                                    title: translate('discover_new'),
                                    data: displayListings,
                                    show_view_all: true,
                                    viewall_text: translate('view_all')
                                }}
                                goToListing={goToListing}
                            />
                        )}
                        {/* <DiscoverCarousel 
                            apColors={apColors} 
                            goToListing={goToListing}
                        />
                        
                        <Popular 
                            apColors={apColors} 
                            goToListing={goToListing}
                        /> */}
                    </ScrollView>
                </View>
            )}
        </SafeAreaConsumer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    } as ViewStyle,
    searchContainer: {
        paddingHorizontal: 15,
        paddingVertical: 10,
    } as ViewStyle,
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 8,
    } as ViewStyle,
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
    } as TextStyle,
    searchResults: {
        maxHeight: 200,
        marginTop: 10,
    } as ViewStyle,
    searchResultItem: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    } as ViewStyle,
    searchResultText: {
        fontSize: 16,
    } as TextStyle,
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
    } as ImageStyle,
    nearbyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 15,
        marginVertical: 10,
        paddingVertical: 15,
        borderRadius: 8,
    } as ViewStyle,
    nearbyButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    } as TextStyle,
    loadingContainer: {
        paddingVertical: 20,
        alignItems: 'center',
        justifyContent: 'center',
    } as ViewStyle,
});

// Redux connection
const mapStateToProps = (state: any) => ({
    user: state.user,
    site: state.site,
    listings: state.listings,
});

export default connect(mapStateToProps)(HomeScreen);
