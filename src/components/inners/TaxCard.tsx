import React, { useCallback } from 'react';
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
import TextRegular from '../ui/TextRegular';
import TextHeavy from '../ui/TextHeavy';
import { Category } from '../../types';

// Types
interface TaxCardProps {
    post: Category;
    onPress: (category: Category) => void;
    style?: ViewStyle;
}

const TaxCard: React.FC<TaxCardProps> = ({ post, onPress, style }) => {
    const colors = getThemedColors(useColorScheme());
    
    const handlePress = useCallback(() => {
        onPress(post);
    }, [post, onPress]);

    return (
        <View style={[styles.card, style]}>
            <TouchableOpacity onPress={handlePress} style={styles.cardTouchable}>
                <View style={styles.cardImageWrap}>
                    {post.thumbnail && post.thumbnail !== '' && (
                        <Image 
                            source={{ uri: post.thumbnail }} 
                            style={styles.cardImage}
                        />
                    )}
                </View>
                <View style={styles.cardDetails}>
                    <TextHeavy style={[styles.cardTitle, { color: colors.taxTitle }]}>
                        {post.name || post.title}
                    </TextHeavy>
                    <TextRegular style={[styles.cardSubTitle, { color: colors.taxCount }]}>
                        {translate('home', 'lcount', { count: post.count || 0 })}
                    </TextRegular>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        width: '50%',
        marginBottom: 15,
        paddingHorizontal: 7.5,
    } as ViewStyle,
    cardTouchable: {
        flex: 1,
    } as ViewStyle,
    cardImageWrap: {
        minHeight: 165,
        width: '100%',
        borderRadius: 8, 
        overflow: 'hidden',
        marginBottom: 13,
        backgroundColor: '#f0f0f0',
    } as ViewStyle,
    cardImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    } as ImageStyle,
    cardDetails: {
        paddingHorizontal: 5,
    } as ViewStyle,
    cardTitle: {
        fontSize: 17,
        lineHeight: 23,
        marginBottom: 4,
    } as TextStyle,
    cardSubTitle: {
        fontSize: 13,
        lineHeight: 18,
    } as TextStyle,
});

export default TaxCard;