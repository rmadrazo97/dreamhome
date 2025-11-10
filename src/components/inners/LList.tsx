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
import TextBold from '../ui/TextBold';
import { BookmarkSvg } from '../icons/ButtonSvgIcons';
import Reviews from '../Reviews';
import { Listing } from '../../types';

// Types
interface LListProps {
    post: Listing;
    onPress: (listing: Listing) => void;
    bookmarks?: number[];
    style?: ViewStyle;
}

const LList: React.FC<LListProps> = ({ post, onPress, bookmarks = [], style }) => {
    const colors = getThemedColors(useColorScheme());
    
    const { ID, thumbnail, title, address, price, rating, distance } = post;
    
    const isBookmarked = useMemo(() => {
        return bookmarks && Array.isArray(bookmarks) && bookmarks.includes(ID);
    }, [bookmarks, ID]);

    const handlePress = useCallback(() => {
        onPress(post);
    }, [post, onPress]);

    return (
        <View style={[styles.cardWrap, { borderBottomColor: colors.separator }, style]}>
            <TouchableOpacity onPress={handlePress} style={styles.cardInner}>
                {thumbnail && thumbnail !== '' && (
                    <Image source={{ uri: thumbnail }} style={styles.cardImage} />
                )}
                <View style={styles.cardDetails}>
                    <TextBold style={styles.cardTitle}>{title}</TextBold>
                    {isBookmarked && <BookmarkSvg style={styles.bookmarkIcon} />}
                    
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

                    <Reviews rating={rating} showNum={true} style={{ marginTop: 5 }} />

                    {price && price !== '' && (
                        <View style={styles.priceWrap}>
                            <TextRegular style={[styles.priceTitle, { color: colors.addressText }]}>
                                {translate('home', 'from', {})}
                            </TextRegular>
                            <TextBold style={[styles.priceAmount, { color: colors.appColor }]}>
                                {fomartCurrOut(price)}
                            </TextBold>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    cardWrap: {
        paddingVertical: 20,
        borderBottomWidth: 1,
    } as ViewStyle,
    cardInner: {
        flexDirection: 'row',
    } as ViewStyle,
    cardImage: {
        minHeight: 100,
        borderRadius: 5, 
        overflow: 'hidden',
        flex: 1,
        marginRight: 17,
    } as ImageStyle,
    cardDetails: {
        flex: 2,
    } as ViewStyle,
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
        right: 0,
        bottom: 0,
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

export default LList;