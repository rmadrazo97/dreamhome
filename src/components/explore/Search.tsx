import React from 'react';
import {
    View,
    StyleSheet,
    useColorScheme,
    ViewStyle,
    TextStyle,
} from 'react-native';
import getThemedColors from '../../helpers/Theme';
import { translate } from "../../helpers/i18n";
import TextRegular from '../ui/TextRegular';
import { SearchSvg } from '../icons/ButtonSvgIcons';

interface SearchProps {
    style?: ViewStyle;
}

const Search: React.FC<SearchProps> = ({ style }) => {
    const colors = getThemedColors(useColorScheme());
    
    return (
        <View style={[styles.container, { backgroundColor: colors.searchBg }, style]}>
            <SearchSvg style={styles.searchIcon} color={colors.searchText} />
            <TextRegular style={[styles.searchTitle, { color: colors.searchText }]}>
                {translate('home', 'search', {})}
            </TextRegular>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
    } as ViewStyle,
    searchIcon: {
        width: 22,
        height: 22,
        marginLeft: 12,
    } as ViewStyle,
    searchTitle: {
        marginLeft: 7,
        fontSize: 16,
        marginTop: 5,
    } as TextStyle,
});

export default Search;