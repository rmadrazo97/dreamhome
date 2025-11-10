import React from 'react';
import {
    View,
    Image,
    TouchableOpacity,
    Linking,
    StyleSheet,
    ViewStyle,
    ImageStyle,
} from 'react-native';

interface ImageBannerProps {
    eleObj: {
        src?: string;
        url?: string;
        height?: number;
        width?: number;
    };
    style?: ViewStyle;
}

const ImageBanner: React.FC<ImageBannerProps> = ({ eleObj, style }) => {
    const { src, url, height, width } = eleObj || { src: '', url: '', height: 0, width: 0 };
    
    const dynamicStyle: ViewStyle = {};
    if (height && height > 0) {
        dynamicStyle.height = height;
    }
    if (width && width > 0) {
        dynamicStyle.width = width;
        dynamicStyle.alignSelf = 'center';
    }

    const handlePress = () => {
        if (url) {
            Linking.openURL(url);
        }
    };

    return (
        <View style={[styles.container, style, dynamicStyle]}>
            <TouchableOpacity onPress={handlePress} style={styles.thumbnailBtn}>
                {src && src !== '' && (
                    <Image source={{ uri: src }} style={styles.cardThumbnail} />
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 150,
        paddingHorizontal: 15,
        marginTop: 15,
    } as ViewStyle,
    thumbnailBtn: {
        flex: 1,
        borderRadius: 10,
        overflow: 'hidden',
    } as ViewStyle,
    cardThumbnail: {
        flex: 1,
    } as ImageStyle,
});

export default ImageBanner;