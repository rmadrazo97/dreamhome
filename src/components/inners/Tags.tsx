import React, { useMemo, useCallback } from 'react';
import { ThemeColors } from '../../types';
import {
	StyleSheet,
	View,
    TouchableOpacity,
    ViewStyle,
    TextStyle,
} from 'react-native';
import NavigationService from '../../helpers/NavigationService';
import { filterByTag } from '../../helpers/store';
import { translate } from "../../helpers/i18n";
import TextBold from '../../components/ui/TextBold';
import TextRegular from '../../components/ui/TextRegular';

// Types
interface Tag {
    id: number;
    name: string;
}

interface TagsProps {
    data: Tag[];
    apColors: ThemeColors;
    showTitle?: boolean;
    style?: ViewStyle;
}

interface TagItemProps {
    data: Tag;
    apColors: ThemeColors;
    onPress: (id: number) => void;
}

const TagItem: React.FC<TagItemProps> = ({ data, apColors, onPress }) => {
    const handlePress = useCallback(() => {
        onPress(data.id);
    }, [data.id, onPress]);

	return (
		<View style={styles.childWrap}>
            <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
                <View style={styles.childInner}>
                    <TextRegular style={[styles.tagText, { color: apColors.appColor }]}>
                        {data.name}
                    </TextRegular>
                </View>
            </TouchableOpacity>
		</View>
    );
};

const Tags: React.FC<TagsProps> = ({ data, apColors, showTitle = false, style }) => {
    const goToArchive = useCallback((id: number) => {
        filterByTag(id);
        NavigationService.navigate('Archive', {});
    }, []);

    const tagItems = useMemo(() => {
        if (!Array.isArray(data) || data.length === 0) return [];
        
        return data.map((tag, index) => (
            <TagItem
                key={tag.id || index}
                data={tag}
                apColors={apColors}
                onPress={goToArchive}
            />
        ));
    }, [data, apColors, goToArchive]);

    return (
        <View style={[styles.container, style]}>
            {showTitle && (
                <TextBold style={[styles.title, { color: apColors.tText }]}>
                    {translate('slisting', 'tags', {})}
                </TextBold>
            )}
            <View style={styles.inner}>{tagItems}</View>
        </View>
    );
};

const styles = StyleSheet.create({
	container: {
        // Container styles
    } as ViewStyle,
    title: {
        fontSize: 15,
        marginBottom: 10,
    } as TextStyle,
    inner: {
		flex: 1,
		flexDirection: 'row',
		flexWrap: 'wrap',
    } as ViewStyle,
    childWrap: {
        marginRight: 10,
        marginBottom: 5,
    } as ViewStyle,
    childInner: {
        // Inner container for tag
    } as ViewStyle,
    tagText: {
        fontSize: 15,
    } as TextStyle,
});

export default Tags;