import React, { useCallback } from 'react';
import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    ViewStyle,
    ImageStyle,
    TextStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { translate } from "../../helpers/i18n";
import TextRegular from '../ui/TextRegular';
import TextHeavy from '../ui/TextHeavy';
import { Location } from '../../types';

// Types
interface TaxOverCardProps {
    post: Location;
    onPress: (location: Location) => void;
    overlay?: boolean;
    style?: ViewStyle;
}

const TaxOverCard: React.FC<TaxOverCardProps> = ({ post, onPress, overlay = false, style }) => {
    const handlePress = useCallback(() => {
        onPress(post);
    }, [post, onPress]);

    return (
        <View style={[styles.card, style]}>
            <TouchableOpacity onPress={handlePress} style={styles.cardOverInner}>
                <View style={styles.cardImageWrap}>
                    {post.thumbnail && post.thumbnail !== '' && (
                        <Image 
                            source={{ uri: post.thumbnail }} 
                            style={styles.cardImage}
                        />
                    )}
                </View>
                {overlay && (
                    <LinearGradient 
                        colors={['rgba(0,0,0,0.15)', 'rgba(0,0,0,0.50)']} 
                        style={styles.linearGradient}
                    />
                )}
                <View style={styles.cardDetails}>
                    <View style={styles.cardDetailsInner}>
                        <TextHeavy style={styles.cardTitle}>
                            {post.name || post.title}
                        </TextHeavy>
                        <TextRegular style={styles.cardSubTitle}>
                            {translate('home', 'lcount', { count: post.count || 0 })}
                        </TextRegular>
                    </View>
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
    cardOverInner: {
        flex: 1,
        borderRadius: 8, 
        overflow: 'hidden',
        position: 'relative',
    } as ViewStyle,
    cardImageWrap: {
        minHeight: 165,
        width: '100%',
        backgroundColor: '#f0f0f0',
    } as ViewStyle,
    cardImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    } as ImageStyle,
    linearGradient: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 3,
    } as ViewStyle,
    cardDetails: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        zIndex: 10,
    } as ViewStyle,
    cardDetailsInner: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    } as ViewStyle,
    cardTitle: {
        fontSize: 17,
        color: '#FFF',
        lineHeight: 23,
        textAlign: 'center',
        marginBottom: 4,
    } as TextStyle,
    cardSubTitle: {
        fontSize: 13,
        color: '#EAECEF',
        lineHeight: 18,
        textAlign: 'center',
    } as TextStyle,
});

export default TaxOverCard;