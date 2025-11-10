import React, { useState, useEffect, useCallback } from 'react';
import { ThemeColors, NavigationProp } from '../types';
import { 
    View,
    FlatList,
    TouchableOpacity, 
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaConsumer } from 'react-native-safe-area-context';

import NavigationService from '../../helpers/NavigationService';
import { translate } from "../../helpers/i18n";
import { getCurrencyAttrs, changeAppCurrency } from "../../helpers/store";
import { getCurrencyAsync, setCurrencyAsync } from "../../helpers/user";

import TextRegular from '../../components/ui/TextRegular';
import { CheckMarkSvg } from '../../components/icons/ButtonSvgIcons';
import Loader from '../../components/Loader';

// for redux
import { connect } from 'react-redux';

interface CurrencyItem {
    currency: string;
    symbol?: string;
    name?: string;
}

interface CurrencyState {
    selected: string;
    stored: string;
}

interface CurrencyProps {
    navigation: NavigationProp;
    apColors: ThemeColors;
    site: {
        base_currency?: CurrencyItem;
        currencies?: CurrencyItem[];
    };
    currency: {
        submitting: boolean;
    };
}

const Currency: React.FC<CurrencyProps> = ({ navigation, apColors, site, currency }) => {
    const [state, setState] = useState<CurrencyState>({
        selected: 'USD',
        stored: 'USD'
    });

    useEffect(() => {
        getCurrencyAsync().then(curr => {
            if (curr) {
                setState({ selected: curr, stored: curr });
            }
        });
    }, []);

    const onSelect = useCallback(async (val: CurrencyItem) => {
        const vS = val.currency || 'USD';

        try {
            await getCurrencyAttrs(vS);
            await setCurrencyAsync(vS);
            setState(prevState => ({ ...prevState, selected: vS }));
            NavigationService.setParams({ appCurrency: vS });
            changeAppCurrency(vS);
        } catch (error) {
            console.error('Error setting currency:', error);
        }
    }, []);

    const { selected } = state;
    const { submitting } = currency;
    const { base_currency, currencies } = site;

    let currsArray: CurrencyItem[] = [];
    
    if (base_currency && typeof base_currency === 'object' && !Array.isArray(base_currency) && Object.keys(base_currency).length > 0) {
        currsArray.push(base_currency);
    }
    
    if (Array.isArray(currencies) && currencies.length > 0) {
        currencies.forEach(curr => {
            if (curr && typeof curr === 'object' && curr.currency) {
                currsArray.push(curr);
            }
        });
    }

    // Remove duplicates
    currsArray = currsArray.filter((ele, indx, oriArr) => {
        if (ele && ele.currency) {
            return indx === oriArr.findIndex(nel => nel.currency === ele.currency);
        }
        return false;
    });

    return (
        <SafeAreaConsumer>
            {insets => (
                <View style={[
                    styles.container,
                    {
                        backgroundColor: apColors.appBg,
                        paddingLeft: insets.left,
                        paddingRight: insets.right,
                        paddingBottom: insets.bottom
                    }
                ]}>
                    {submitting && <Loader loading={true} />}

                    <FlatList
                        data={currsArray}
                        renderItem={({ item }) => (
                            <CurrencyItem
                                id={item.currency}
                                itemobj={item}
                                selected={selected}
                                onSelect={() => onSelect(item)}
                                apColors={apColors}
                            />
                        )}
                        keyExtractor={item => item.currency}
                        style={styles.flatList}
                        ListEmptyComponent={() => (
                            <View style={styles.listEmpty}>
                                <TextRegular style={[
                                    styles.emptyText,
                                    { color: apColors.lMoreText }
                                ]}>
                                    {translate('currency', 'no_currency')}
                                </TextRegular>
                            </View>
                        )}
                    />
                </View>
            )}
        </SafeAreaConsumer>
    );
};

// Redux connection
const mapStateToProps = (state: any) => ({
    site: state.site,
    currency: state.currency,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Currency);

interface CurrencyItemProps {
    id: string;
    itemobj: CurrencyItem;
    selected: string;
    onSelect: () => void;
    apColors: ThemeColors;
}

const CurrencyItem: React.FC<CurrencyItemProps> = ({ 
    id, 
    itemobj, 
    selected, 
    onSelect, 
    apColors 
}) => {
    return (
        <TouchableOpacity
            onPress={onSelect}
            style={[
                styles.itemWrap,
                { borderBottomColor: apColors.separator }
            ]}
        >
            <View style={styles.currencyInfo}>
                <TextRegular style={[
                    styles.itemTitle,
                    { color: apColors.tText }
                ]}>
                    {itemobj.currency}
                </TextRegular>
                {itemobj.name && (
                    <TextRegular style={[
                        styles.currencyName,
                        { color: apColors.pText }
                    ]}>
                        {itemobj.name}
                    </TextRegular>
                )}
            </View>
            {itemobj.currency && selected === itemobj.currency && (
                <View style={[
                    styles.itemSubTitle,
                    { color: apColors.pText }
                ]}>
                    <CheckMarkSvg color={apColors.appColor} />
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    flatList: {
        paddingHorizontal: 15,
        flex: 1,
    },
    itemWrap: {
        paddingVertical: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
    },
    currencyInfo: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 15,
        lineHeight: 22,
        fontWeight: '500',
    },
    currencyName: {
        fontSize: 13,
        lineHeight: 18,
        marginTop: 2,
    },
    itemSubTitle: {
        fontSize: 15,
        lineHeight: 20,
        marginLeft: 10,
    },
    listEmpty: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 15,
        textAlign: 'center',
    },
});
