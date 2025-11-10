import React, { useState, useCallback } from 'react';
import { ThemeColors, Listing } from '../../types';
import {
    View,
    StyleSheet,
    ViewStyle,
} from 'react-native';
import NavigationService from '../../helpers/NavigationService';
import SectionTitle from './SectionTitle';
import { extractPostParams, filterReset } from "../../helpers/store";

interface PopularProps {
    apColors: ThemeColors;
    eleObj: {
        title: string;
        data: Listing[];
        show_view_all: boolean;
        viewall_text: string;
        layout?: 'list' | 'grid';
    };
    style?: ViewStyle;
}

const Popular: React.FC<PopularProps> = ({ apColors, eleObj, style }) => {
    const [viewableItems, setViewableItems] = useState<number[]>([]);

    const goToListing = useCallback((post: Listing) => {
        NavigationService.navigate('Listing', extractPostParams(post));
    }, []);

    const handleViewAll = useCallback(() => {
        filterReset();
        NavigationService.navigate('Archive', {});
    }, []);

    const { title, data, show_view_all, viewall_text, layout } = eleObj;

    // For now, we'll render a simple list since LList and LCard components need to be checked
    const renderPosts = () => {
        if (!data || !Array.isArray(data) || data.length === 0) {
            return null;
        }

        return data.map((post, index) => (
            <View key={post.id || index} style={styles.postItem}>
                {/* Placeholder for post content - would need LList/LCard components */}
            </View>
        ));
    };

    return (
        <View style={[styles.container, style]}>
            <SectionTitle 
                title={title} 
                showAll={show_view_all} 
                allText={viewall_text} 
                onViewAllPress={handleViewAll}
            />
            <View style={layout === 'grid' ? styles.flatListGrid : styles.flatList}>
                {renderPosts()}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingLeft: 15,
        paddingRight: 15,
        marginTop: 20,
    } as ViewStyle,
    flatList: {
        // paddingHorizontal: 15,
    } as ViewStyle,
    flatListGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -7.5,
    } as ViewStyle,
    postItem: {
        // Placeholder styles for post items
    } as ViewStyle,
});

export default Popular;