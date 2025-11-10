import React, { useState, useCallback, useEffect } from 'react';
import { 
    View, 
    Image,
    TextInput, 
    ScrollView,
    TouchableOpacity, 
    StyleSheet,
    ViewStyle,
    TextStyle,
    ImageStyle
} from 'react-native';
import { SafeAreaConsumer } from 'react-native-safe-area-context';
import { connect } from 'react-redux';

import { filterByLoc, filterByCat } from '../helpers/store';
import { translate } from "../helpers/i18n";
import { extractPostParams } from "../helpers/store";
import CloseButton from '../components/inners/CloseButton';
import TextRegular from '../components/ui/TextRegular';
import TextMedium from '../components/ui/TextMedium';
import TextHeavy from '../components/ui/TextHeavy';
import { SearchSvg, CloseSvg, MarkerSvg, LightningSvg, PinterSvg } from '../components/icons/ButtonSvgIcons';
import { ThemeColors, NavigationProp, Listing, SearchResult } from '../types';

// Types
interface SearchScreenState {
    stext: string;
    results: SearchResult[];
    showClear: boolean;
    loading: boolean;
}

interface SearchScreenProps {
    navigation: NavigationProp;
    apColors: ThemeColors;
    site: any;
    listings: Listing[];
}

const SearchScreen: React.FC<SearchScreenProps> = ({ navigation, apColors, site, listings }) => {
    const [state, setState] = useState<SearchScreenState>({
        stext: '',
        results: [],
        showClear: false,
        loading: false,
    });

    // Navigation options
    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    const onInputChange = useCallback((stext: string) => {
        let results: SearchResult[] = [];
        
        if (stext.length > 0) {
            const sLText = stext.toLowerCase();
            
            if (site && site.listings) {
                // Search for listings
                const filteredListings = filterByLoc(site.listings, sLText);
                results = filteredListings.map(listing => ({
                    type: 'listing',
                    id: listing.id,
                    title: listing.title,
                    subtitle: listing.address,
                    image: listing.thumbnail,
                    data: listing,
                }));
            }
            
            // Search for categories
            if (site && site.categories) {
                const filteredCategories = site.categories.filter((cat: any) => 
                    cat.name.toLowerCase().includes(sLText)
                );
                results = results.concat(filteredCategories.map(cat => ({
                    type: 'category',
                    id: cat.id,
                    title: cat.name,
                    subtitle: `${cat.count} ${translate('listings')}`,
                    image: cat.image,
                    data: cat,
                })));
            }
        }

        setState(prevState => ({
            ...prevState,
            stext,
            results,
            showClear: stext.length > 0,
        }));
    }, [site]);

    const handleClearSearch = useCallback(() => {
        setState(prevState => ({
            ...prevState,
            stext: '',
            results: [],
            showClear: false,
        }));
    }, []);

    const handleResultPress = useCallback((result: SearchResult) => {
        if (result.type === 'listing') {
            navigation.navigate('Listing', {
                id: result.id,
                title: result.title
            });
        } else if (result.type === 'category') {
            navigation.navigate('Cats', {
                categoryId: result.id,
                categoryName: result.title
            });
        }
    }, [navigation]);

    const handleBackPress = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const renderHeader = useCallback((cstyle: ViewStyle = {}) => {
        return (
            <View style={[styles.navBar, cstyle]}>
                <CloseButton 
                    isBlack={true} 
                    style={{ width: 50 }} 
                    onPress={handleBackPress}
                />
            </View>
        );
    }, [handleBackPress]);

    const renderSearchResult = useCallback((result: SearchResult, index: number) => (
        <TouchableOpacity
            key={`${result.type}-${result.id}`}
            style={[styles.resultItem, { borderBottomColor: apColors.separator }]}
            onPress={() => handleResultPress(result)}
        >
            <View style={styles.resultImageContainer}>
                {result.image ? (
                    <Image
                        source={{ uri: result.image }}
                        style={styles.resultImage}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={[styles.resultImagePlaceholder, { backgroundColor: apColors.separator }]}>
                        {result.type === 'listing' ? (
                            <MarkerSvg color={apColors.addressText} />
                        ) : (
                            <LightningSvg color={apColors.addressText} />
                        )}
                    </View>
                )}
            </View>
            
            <View style={styles.resultContent}>
                <TextHeavy style={[styles.resultTitle, { color: apColors.hText }]}>
                    {result.title}
                </TextHeavy>
                <TextRegular style={[styles.resultSubtitle, { color: apColors.addressText }]}>
                    {result.subtitle}
                </TextRegular>
            </View>
            
            <View style={styles.resultIcon}>
                <PinterSvg color={apColors.addressText} />
            </View>
        </TouchableOpacity>
    ), [apColors, handleResultPress]);

    const { stext, results, showClear } = state;

    return (
        <SafeAreaConsumer>
            {insets => (
                <View style={[styles.container, { 
                    backgroundColor: apColors.appBg,
                    paddingTop: insets.top,
                    paddingLeft: insets.left,
                    paddingRight: insets.right
                }]}>
                    {/* Header */}
                    {renderHeader({ top: 30 + insets.top })}
                    
                    {/* Search Input */}
                    <View style={[styles.searchContainer, { backgroundColor: apColors.secondBg }]}>
                        <View style={[styles.searchInputContainer, { backgroundColor: apColors.appBg, borderColor: apColors.separator }]}>
                            <SearchSvg color={apColors.addressText} />
                            <TextInput
                                style={[styles.searchInput, { color: apColors.regularText }]}
                                placeholder={translate('search_placeholder')}
                                placeholderTextColor={apColors.fieldLbl}
                                value={stext}
                                onChangeText={onInputChange}
                                autoFocus
                            />
                            {showClear && (
                                <TouchableOpacity onPress={handleClearSearch}>
                                    <CloseSvg color={apColors.addressText} />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    {/* Search Results */}
                    <ScrollView style={styles.resultsContainer}>
                        {stext.length === 0 ? (
                            <View style={styles.emptyState}>
                                <TextHeavy style={[styles.emptyTitle, { color: apColors.hText }]}>
                                    {translate('search_something')}
                                </TextHeavy>
                                <TextRegular style={[styles.emptySubtitle, { color: apColors.addressText }]}>
                                    {translate('search_placeholder')}
                                </TextRegular>
                            </View>
                        ) : results.length > 0 ? (
                            <View style={styles.resultsList}>
                                {results.map((result, index) => renderSearchResult(result, index))}
                            </View>
                        ) : (
                            <View style={styles.emptyState}>
                                <TextHeavy style={[styles.emptyTitle, { color: apColors.hText }]}>
                                    {translate('no_results_found')}
                                </TextHeavy>
                                <TextRegular style={[styles.emptySubtitle, { color: apColors.addressText }]}>
                                    {translate('try_different_keywords')}
                                </TextRegular>
                            </View>
                        )}
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
    navBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
    } as ViewStyle,
    searchContainer: {
        paddingHorizontal: 15,
        paddingVertical: 15,
        marginTop: 60,
    } as ViewStyle,
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 25,
        borderWidth: 1,
    } as ViewStyle,
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        fontFamily: 'System',
    } as TextStyle,
    resultsContainer: {
        flex: 1,
        paddingHorizontal: 15,
    } as ViewStyle,
    resultsList: {
        paddingBottom: 20,
    } as ViewStyle,
    resultItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
    } as ViewStyle,
    resultImageContainer: {
        width: 50,
        height: 50,
        marginRight: 15,
    } as ViewStyle,
    resultImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    } as ImageStyle,
    resultImagePlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    } as ViewStyle,
    resultContent: {
        flex: 1,
    } as ViewStyle,
    resultTitle: {
        fontSize: 16,
        marginBottom: 4,
    } as TextStyle,
    resultSubtitle: {
        fontSize: 14,
    } as TextStyle,
    resultIcon: {
        marginLeft: 10,
    } as ViewStyle,
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    } as ViewStyle,
    emptyTitle: {
        fontSize: 18,
        marginBottom: 8,
    } as TextStyle,
    emptySubtitle: {
        fontSize: 14,
        textAlign: 'center',
    } as TextStyle,
});

// Redux connection
const mapStateToProps = (state: any) => ({
    site: state.site,
    listings: state.listings || [],
});

export default connect(mapStateToProps)(SearchScreen);
