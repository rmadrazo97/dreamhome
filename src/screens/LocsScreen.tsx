import React, { useCallback } from 'react';
import { ThemeColors, NavigationProp, Location, SiteData } from '../types';
import { 
    View,
    FlatList,
    StyleSheet,
    ViewStyle,
} from 'react-native';
import { SafeAreaConsumer } from 'react-native-safe-area-context';
import { filterByLoc } from '../helpers/store';
import { translate } from "../helpers/i18n";
import TaxOverCard from '../components/inners/TaxOverCard';
import { connect } from 'react-redux';
import { AppState } from '../types/redux';

// Types
interface LocsScreenProps {
    navigation: NavigationProp;
    apColors: ThemeColors;
    site: SiteData & {
        locs: Location[];
    };
}

interface ReduxState {
    site: SiteData & {
        locs: Location[];
    };
}

const LocsScreen: React.FC<LocsScreenProps> = ({ navigation, apColors, site }) => {
    const goToArchive = useCallback((term: Location) => {
        const { id } = term;
        if (id) {
            filterByLoc(id);
            navigation.navigate('Archive', {});
        }
    }, [navigation]);

    const filteredItems = site.locs?.filter(item => item.count && item.count > 0) || [];

    const renderItem = useCallback(({ item }: { item: Location }) => (
        <TaxOverCard 
            post={item} 
            onPress={() => goToArchive(item)}
            overlay={true}
        />
    ), [goToArchive]);

    const keyExtractor = useCallback((item: Location) => String(item.id), []);

    return (
        <SafeAreaConsumer>
            {insets => (
                <View style={[
                    styles.container,
                    {
                        backgroundColor: apColors.appBg,
                        paddingBottom: insets.bottom,
                        paddingLeft: insets.left,
                        paddingRight: insets.right
                    }
                ]}>
                    <FlatList
                        data={filteredItems}
                        renderItem={renderItem}
                        keyExtractor={keyExtractor}
                        numColumns={2}
                        style={styles.flatList}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.flatListContent}
                    />
                </View>
            )}
        </SafeAreaConsumer>
    );
};

// Map the redux state to your props
const mapStateToProps = (state: AppState): ReduxState => ({
    site: state.site,
});

// Map your action creators to your props
const mapDispatchToProps = {};

// Export your component as a default export
export default connect(mapStateToProps, mapDispatchToProps)(LocsScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    } as ViewStyle,
    flatList: {
        flex: 1,
    } as ViewStyle,
    flatListContent: {
        paddingHorizontal: 7.5,
        paddingTop: 15,
    } as ViewStyle,
});