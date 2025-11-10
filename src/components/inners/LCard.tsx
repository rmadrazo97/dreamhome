import React, { useCallback, useMemo } from 'react';
import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    useColorScheme,
    ViewStyle,
    ImageStyle,
    TextStyle,
} from 'react-native';
import getThemedColors from '../../helpers/Theme';
import { translate } from "../../helpers/i18n";
import { fomartCurrOut, formatNumber } from '../../helpers/currency';
import TextRegular from '../ui/TextRegular';
import TextMedium from '../ui/TextMedium';
import TextHeavy from '../ui/TextHeavy';
import { BookmarkSvg } from '../icons/ButtonSvgIcons';
import Reviews from '../Reviews';
import { Listing } from '../../types';

// Types
interface LCardProps {
    post: Listing;
    onPress: (listing: Listing) => void;
    bookmarks?: number[];
    style?: ViewStyle;
}

const LCard: React.FC<LCardProps> = ({ post, onPress, bookmarks = [], style }) => {
    const colors = getThemedColors(useColorScheme());
    
    const { ID, thumbnail, title, address, price, rating, distance } = post;
    
    const isBookmarked = useMemo(() => {
        return bookmarks && Array.isArray(bookmarks) && bookmarks.includes(ID);
    }, [bookmarks, ID]);

    const handlePress = useCallback(() => {
        onPress(post);
    }, [post, onPress]);

    return (
        <View style={[styles.cardWrap, style]}>
            <TouchableOpacity 
                onPress={handlePress} 
                style={[
                    styles.cardInner,
                    {
                        backgroundColor: colors.appBg,
                        shadowColor: colors.shadowCl,
                    }
                ]}
            >
                {thumbnail && thumbnail !== '' && (
                    <Image source={{ uri: thumbnail }} style={styles.cardImage} />
                )}
                {isBookmarked && <BookmarkSvg style={styles.bookmarkIcon} />}
                
                <View style={styles.cardDetails}>
                    <TextHeavy style={styles.cardTitle}>{title}</TextHeavy>
                    
                    {address && address !== '' && (
                        <TextRegular style={[styles.lAddress, { color: colors.addressText }]}>
                            {address}
                        </TextRegular>
                    )}
                    
                    {distance && distance !== '' && (
                        <View style={styles.farWrap}>
                            <TextMedium style={[styles.farVal, { color: colors.pText }]}>
                                {formatNumber(distance)}
                            </TextMedium>
                            <TextRegular style={[styles.farKM, { color: colors.addressText }]}>
                                {translate('km', '', {})}
                            </TextRegular>
                        </View>
                    )}

                    <Reviews 
                        rating={rating} 
                        showNum={true} 
                        style={{ marginTop: 5 }} 
                        oneStar={true} 
                        fSize={15}
                    />

                    {price && price !== '' && (
                        <View style={styles.priceWrap}>
                            <TextRegular style={[styles.priceTitle, { color: colors.addressText }]}>
                                {translate('home', 'from', {})}
                            </TextRegular>
                            <TextHeavy style={[styles.priceAmount, { color: colors.appColor }]}>
                                {fomartCurrOut(price)}
                            </TextHeavy>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    cardWrap: {
        width: '50%',
        marginBottom: 15,
        paddingHorizontal: 7.5,
    } as ViewStyle,
    cardInner: {
        borderRadius: 8,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.8,
        shadowRadius: 10,  
        elevation: 1,
    } as ViewStyle,
    cardImage: {
        minHeight: 150,
        borderTopLeftRadius: 8, 
        borderTopRightRadius: 8, 
        overflow: 'hidden',
        flex: 1,
    } as ImageStyle,
    cardDetails: {
        flex: 1,
        padding: 9,
    } as ViewStyle,
    cardTitle: {
        fontSize: 20,
        lineHeight: 24,
        marginTop: 9,
    } as TextStyle,
    bookmarkIcon: {
        position: 'absolute',
        top: 2,
        right: 5,
    } as ViewStyle,
    lAddress: {
        fontSize: 13,
        lineHeight: 18,
        marginTop: 2,
    } as TextStyle,
    priceWrap: {
        marginTop: 15,
        flexDirection: 'row',
        alignItems: 'flex-end',
    } as ViewStyle,
    priceTitle: {
        fontSize: 13,
        lineHeight: 15,
        marginRight: 10,
    } as TextStyle,
    priceAmount: {
        fontSize: 17,
        lineHeight: 18,
    } as TextStyle,
    farWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        right: 9,
        bottom: 9,
    } as ViewStyle,
    farVal: {
        fontSize: 13,
        lineHeight: 18,
    } as TextStyle,
    farKM: {
        fontSize: 13,
        lineHeight: 18,
        marginLeft: 3,
        marginTop: 4,
    } as TextStyle,
});

export default LCard;