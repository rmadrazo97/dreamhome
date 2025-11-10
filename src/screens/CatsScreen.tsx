import React, { useCallback } from 'react';
import { ThemeColors, NavigationProp, Category, SiteData } from '../types';
import { 
    View,
    FlatList,
    StyleSheet,
    ViewStyle,
} from 'react-native';
import { SafeAreaConsumer } from 'react-native-safe-area-context';
import { filterByCat } from '../helpers/store';
import { translate } from "../helpers/i18n";
import TaxCard from '../components/inners/TaxCard';
import { connect } from 'react-redux';
import { AppState } from '../types';

// Types
interface CatsScreenProps {
    navigation: NavigationProp;
    apColors: ThemeColors;
    site: SiteData & {
        cats: Category[];
    };
}

interface ReduxState {
    site: SiteData & {
        cats: Category[];
    };
}

const CatsScreen: React.FC<CatsScreenProps> = ({ navigation, apColors, site }) => {
    const goToArchive = useCallback((term: Category) => {
        const { id } = term;
        if (id) {
            filterByCat(id);
            navigation.navigate('Archive', {});
        }
    }, [navigation]);

    const filteredItems = site?.cats?.filter(item => item.count > 0) || [];

    const renderItem = useCallback(({ item }: { item: Category }) => (
        <TaxCard 
            post={item} 
            onPress={() => goToArchive(item)}
        />
    ), [goToArchive]);

    const keyExtractor = useCallback((item: Category) => String(item.id), []);

    // Add null checks to prevent style errors
    if (!apColors) {
        return null; // or return a loading component
    }

    return (
        <SafeAreaConsumer>
            {insets => (
                <View style={[
                    styles.container,
                    {
                        backgroundColor: apColors?.appBg || '#FFFFFF',
                        paddingBottom: insets?.bottom || 0,
                        paddingLeft: insets?.left || 0,
                        paddingRight: insets?.right || 0
                    }
                ]}>
                    <FlatList
                        data={filteredItems}
                        renderItem={renderItem}
                        keyExtractor={keyExtractor}
                        numColumns={2}
                        style={styles.flatList}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            )}
        </SafeAreaConsumer>
    );
};

// Map the redux state to your props
const mapStateToProps = (state: any) => ({
    site: state.site,
    apColors: state.apColors,
});

// Map your action creators to your props
const mapDispatchToProps = {};

// Export your component as a default export
export default connect(mapStateToProps, mapDispatchToProps)(CatsScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    } as ViewStyle,
    flatList: {
        flex: 1,
        paddingHorizontal: 7.5,
        paddingTop: 15,
    } as ViewStyle,
});