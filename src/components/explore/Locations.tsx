import React, { useCallback } from 'react';
import { ThemeColors, Location } from '../../types';
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
import { filterByLoc } from '../../helpers/store';
import getThemedColors from '../../helpers/Theme';
import { translate } from "../../helpers/i18n";
import SectionTitle from './SectionTitle';
import TextRegular from '../ui/TextRegular';
import TextHeavy from '../ui/TextHeavy';

interface LocationsProps {
    apColors: ThemeColors;
    eleObj: {
        title: string;
        data: Location[];
        show_view_all: boolean;
        viewall_text: string;
    };
    style?: ViewStyle;
}

interface LocationCardProps {
    post: Location;
    onPress: (location: Location) => void;
}

const LocationCard: React.FC<LocationCardProps> = ({ post, onPress }) => {
    const colors = getThemedColors(useColorScheme());
    
    const handlePress = useCallback(() => {
        onPress(post);
    }, [post, onPress]);

    return (
        <View style={styles.card}>
            <TouchableOpacity onPress={handlePress} style={styles.cardTouchable}>
                <View style={styles.cardImageWrap}>
                    {post.thumbnail && post.thumbnail !== '' && (
                        <Image source={{ uri: post.thumbnail }} style={styles.cardImage} />
                    )}
                </View>
                <View style={styles.cardDetails}>
                    <TextHeavy style={[styles.cardTitle, { color: colors.taxTitle }]}>
                        {post.title}
                    </TextHeavy>
                    <TextRegular style={[styles.cardSubTitle, { color: colors.taxCount }]}>
                        {translate('home', 'lcount', { count: post.count })}
                    </TextRegular>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const Locations: React.FC<LocationsProps> = ({ apColors, eleObj, style }) => {
    const goToArchive = useCallback((term: Location) => {
        const { id } = term;
        if (id) {
            filterByLoc(id);
            NavigationService.navigate('Archive', {});
        }
    }, []);

    const handleViewAll = useCallback(() => {
        NavigationService.navigate('Locations', {});
    }, []);

    const { title, data, show_view_all, viewall_text } = eleObj || { title: '', data: [], show_view_all: false, viewall_text: '' };

    const renderPosts = () => {
        if (!data || !Array.isArray(data) || data.length === 0) {
            return null;
        }

        return data.map((post, index) => (
            <LocationCard 
                key={post.id || index} 
                post={post} 
                onPress={goToArchive}
            />
        ));
    };

    return (
        <View style={[styles.container, style]}>
            <SectionTitle 
                style={{ marginRight: 15 }}
                title={title} 
                showAll={show_view_all} 
                allText={viewall_text} 
                onViewAllPress={handleViewAll}
            />
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
        minHeight: 150,
        paddingLeft: 15,
        marginTop: 20,
    } as ViewStyle,
    scrollView: {
        flex: 1,
    } as ViewStyle,
    card: {
        marginRight: 15,
    } as ViewStyle,
    cardTouchable: {
        flex: 1,
    } as ViewStyle,
    cardImageWrap: {
        minHeight: 165,
        width: 290,
        borderRadius: 8, 
        overflow: 'hidden',
        marginBottom: 13
    } as ViewStyle,
    cardImage: {
        flex: 1
    } as ImageStyle,
    cardDetails: {
        // Empty for now
    } as ViewStyle,
    cardTitle: {
        fontSize: 17,
        lineHeight: 23,
    } as TextStyle,
    cardSubTitle: {
        fontSize: 13,
        lineHeight: 18,
    } as TextStyle,
});

export default Locations;