import React, { useCallback } from 'react';
import { ThemeColors, Category } from '../../types';
import {
    ScrollView,
  	View,
    TouchableOpacity,
  	StyleSheet,
    ViewStyle,
    TextStyle,
} from 'react-native';
import NavigationService from '../../helpers/NavigationService';
import { filterByCat } from '../../helpers/store';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { aweIcon, categoryColor } from '../../helpers/helpers';
import SectionTitle from './SectionTitle';
import TextBold from '../ui/TextBold';

interface CircleCatsProps {
    apColors: ThemeColors;
    eleObj: {
        title: string;
        data: Category[];
        show_view_all: boolean;
        viewall_text: string;
    };
    style?: ViewStyle;
}

interface CardProps {
    post: Category;
    onPress: (category: Category) => void;
    apColors: ThemeColors;
}

const Card: React.FC<CardProps> = ({ post, onPress, apColors }) => {
    const handlePress = useCallback(() => {
        onPress(post);
    }, [post, onPress]);

    // Handle both API format (title) and legacy format (name)
    const categoryName = post.title || post.name || '';
    const categoryColorValue = post.color || '';

    return (
        <TouchableOpacity onPress={handlePress} style={styles.card}>
            <View style={[styles.iconWrap, { backgroundColor: categoryColor(categoryColorValue) }]}>
                {post.icon && (
                    <FontAwesome5 
                        name={aweIcon(post.icon)} 
                        size={20} 
                        color="#FFF" 
                    />
                )}
            </View>
            <TextBold style={[styles.title, { color: apColors.tText }]} numberOfLines={2}>
                {categoryName}
            </TextBold>
        </TouchableOpacity>
    );
};

const CircleCats: React.FC<CircleCatsProps> = ({ apColors, eleObj, style }) => {
    const goToArchive = useCallback((term: Category) => {
        const { id } = term;
        if (id) {
            filterByCat(id);
            NavigationService.navigate('Archive', {});
        }
    }, []);

    const handleViewAll = useCallback(() => {
        NavigationService.navigate('Categories', {});
    }, []);

    const { title, data, show_view_all, viewall_text } = eleObj || { title: '', data: [], show_view_all: false, viewall_text: '' };

    const renderPosts = () => {
        if (!data || !Array.isArray(data) || data.length === 0) {
            return null;
        }

        return data.map((post, index) => (
            <Card 
                key={post.id || index} 
                post={post} 
                onPress={goToArchive}
                apColors={apColors}
            />
        ));
    };

    return (
        <View style={[styles.container, style]}>
            <SectionTitle 
                title={title} 
                showAll={show_view_all} 
                allText={viewall_text} 
                onViewAllPress={handleViewAll}
                apColors={apColors}
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
        alignItems: 'center',
        marginRight: 20,
        width: 80,
    } as ViewStyle,
    iconWrap: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    } as ViewStyle,
    title: {
        fontSize: 12,
        textAlign: 'center',
        lineHeight: 16,
    } as TextStyle,
});

export default CircleCats;