import React, { useState, useMemo, useCallback } from 'react';
import { ThemeColors } from '../../types';
import {
	StyleSheet,
	View,
	Image,
    TouchableOpacity,
    ViewStyle,
    ImageStyle,
    TextStyle,
} from 'react-native';
import HTML from 'react-native-render-html';
import { regularFontFamily } from '../../constants/Colors';
import { translate } from "../../helpers/i18n";
import { fomartCurrOut } from '../../helpers/currency';
import TextBold from '../../components/ui/TextBold';
import TextMedium from '../../components/ui/TextMedium';

// Types
interface MenuItem {
    id: number;
    name: string;
    price: string;
    thumbnail: string;
    desc: string;
    cats?: string[];
}

interface LMenusProps {
    data: MenuItem[];
    apColors: ThemeColors;
    style?: ViewStyle;
}

interface LMenusState {
    mtype: string;
}

interface LMenuProps {
    data: MenuItem;
    apColors: ThemeColors;
}

const LMenu: React.FC<LMenuProps> = ({ data, apColors }) => {
    const { name, price, thumbnail, desc } = data;

    const htmlContent = useMemo(() => ({
        html: desc || ''
    }), [desc]);

    const baseFontStyle = useMemo(() => ({
        fontFamily: regularFontFamily,
        fontSize: 13,
        color: apColors.pText
    }), [apColors.pText]);

	return (
		<View style={styles.itemWrap}>
            <View style={styles.itemInner}>
                <View style={styles.itemLeft}>
                    {thumbnail && thumbnail !== '' && (
                        <Image source={{ uri: thumbnail }} style={styles.thumbnail} />
                    )}
                </View>
                <View style={styles.itemRight}>
                    <View style={styles.titleWrap}>
                        <TextMedium style={[styles.itemTitle, { color: apColors.tText }]}>
                            {name}
                        </TextMedium>
                        <TextMedium style={[styles.priceText, { color: apColors.appColor }]}>
                            {fomartCurrOut(price)}
                        </TextMedium>
                    </View>
                    {desc && desc !== '' && (
                        <HTML 
                            source={htmlContent}
                            baseFontStyle={baseFontStyle}
                            contentWidth={200}
                        />
                    )}
                </View>
            </View>
        </View>
    );
};

const LMenus: React.FC<LMenusProps> = ({ data, apColors, style }) => {
    const [state, setState] = useState<LMenusState>({
        mtype: ''
    });

    const categories = useMemo(() => {
        const cats: string[] = [];
        data.forEach(item => {
            if (item.cats && Array.isArray(item.cats) && item.cats.length > 0) {
                cats.push(...item.cats);
            }
        });
        return [...new Set(cats)]; // Remove duplicates
    }, [data]);

    const filteredData = useMemo(() => {
        if (state.mtype === '') return data;
        return data.filter(item => 
            item.cats && Array.isArray(item.cats) && item.cats.includes(state.mtype)
        );
    }, [data, state.mtype]);

    const menuItems = useMemo(() => {
        return filteredData.map((item, index) => (
            <LMenu key={item.id || index} data={item} apColors={apColors} />
        ));
    }, [filteredData, apColors]);

    const categoryFilters = useMemo(() => {
        const filters = [];
        
        // All filter
        const allStyle = state.mtype === '' ? { backgroundColor: apColors.appColor } : {};
        const allTextStyle = state.mtype === '' ? styles.filterTextActive : {};
        
        filters.push(
            <TouchableOpacity 
                key="filter_all" 
                onPress={() => setState({ mtype: '' })} 
                style={[styles.filterItem, allStyle]}
                activeOpacity={0.7}
            >
                <TextMedium style={[styles.filterText, { color: apColors.tText }, allTextStyle]}>
                    {translate('slisting', 'filter_all', {})}
                </TextMedium>
            </TouchableOpacity>
        );

        // Category filters
        categories.forEach((cat, index) => {
            const itemStyle = state.mtype === cat ? { backgroundColor: apColors.appColor } : {};
            const textStyle = state.mtype === cat ? styles.filterTextActive : {};
            
            filters.push(
                <TouchableOpacity 
                    key={index} 
                    onPress={() => setState({ mtype: cat })} 
                    style={[styles.filterItem, itemStyle]}
                    activeOpacity={0.7}
                >
                    <TextMedium style={[styles.filterText, { color: apColors.tText }, textStyle]}>
                        {cat}
                    </TextMedium>
                </TouchableOpacity>
            );
        });

        return filters;
    }, [categories, state.mtype, apColors]);

    return (
        <View style={[styles.container, style]}>
            <View style={styles.filterWrap}>{categoryFilters}</View>
            <View style={styles.childsWrap}>{menuItems}</View>
		</View>
    );
};

const styles = StyleSheet.create({
	container: {
        // Container styles
    } as ViewStyle,
    filterWrap: {
        flexDirection: 'row',
        marginBottom: 15,
        flexWrap: 'wrap',
    } as ViewStyle,
    filterItem: {
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 4,
        marginRight: 10,
        marginBottom: 10,
    } as ViewStyle,
    filterText: {
        fontSize: 15,
    } as TextStyle,
    filterTextActive: {
        color: '#FFF',
    } as TextStyle,
    childsWrap: {
        marginBottom: -15,
    } as ViewStyle,
    itemWrap: {
        marginBottom: 15,
    } as ViewStyle,
    itemInner: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    } as ViewStyle,
    itemLeft: {
        width: 70,
    } as ViewStyle,
    thumbnail: {
        width: 70,
        height: 70,
        borderRadius: 35,
        overflow: 'hidden',
    } as ImageStyle,
    itemTitle: {
        fontSize: 15,
    } as TextStyle,
    itemRight: {
        flex: 1,
        paddingLeft: 15,
    } as ViewStyle,
    titleWrap: {
        paddingRight: 100,
        position: 'relative',
    } as ViewStyle,
    priceText: {
        position: 'absolute',
        right: 0,
        top: 0,
        fontSize: 15,
    } as TextStyle,
});

export default LMenus;