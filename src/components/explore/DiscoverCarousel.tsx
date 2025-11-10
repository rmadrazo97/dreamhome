import React, { useState, useCallback, useRef } from 'react';
import { ThemeColors, Listing } from '../../types';
import {
    View,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Platform,
    PermissionsAndroid,
    ViewStyle,
    TextStyle,
    ImageStyle,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { filterNearBy } from '../../helpers/store';
import LinearGradient from 'react-native-linear-gradient';
import NavigationService from '../../helpers/NavigationService';
import SectionTitle from './SectionTitle';
import TextRegular from '../ui/TextRegular';
import TextMedium from '../ui/TextMedium';
import TextHeavy from '../ui/TextHeavy';
import { MarkerSvg, BookmarkSvg } from '../icons/ButtonSvgIcons';
import Reviews from '../Reviews';
import { translate } from "../../helpers/i18n";
import { extractPostParams } from "../../helpers/store";
import { fomartCurrOut } from '../../helpers/currency';
import getThemedColors from '../../helpers/Theme';

const horizontalMargin = 15;
const sliderWidth = Dimensions.get('window').width;
const itemWidth = sliderWidth;

interface DiscoverCarouselProps {
    apColors: ThemeColors;
    eleObj: {
        title: string;
        data: Listing[];
        show_view_all: boolean;
        viewall_text: string;
    };
    overlay?: boolean;
    style?: ViewStyle;
}

interface CardProps {
    post: Listing;
    onPress: (listing: Listing) => void;
    overlay?: boolean;
}

const Card: React.FC<CardProps> = ({ post, onPress, overlay = true }) => {
    const colors = getThemedColors() || {};
    
    const handlePress = useCallback(() => {
        onPress(post);
    }, [post, onPress]);

    const { thumbnail, title, address, rating, price } = post;

    return (
        <View style={styles.card}>
            <TouchableOpacity onPress={handlePress} style={styles.cardTouchable}>
                <View style={styles.cardThumbnail}>
                    {thumbnail && thumbnail !== '' && (
                        <Image source={{ uri: thumbnail }} style={styles.cardImage} />
                    )}
                    {overlay && (
                        <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.7)']}
                            style={styles.overlay}
                        />
                    )}
                </View>

                <View style={styles.cardContent}>
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
                </View>
            </TouchableOpacity>
        </View>
    );
};

const DiscoverCarousel: React.FC<DiscoverCarouselProps> = ({ 
    apColors, 
    eleObj, 
    overlay = true, 
    style 
}) => {
    const [viewableItems, setViewableItems] = useState<number[]>([]);
    const carouselRef = useRef<any>(null);

    const goToListing = useCallback((post: Listing) => {
        NavigationService.navigate('Listing', extractPostParams(post));
    }, []);

    const getGeoLocation = useCallback(async () => {
        try {
            const location = await Geolocation.getCurrentPosition(
                (position) => {
                    if (position.coords) {
                        const { latitude, longitude } = position.coords;
                        filterNearBy(latitude, longitude);
                        NavigationService.navigate('Archive', {});
                        NavigationService.navigate('Map', {});
                    }
                },
                (error) => {
                    console.log('Location error:', error);
                }
            );
        } catch (error) {
            console.log('Location error:', error);
        }
    }, []);

    const handleNearBy = useCallback(async () => {
        if (Platform.OS === 'ios') {
            Geolocation.requestAuthorization();
            await getGeoLocation();
        } else {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: translate('locrequest', 'title', {}),
                        message: translate('locrequest', 'message', {})
                    }
                );
                
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    await getGeoLocation();
                } else {
                    alert(translate('locrequest', 'denied', {}));
                }
            } catch (error) {
                console.log('Permission error:', error);
            }
        }
    }, [getGeoLocation]);

    const handleViewAll = useCallback(() => {
        NavigationService.navigate('Archive', {});
    }, []);

    const { title, data, show_view_all, viewall_text } = eleObj;

    const renderItem = useCallback(({ item, index }: { item: Listing; index: number }) => {
        let slideStyle = styles.slide;
        if (Platform.OS === 'android' && index === 0) {
            slideStyle = [slideStyle, { paddingLeft: horizontalMargin }];
        }
        
        return (
            <View style={slideStyle}>
                <Card 
                    post={item} 
                    onPress={goToListing}
                    overlay={overlay}
                />
            </View>
        );
    }, [goToListing, overlay]);

    return (
        <View style={[styles.container, style]}>
            <SectionTitle 
                title={title} 
                showAll={show_view_all} 
                allText={viewall_text} 
                onViewAllPress={handleViewAll}
            />
            
            <View style={styles.carouselContainer}>
                {/* For now, we'll use a simple ScrollView instead of Carousel */}
                {/* This can be replaced with react-native-snap-carousel when needed */}
                <View style={styles.placeholder}>
                    <TextRegular style={styles.placeholderText}>
                        Carousel placeholder - implement with react-native-snap-carousel
                    </TextRegular>
                </View>
            </View>

            <TouchableOpacity style={styles.nearbyButton} onPress={handleNearBy}>
                <MarkerSvg style={styles.nearbyIcon} />
                <TextHeavy style={styles.nearbyButtonText}>
                    {translate('nearby', '', {})}
                </TextHeavy>
            </TouchableOpacity>
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
    carouselContainer: {
        height: 400,
        marginBottom: 20,
    } as ViewStyle,
    slide: {
        width: itemWidth - 2 * horizontalMargin,
        marginHorizontal: horizontalMargin,
    } as ViewStyle,
    card: {
        width: '100%',
        height: 350,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#FFF',
    } as ViewStyle,
    cardTouchable: {
        flex: 1,
    } as ViewStyle,
    cardThumbnail: {
        width: '100%',
        height: 200,
        position: 'relative',
    } as ViewStyle,
    cardImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    } as ImageStyle,
    overlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 100,
    } as ViewStyle,
    cardContent: {
        flex: 1,
        padding: 15,
    } as ViewStyle,
    cardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
    nearbyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4DB7FE',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginHorizontal: 15,
    } as ViewStyle,
    nearbyIcon: {
        marginRight: 8,
    } as ViewStyle,
    nearbyButtonText: {
        color: '#FFF',
        fontSize: 16,
    } as TextStyle,
    placeholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
    } as ViewStyle,
    placeholderText: {
        color: '#666',
        fontSize: 14,
    } as TextStyle,
});

export default DiscoverCarousel;