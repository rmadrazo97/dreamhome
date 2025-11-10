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
import { Listing, ThemeColors } from '../../types';

// Types
interface MapCardProps {
    listing: Listing;
    apColors: ThemeColors;
    onPress: (listing: Listing) => void;
    isSelected?: boolean;
    bookmarks?: number[];
    style?: ViewStyle;
}

const MapCard: React.FC<MapCardProps> = ({ 
    listing, 
    apColors, 
    onPress, 
    isSelected = false, 
    bookmarks = [], 
    style 
}) => {
    const colors = getThemedColors(useColorScheme());
    
    const { ID, thumbnail, title, address, price, rating, distance } = listing;
    
    const isBookmarked = useMemo(() => {
        return bookmarks && Array.isArray(bookmarks) && bookmarks.includes(ID);
    }, [bookmarks, ID]);

    const handlePress = useCallback(() => {
        onPress(listing);
    }, [listing, onPress]);

    return (
        <View style={[styles.cardWrap, style]}>
            <TouchableOpacity 
                onPress={handlePress} 
                style={[
                    styles.cardInner,
                    {
                        backgroundColor: colors.appBg,
                        shadowColor: colors.shadowCl,
                        borderColor: isSelected ? apColors.appColor : 'transparent',
                        borderWidth: isSelected ? 2 : 0,
                    }
                ]}
            >
                {thumbnail && thumbnail !== '' && (
                    <Image source={{ uri: thumbnail }} style={styles.cardImage} />
                )}
                {isBookmarked && <BookmarkSvg style={styles.bookmarkIcon} />}
                
                <View style={styles.cardDetails}>
                    <TextHeavy style={styles.cardTitle}>{title}</TextHeavy>
                    
                    <View style={styles.cardBot}>
                        <Reviews 
                            rating={rating} 
                            showNum={true} 
                            style={{ marginTop: 5 }} 
                            oneStar={true} 
                            fSize={13}
                        />
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
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    cardWrap: {
        width: 180,
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
        padding: 9,
    } as ViewStyle,
    cardTitle: {
        fontSize: 15,
        lineHeight: 18,
        marginTop: 9,
    } as TextStyle,
    bookmarkIcon: {
        position: 'absolute',
        top: 2,
        right: 5,
    } as ViewStyle,
    cardBot: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    } as ViewStyle,
    farWrap: {
        marginTop: 3,
        flexDirection: 'row',
        alignItems: 'center',
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

export default MapCard;