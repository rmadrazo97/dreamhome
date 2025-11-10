import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { ThemeColors, NavigationProp, RouteProp } from '../types';

interface WebScreenProps {
    navigation: NavigationProp;
    route: RouteProp<{ Web: { url: string } }, 'Web'>;
    apColors: ThemeColors;
}

const WebScreen: React.FC<WebScreenProps> = ({ route, apColors }) => {
    const url = route.params?.url || '';

    const handleError = () => {
        console.error('WebView failed to load:', url);
    };

    const handleLoadStart = () => {
        console.log('WebView started loading:', url);
    };

    const handleLoadEnd = () => {
        console.log('WebView finished loading:', url);
    };

    if (!url) {
        return (
            <View style={[styles.container, { backgroundColor: apColors.appBg }]}>
                <ActivityIndicator size="large" color={apColors.appColor} />
            </View>
        );
    }

    return (
        <WebView 
            source={{ uri: url }} 
            style={[styles.webView, { backgroundColor: apColors.secondBg }]}
            onError={handleError}
            onLoadStart={handleLoadStart}
            onLoadEnd={handleLoadEnd}
            startInLoadingState={true}
            renderLoading={() => (
                <View style={[styles.loadingContainer, { backgroundColor: apColors.appBg }]}>
                    <ActivityIndicator size="large" color={apColors.appColor} />
                </View>
            )}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    webView: {
        flex: 1,
        width: '100%',
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default WebScreen;


