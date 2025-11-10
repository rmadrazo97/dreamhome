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
import { filterByCat } from '../../helpers/store';
import { translate } from "../../helpers/i18n";
import TextBold from '../../components/ui/TextBold';
import TextMedium from '../../components/ui/TextMedium';

// Types
interface Category {
    id: number;
    name: string;
}

interface CatsProps {
    data: Category[];
    apColors: ThemeColors;
    showTitle?: boolean;
    style?: ViewStyle;
}

interface CatItemProps {
    data: Category;
    apColors: ThemeColors;
    onPress: (id: number) => void;
}

const CatItem: React.FC<CatItemProps> = ({ data, apColors, onPress }) => {
    const handlePress = useCallback(() => {
        onPress(data.id);
    }, [data.id, onPress]);

    return (
        <View style={styles.childWrap}>
            <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
                <View style={[styles.childInner, { backgroundColor: apColors.appColor }]}>
                    <TextMedium style={styles.catText}>
                        {data.name}
                    </TextMedium>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const Cats: React.FC<CatsProps> = ({ data, apColors, showTitle = false, style }) => {
    const goToArchive = useCallback((id: number) => {
        filterByCat(id);
        NavigationService.navigate('Archive', {});
    }, []);

    const catItems = useMemo(() => {
        if (!Array.isArray(data) || data.length === 0) return [];
        
        return data.map((cat, index) => (
            <CatItem
                key={cat.id || index}
                data={cat}
                apColors={apColors}
                onPress={goToArchive}
            />
        ));
    }, [data, apColors, goToArchive]);

    return (
        <View style={[styles.container, style]}>
            {showTitle && (
                <TextBold style={[styles.title, { color: apColors.tText }]}>
                    {translate('slisting', 'cats', {})}
                </TextBold>
            )}
            <View style={styles.inner}>{catItems}</View>
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
    } as ViewStyle,
    childInner: {
        paddingHorizontal: 7,
        paddingVertical: 3,
        borderRadius: 15,
    } as ViewStyle,
    catText: {
        color: '#FFF',
        fontSize: 15,
    } as TextStyle,
});

export default Cats;