import 'react-native-gesture-handler';

import React, { useState, useEffect, useCallback } from 'react';
import { 
    Platform, 
    StatusBar, 
    StyleSheet, 
    View, 
    Image,
    BackHandler,
    Appearance,
    LogBox,
    ViewStyle,
    TextStyle,
    ImageStyle,
    ColorSchemeName
} from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import axios from 'axios';
import { Provider, useDispatch } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import SiteDetails from './src/constants/SiteDetails';
import store from './src/store';
import getThemedColors from './src/helpers/Theme';
import { setI18nConfig } from './src/helpers/i18n';
import { getSiteDatas, getCurrencyAttrs } from './src/helpers/store';
import { getUserDatas, getLanguageAsync } from './src/helpers/user';
import { setApColors } from './src/reducers/apColors';
import AppNavigator from './src/navigation/AppNavigator';
import TextRegular from './src/components/ui/TextRegular';
import TextHeavy from './src/components/ui/TextHeavy';
import { WifiSlash } from './src/components/icons/ButtonSvgIcons';
import BtnLarge from './src/components/ui/BtnLarge';
import { ThemeColors } from './src/types';

// Ignore log notification by message:
LogBox.ignoreLogs([
  'Calling `getNode()` on the ref of an Animated component is no longer necessary. You can now directly use the ref instead.',
]);

// Configure axios
axios.defaults.baseURL = `${SiteDetails.url}`;
axios.defaults.headers.common.Authorization = SiteDetails.app_key;

// Types
interface AppState {
    isConnected: boolean;
    isLoading: boolean;
    theme: ColorSchemeName;
}

interface OfflineScreenProps {
    apColors: ThemeColors;
    onRetry: () => void;
}

// Splash Screen Component
const SplashScreen: React.FC = () => {
    return (
        <View style={styles.viewStyles}>
            <Image
                source={require('./assets/images/new-logo2.png')}
                style={[styles.logo, { width: 90, height: 90, alignSelf: 'center', marginBottom: 15 }] as ImageStyle}
                resizeMode="contain"
            />
        </View>
    );
};

// Offline Screen Component
const OfflineScreen: React.FC<OfflineScreenProps> = ({ apColors, onRetry }) => {
    return (
        <View style={[styles.viewStyles, { paddingHorizontal: 40 }]}>
            <WifiSlash color={apColors.appColor} style={{ marginBottom: 75 }} />
            <TextHeavy style={[styles.offlineTitle, { color: apColors.tText }]}>
                Sin conexión de
            </TextHeavy>
            <TextRegular style={[styles.offlineText, { color: apColors.tText }]}>
                Parece que no estas conectado al internet.
            </TextRegular>
            <TextRegular style={[styles.offlineText, { color: apColors.tText }]}>
                Asegúrese de que su Wi-Fi o datos móviles estén activados, el modo avión esté desactivado y vuelva a intentarlo.
            </TextRegular>
            <BtnLarge 
                bordered 
                disabled={false} 
                style={styles.retryButton} 
                onPress={onRetry}
            >
                Intentar de nuevo
            </BtnLarge>
        </View>
    );
};

// App Content Component (can use hooks)
const AppContent: React.FC = () => {
    const dispatch = useDispatch();
    const [state, setState] = useState<AppState>({
        isConnected: true,
        isLoading: true,
        theme: Appearance.getColorScheme() as ColorSchemeName
    });

    const performTimeConsumingTask = useCallback(async () => {
        return await Promise.all([
            getUserDatas(),
            getCurrencyAttrs(),
            getSiteDatas(),
        ]);
    }, []);

    const onLoadDatas = useCallback(async () => {
        try {
            const lang = await getLanguageAsync();
            if (lang?.code && lang.rtl !== null) {
                setI18nConfig(lang.code, lang.rtl);
            } else {
                setI18nConfig();
            }

            const data = await performTimeConsumingTask();
            if (data !== null) {
                setState(prevState => ({
                    ...prevState,
                    isConnected: true,
                    isLoading: false
                }));
            }
        } catch (error) {
            console.error('Error loading data:', error);
            setState(prevState => ({
                ...prevState,
                isLoading: false
            }));
        }
    }, [performTimeConsumingTask]);

    const handleAppearanceChange = useCallback((preferences: { colorScheme: ColorSchemeName }) => {
        if (preferences?.colorScheme) {
            setState(prevState => ({
                ...prevState,
                theme: preferences.colorScheme
            }));
        }
    }, []);

    const handleBackButton = useCallback(() => {
        return false;
    }, []);


    useEffect(() => {
        let netInfoUnsubscribe: (() => void) | null = null;

        const setupApp = async () => {
            // Subscribe to network state changes
            netInfoUnsubscribe = NetInfo.addEventListener(networkState => {
                if (networkState.isConnected) {
                    onLoadDatas();
                } else {
                    setState(prevState => ({
                        ...prevState,
                        isConnected: false
                    }));
                }
            });

            // Add back button listener
            BackHandler.addEventListener('hardwareBackPress', handleBackButton);
            
            // Add appearance change listener
            Appearance.addChangeListener(handleAppearanceChange);
        };

        setupApp();

        return () => {
            if (netInfoUnsubscribe) {
                netInfoUnsubscribe();
            }
            // Note: BackHandler and Appearance listeners are automatically cleaned up
        };
    }, [onLoadDatas, handleBackButton, handleAppearanceChange]);

    const colors = getThemedColors(state.theme);

    // Update Redux store with current colors
    useEffect(() => {
        dispatch(setApColors(colors));
    }, [dispatch, colors]);

    return (
        <SafeAreaProvider>
            <View style={[styles.container, { backgroundColor: colors.appBg }]}>
                {!state.isConnected ? (
                    <OfflineScreen apColors={colors} onRetry={onLoadDatas} />
                ) : state.isLoading ? (
                    <SplashScreen />
                ) : (
                    <View style={{ flex: 1 }}>
                        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
                        <AppNavigator />
                    </View>
                )}
            </View>
        </SafeAreaProvider>
    );
};

// Main App Component
const App: React.FC = () => {
    return (
        <Provider store={store}>
            <AppContent />
        </Provider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    } as ViewStyle,
    viewStyles: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    } as ViewStyle,
    logo: {
        marginTop: -50,
    } as ViewStyle,
    offlineTitle: {
        fontSize: 24,
        lineHeight: 41,
        textAlign: 'center',
        marginBottom: 20,
    } as TextStyle,
    offlineText: {
        fontSize: 17,
        lineHeight: 21,
        textAlign: 'center',
    } as TextStyle,
    retryButton: {
        alignSelf: 'center',
        marginVertical: 10,
        marginTop: 30,
    } as ViewStyle,
});

export default App;