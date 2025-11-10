import React, { useState, useCallback } from 'react';
import { ThemeColors, Listing } from '../../types';
import {
    ScrollView,
    View,
    Image,
    TouchableOpacity,
    StyleSheet,
    useColorScheme,
    ViewStyle,
    TextStyle,
    ImageStyle,
} from 'react-native';
import NavigationService from '../../helpers/NavigationService';
import { extractPostParams } from "../../helpers/store";
import { fomartCurrOut } from '../../helpers/currency';
import { translate } from "../../helpers/i18n";
import getThemedColors from '../../helpers/Theme';
import TextHeavy from '../ui/TextHeavy';
import TextMedium from '../ui/TextMedium';
import Reviews from '../Reviews';
import { MarkerSvg, BookmarkSvg } from '../icons/ButtonSvgIcons';

interface DiscoverProps {
    apColors: ThemeColors;
    data?: Listing[];
    style?: ViewStyle;
}

interface CardProps {
    post: Listing;
    onPress: (listing: Listing) => void;
}

const Card: React.FC<CardProps> = ({ post, onPress }) => {
    const colors = getThemedColors(useColorScheme());
    const [loaded, setLoaded] = useState(true);
    
    const handlePress = useCallback(() => {
        onPress(post);
    }, [post, onPress]);

    const { thumbnail, title, address, rating, price } = post;

    return (
        <View style={styles.card}>
            <TouchableOpacity onPress={handlePress} style={styles.cardTouchable}>
                <View style={styles.cardThumbnail}>
                    {loaded && thumbnail && thumbnail !== '' && (
                        <Image source={{ uri: thumbnail }} style={styles.cardImage} />
                    )}
                </View>

                <View style={styles.cardTop}>
                    {address && address !== '' && (
                        <View style={styles.addressWrap}>
                            <MarkerSvg style={{ marginRight: 7 }} />
                            <TextMedium style={styles.lAddress}>{address}</TextMedium>
                        </View>
                    )}
                    <BookmarkSvg style={styles.bookmarkIcon} />
                </View>
                
                <View style={styles.cardDetails}>
                    <TextHeavy style={styles.cardTitle}>{title}</TextHeavy>
                    
                    <Reviews 
                        rating={rating} 
                        showNum={false} 
                        showCount={false} 
                        style={{ marginTop: 12 }} 
                        fSize={17}
                    />
                    <TextHeavy style={styles.priceAmount}>
                        {fomartCurrOut(price)}
                    </TextHeavy>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const Discover: React.FC<DiscoverProps> = ({ apColors, data = [], style }) => {
    const goToListing = useCallback((post: Listing) => {
        NavigationService.navigate('Listing', extractPostParams(post));
    }, []);

    const renderPosts = () => {
        if (!data || !Array.isArray(data) || data.length === 0) {
            return null;
        }

        return data.map((post, index) => (
            <Card 
                key={post.id || index} 
                post={post} 
                onPress={goToListing}
            />
        ));
    };

    return (
        <View style={[styles.container, style]}>
            <TextHeavy style={styles.title}>
                {translate('home', 'discoverNew', {})}
            </TextHeavy>
            <ScrollView 
                horizontal={true} 
                showsHorizontalScrollIndicator={false} 
                style={styles.scrollView}
            >
                {renderPosts()}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        minHeight: 150,
        paddingTop: 10,
        paddingLeft: 15,
        marginTop: 20,
    } as ViewStyle,
    title: {
        fontSize: 30,
        color: '#1E2432',
        lineHeight: 41,
        marginBottom: 20,
    } as TextStyle,
    scrollView: {
        flex: 1,
    } as ViewStyle,
    card: {
        width: 330,
        height: 515,
        marginRight: 15,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#FFF',
    } as ViewStyle,
    cardTouchable: {
        flex: 1,
    } as ViewStyle,
    cardThumbnail: {
        width: 330,
        height: 250,
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 15,
        backgroundColor: '#FFF',
    } as ViewStyle,
    cardImage: {
        flex: 1
    } as ImageStyle,
    cardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        marginBottom: 10,
    } as ViewStyle,
    addressWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    } as ViewStyle,
    lAddress: {
        fontSize: 13,
        lineHeight: 18,
        color: '#666',
    } as TextStyle,
    bookmarkIcon: {
        marginLeft: 10,
    } as ViewStyle,
    cardDetails: {
        paddingHorizontal: 15,
        flex: 1,
    } as ViewStyle,
    cardTitle: {
        fontSize: 17,
        lineHeight: 22,
        marginBottom: 8,
    } as TextStyle,
    priceAmount: {
        fontSize: 18,
        color: '#4DB7FE',
        marginTop: 8,
    } as TextStyle,
});

export default Discover;