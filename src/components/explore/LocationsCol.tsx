import React, { useCallback } from 'react';
import { ThemeColors, Location } from '../../types';
import {
    View,
    StyleSheet,
    ViewStyle,
} from 'react-native';
import NavigationService from '../../helpers/NavigationService';
import { filterByLoc } from '../../helpers/store';
import SectionTitle from './SectionTitle';
import TaxCard from '../inners/TaxCard';

interface LocationsColProps {
    apColors: ThemeColors;
    eleObj: {
        title: string;
        data: Location[];
        show_view_all: boolean;
        viewall_text: string;
    };
    style?: ViewStyle;
}

const LocationsCol: React.FC<LocationsColProps> = ({ apColors, eleObj, style }) => {
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
            <TaxCard 
                key={post.id || index} 
                post={post} 
                onPress={() => goToArchive(post)}
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
            />
            <View style={styles.locColWrap}>
                {renderPosts()}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        minHeight: 150,
        paddingHorizontal: 15,
        marginTop: 20,
    } as ViewStyle,
    locColWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginLeft: -7.5,
        marginRight: -7.5,
        marginBottom: -15,
    } as ViewStyle,
});

export default LocationsCol;