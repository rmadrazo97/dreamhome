import React from 'react';
import {
    StyleSheet,
    View,
    Image,
    useColorScheme,
    ViewStyle,
    TextStyle,
    ImageStyle
} from 'react-native';

import getThemedColors from '../../helpers/Theme';
import { translate } from '../../helpers/i18n';
import { fomartCurrOut } from '../../helpers/currency';
import TextRegular from '../ui/TextRegular';
import TextMedium from '../ui/TextMedium';
import TextHeavy from '../ui/TextHeavy';
import { MarkerSvg } from '../icons/ButtonSvgIcons';
import Cats from '../inners/Cats';
import { ThemeColors, Listing as ListingType } from '../../types';

// Types
interface ListingProps {
    data: ListingType;
    apColors: ThemeColors;
    style?: ViewStyle;
}

const Listing: React.FC<ListingProps> = ({ 
    data, 
    apColors, 
    style 
}) => {
    const colors = getThemedColors(useColorScheme());
    console.log('data', data);
    const { title, thumbnail, address, cats, price } = data;

    return (
        <View style={[styles.container, style]}>
            <View style={styles.inner}>
                {thumbnail && thumbnail !== '' && (
                    <View style={styles.thumbnail}>
                        <Image 
                            source={{ uri: thumbnail }} 
                            style={styles.thumbnailImage} 
                            resizeMode="cover"
                        />
                    </View>
                )}

                <View style={styles.details}>
                    {title && title !== '' && (
                        <TextHeavy style={[styles.title, { color: colors.tText }]}>
                            {title}
                        </TextHeavy>
                    )}
                    
                    {address && address !== '' && (
                        <View style={styles.addressWrap}>
                            <MarkerSvg color={colors.addressText} style={styles.markerIcon} />
                            <TextMedium style={[styles.address, { color: colors.addressText }]}>
                                {address}
                            </TextMedium>
                        </View>
                    )}

                    {cats && cats.length > 0 && (
                        <Cats data={cats} showTitle={false} apColors={apColors} />
                    )}

                    <TextHeavy style={[styles.price, { color: colors.appColor }]}>
                        {price}
                    </TextHeavy>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
    } as ViewStyle,
    inner: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    } as ViewStyle,
    thumbnail: {
        flex: 1,
        minHeight: 60,
        marginRight: 10,
    } as ViewStyle,
    thumbnailImage: {
        flex: 1,
        maxHeight: 90,
        borderRadius: 4,
        overflow: 'hidden',
    } as ImageStyle,
    details: {
        flex: 2,
    } as ViewStyle,
    title: {
        fontSize: 20,
        lineHeight: 24,
        marginBottom: 3,
    } as TextStyle,
    addressWrap: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 10,
    } as ViewStyle,
    markerIcon: {
        marginRight: 5,
    } as ViewStyle,
    address: {
        fontSize: 12,
        flex: 1,
    } as TextStyle,
    price: {
        fontSize: 13,
        marginTop: 10,
    } as TextStyle,
});

export default Listing;