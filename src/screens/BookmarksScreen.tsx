import React, { useMemo, useCallback } from 'react';
import { 
    View,
    FlatList,
    StyleSheet 
} from 'react-native';
import { connect } from 'react-redux';

import SignInScreen from './SignInScreen';
import { translate } from "../helpers/i18n";
import { extractPostParams } from "../helpers/store";
import LList from '../components/inners/LList';
import TextRegular from '../components/ui/TextRegular';
import { AppState, Listing, ThemeColors, NavigationProp } from '../types';

interface BookmarksScreenProps {
    navigation: NavigationProp;
    user: {
        isLoggedIn: boolean;
        bookmarks: number[];
    } & any;
    site: {
        listings: Listing[];
    } & any;
    apColors: ThemeColors;
}

const BookmarksScreen: React.FC<BookmarksScreenProps> = ({ 
    navigation, 
    user, 
    site, 
    apColors 
}) => {
    const { isLoggedIn, bookmarks } = user;

    const goToListing = useCallback((post: Listing) => {
        const params = extractPostParams(post);
        navigation.navigate('Listing', { 
            id: post.id, 
            title: post.title,
            ...params 
        });
    }, [navigation]);

    const bookmarksPosts = useMemo(() => {
        if (!Array.isArray(bookmarks) || bookmarks.length === 0) {
            return [];
        }
        
        return bookmarks
            .map(bookmarkId => 
                site.listings.find(listing => listing.id === bookmarkId)
            )
            .filter((listing): listing is Listing => listing !== undefined);
    }, [bookmarks, site.listings]);

    const renderBookmarkItem = useCallback(({ item }: { item: Listing }) => (
        <LList 
            post={item} 
            onPress={() => goToListing(item)} 
            bookmarks={bookmarks} 
            style={[
                styles.bmLList,
                {
                    backgroundColor: apColors.appBg,
                    shadowColor: apColors.shadowCl,
                }
            ] as any} 
        />
    ), [bookmarks, apColors, goToListing]);

    const renderEmptyComponent = useCallback(() => (
        <View style={styles.listEmpty}>
            <TextRegular style={styles.emptyText}>
                {translate('bookmarks', 'no_results')}
            </TextRegular>
        </View>
    ), []);

    // Show sign-in screen if user is not logged in
    if (!isLoggedIn) {
        return <SignInScreen navigation={navigation} apColors={apColors} />;
    }

    return (
        <View style={[styles.container, { backgroundColor: apColors.secondBg }]}>
            <FlatList
                data={bookmarksPosts}
                renderItem={renderBookmarkItem}
                keyExtractor={item => String(item.id)}
                ListEmptyComponent={renderEmptyComponent}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={bookmarksPosts.length === 0 ? styles.emptyContainer : undefined}
            />
        </View>
    );
};

// Map the redux state to props
const mapStateToProps = (state: AppState) => ({
    user: state.user,
    site: state.site,
    apColors: (state as any).apColors || {} as ThemeColors,
});

// Map dispatch to props
const mapDispatchToProps = {};

// Export the connected component
export default connect(mapStateToProps, mapDispatchToProps)(BookmarksScreen);



const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bmLList: {
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 20,
        marginTop: 15,
        marginHorizontal: 15,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 1,
    },
    listEmpty: {
        paddingVertical: 20,
    },
    emptyContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    emptyText: {
        fontSize: 15,
        textAlign: 'center',
    },
    reviewsContainer: {
        marginTop: 5,
    },
});
