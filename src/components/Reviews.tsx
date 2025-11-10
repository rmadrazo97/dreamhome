import React, { useMemo } from 'react';
import {
    Text,
    View,
    StyleSheet,
    useColorScheme,
    ViewStyle,
    TextStyle,
} from 'react-native';
import getThemedColors from '../helpers/Theme';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

// Types
interface Rating {
    rating: number;
    base: number;
    count_text?: string;
}

interface ReviewsProps {
    rating?: Rating;
    showCount?: boolean;
    showNum?: boolean;
    fSize?: number | string;
    oneStar?: boolean;
    style?: ViewStyle;
}

const Reviews: React.FC<ReviewsProps> = ({ 
    rating, 
    showCount = false, 
    showNum = false, 
    fSize, 
    oneStar = false,
    style 
}) => {
    const colors = getThemedColors(useColorScheme());

    const stars = useMemo(() => {
        if (!rating || rating.rating <= 0) {
            return [];
        }

        const starsArray = [];
        const fontSize = fSize ? parseInt(String(fSize), 10) : 13;
        const additionalStyle = { fontSize };
        const maxStars = oneStar ? 1 : rating.base;

        for (let i = 1; i <= maxStars; i++) {
            const isFilled = i <= rating.rating;
            const color = isFilled ? '#FF9500' : '#D1D1D6';
            
            starsArray.push(
                <FontAwesome5 
                    key={i} 
                    name="star" 
                    solid 
                    style={[
                        {
                            color,
                            marginRight: 4,
                            fontSize: 13
                        },
                        additionalStyle
                    ]} 
                />
            );
        }

        return starsArray;
    }, [rating, fSize, oneStar]);

    const additionalElements = useMemo(() => {
        if (!rating || rating.rating <= 0) {
            return [];
        }

        const elements = [];
        const fontSize = fSize ? parseInt(String(fSize), 10) : 13;
        const additionalStyle = { fontSize };

        if (showNum) {
            elements.push(
                <Text 
                    key="reviews-text" 
                    style={[
                        {
                            fontSize: 13, 
                            color: colors.addressText
                        },
                        additionalStyle
                    ]}
                >
                    ({rating.rating})
                </Text>
            );
        }

        if (showCount && rating.count_text && rating.count_text !== '') {
            elements.push(
                <Text 
                    key="reviews-count" 
                    style={[
                        styles.countText,
                        {
                            color: colors.addressText
                        },
                        additionalStyle
                    ]}
                >
                    {rating.count_text}
                </Text>
            );
        }

        return elements;
    }, [rating, showNum, showCount, colors.addressText, fSize]);

    const allElements = useMemo(() => {
        return [...stars, ...additionalElements];
    }, [stars, additionalElements]);

    if (allElements.length === 0) {
        return null;
    }

    return (
        <View style={[styles.reviews, style]}>
            {allElements}
        </View>
    );
};

const styles = StyleSheet.create({
    reviews: {
        flexDirection: 'row',
        alignItems: 'center',
    } as ViewStyle,
    countText: {
        fontSize: 13,
        marginLeft: 10,
    } as TextStyle,
});

export default Reviews;