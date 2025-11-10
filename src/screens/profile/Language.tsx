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
import { getLanguageAsync, setLanguageAsync } from "../../helpers/user";
import { setI18nConfig } from '../../helpers/i18n';

import TextRegular from '../../components/ui/TextRegular';
import { CheckMarkSvg } from '../../components/icons/ButtonSvgIcons';
import Loader from '../../components/Loader';

// for redux
import { connect } from 'react-redux';

interface LanguageItem {
    code: string;
    name: string;
    rtl: boolean;
}

interface LanguageState {
    selected: string;
}

interface LanguageProps {
    navigation: NavigationProp;
    apColors: ThemeColors;
    currency: {
        submitting: boolean;
    };
}

const Language: React.FC<LanguageProps> = ({ navigation, apColors, currency }) => {
    const [state, setState] = useState<LanguageState>({
        selected: 'en'
    });

    useEffect(() => {
        getLanguageAsync().then(lang => {
            if (lang && lang.code) {
                setState({ selected: lang.code });
            }
        });
    }, []);

    const onSelect = useCallback(async (val: LanguageItem) => {
        const vS = {
            code: val.code || 'en',
            rtl: val.rtl || false
        };

        try {
            await setLanguageAsync(vS);
            setState({ selected: vS.code });
            setI18nConfig(vS.code, vS.rtl);
            NavigationService.setParams({ appLanguage: vS.code });
        } catch (error) {
            console.error('Error setting language:', error);
        }
    }, []);

    const languages: LanguageItem[] = [
        { code: 'en', name: 'English', rtl: false },
        { code: 'es', name: 'Español', rtl: false },
        { code: 'fr', name: 'Français', rtl: false },
        { code: 'de', name: 'Deutsch', rtl: false },
        { code: 'it', name: 'Italiano', rtl: false },
        { code: 'pt', name: 'Português', rtl: false },
        { code: 'ru', name: 'Русский', rtl: false },
        { code: 'zh', name: '中文', rtl: false },
        { code: 'ja', name: '日本語', rtl: false },
        { code: 'ko', name: '한국어', rtl: false },
        { code: 'ar', name: 'العربية', rtl: true },
        { code: 'he', name: 'עברית', rtl: true },
    ];

    const { selected } = state;
    const { submitting } = currency;

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
                        data={languages}
                        renderItem={({ item }) => (
                            <LanguageItem
                                id={item.code}
                                itemobj={item}
                                selected={selected}
                                onSelect={() => onSelect(item)}
                                apColors={apColors}
                            />
                        )}
                        keyExtractor={item => item.code}
                        style={styles.flatList}
                        ListEmptyComponent={() => (
                            <View style={styles.listEmpty}>
                                <TextRegular style={[
                                    styles.emptyText,
                                    { color: apColors.lMoreText }
                                ]}>
                                    {translate('language', 'no_language')}
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

export default connect(mapStateToProps, mapDispatchToProps)(Language);

interface LanguageItemProps {
    id: string;
    itemobj: LanguageItem;
    selected: string;
    onSelect: () => void;
    apColors: ThemeColors;
}

const LanguageItem: React.FC<LanguageItemProps> = ({ 
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
            <TextRegular style={[
                styles.itemTitle,
                { color: apColors.tText }
            ]}>
                {itemobj.name}
            </TextRegular>
            {itemobj.code && selected === itemobj.code && (
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
    itemTitle: {
        fontSize: 15,
        lineHeight: 22,
        flex: 1,
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
