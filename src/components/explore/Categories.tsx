import React, { useCallback } from 'react';
import {
    ScrollView,
    Text,
    View,
    Image,
    TouchableOpacity,
    StyleSheet,
    useColorScheme,
    ViewStyle,
    TextStyle,
    ImageStyle
} from 'react-native';
import NavigationService from '../../helpers/NavigationService';
import { filterByCat } from '../../helpers/store';
import getThemedColors from '../../helpers/Theme';
import { translate } from "../../helpers/i18n";
import SectionTitle from './SectionTitle';
import TextRegular from '../ui/TextRegular';
import TextHeavy from '../ui/TextHeavy';
import { ThemeColors, Category } from '../../types';

// Types
interface CategoriesProps {
    eleObj: {
        title: string;
        data: Category[];
        show_view_all: boolean;
        viewall_text: string;
    };
    style?: ViewStyle;
    apColors: ThemeColors;
    onCategorySelect?: (categoryId: string) => void;
    selectedCategory?: string;
}

interface CardProps {
    post: Category;
    onPress: (category: Category) => void;
    apColors: ThemeColors;
    isSelected?: boolean;
}

const Card: React.FC<CardProps> = ({ post, onPress, apColors, isSelected = false }) => {
    const handlePress = useCallback(() => {
        onPress(post);
    }, [post, onPress]);

    return (
        <TouchableOpacity
            style={[styles.card, { 
                backgroundColor: isSelected ? apColors.appColor + '20' : apColors.secondBg,
                borderColor: isSelected ? apColors.appColor : apColors.separator
            }]}
            onPress={handlePress}
        >
            <View style={styles.cardImageContainer}>
                {post.image ? (
                    <Image
                        source={{ uri: post.image }}
                        style={styles.cardImage}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={[styles.cardImagePlaceholder, { backgroundColor: apColors.separator }]}>
                        <TextHeavy style={[styles.cardImageText, { color: apColors.addressText }]}>
                            {post.name.charAt(0).toUpperCase()}
                        </TextHeavy>
                    </View>
                )}
            </View>
            
            <View style={styles.cardContent}>
                <TextHeavy style={[styles.cardTitle, { 
                    color: isSelected ? apColors.appColor : apColors.hText 
                }]}>
                    {post.name}
                </TextHeavy>
                <TextRegular style={[styles.cardSubtitle, { color: apColors.addressText }]}>
                    {post.count} {translate('listings')}
                </TextRegular>
            </View>
        </TouchableOpacity>
    );
};

const Categories: React.FC<CategoriesProps> = ({ 
    eleObj, 
    style, 
    apColors, 
    onCategorySelect,
    selectedCategory 
}) => {
    const { title, data, show_view_all, viewall_text } = eleObj || { title: '', data: [], show_view_all: false, viewall_text: '' };

    const goToArchive = useCallback((term: Category) => {
        const { id } = term;
        if (id) {
            filterByCat(id);
            NavigationService.navigate('Archive');
        }
    }, []);

    const handleCategoryPress = useCallback((category: Category) => {
        if (onCategorySelect) {
            onCategorySelect(category.id);
        } else {
            goToArchive(category);
        }
    }, [onCategorySelect, goToArchive]);

    const handleViewAllPress = useCallback(() => {
        NavigationService.navigate('Categories');
    }, []);

    const renderCard = useCallback((post: Category, idx: number) => (
        <Card 
            key={idx} 
            post={post} 
            onPress={handleCategoryPress}
            apColors={apColors}
            isSelected={selectedCategory === post.id}
        />
    ), [handleCategoryPress, apColors, selectedCategory]);

    let posts: React.ReactNode[] = [];
    if (data && Array.isArray(data) && data.length > 0) {
        posts = data.map((p, idx) => renderCard(p, idx));
    }

    return (
        <View style={[styles.container, style]}>
            <SectionTitle 
                style={{ marginRight: 15 }} 
                title={title} 
                showAll={show_view_all} 
                allText={viewall_text}  
                onViewAllPress={handleViewAllPress}
            />
            <ScrollView 
                horizontal={true} 
                showsHorizontalScrollIndicator={false} 
                style={styles.scrollView}
            >
                {posts}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    } as ViewStyle,
    scrollView: {
        paddingLeft: 15,
    } as ViewStyle,
    card: {
        width: 120,
        marginRight: 15,
        borderRadius: 8,
        borderWidth: 1,
        overflow: 'hidden',
    } as ViewStyle,
    cardImageContainer: {
        height: 80,
        width: '100%',
    } as ViewStyle,
    cardImage: {
        width: '100%',
        height: '100%',
    } as ImageStyle,
    cardImagePlaceholder: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    } as ViewStyle,
    cardImageText: {
        fontSize: 24,
        fontWeight: 'bold',
    } as TextStyle,
    cardContent: {
        padding: 10,
    } as ViewStyle,
    cardTitle: {
        fontSize: 14,
        marginBottom: 4,
        textAlign: 'center',
    } as TextStyle,
    cardSubtitle: {
        fontSize: 12,
        textAlign: 'center',
    } as TextStyle,
});

export default Categories;
