import React, { useState, useMemo, useCallback } from 'react';
import { ThemeColors } from '../../types';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Modal,
    ViewStyle,
    TextStyle,
    ScrollView,
    Image,
    Dimensions,
} from 'react-native';
import ImageViewing from 'react-native-image-viewing';
import { translate } from "../../helpers/i18n";
import TextMedium from '../../components/ui/TextMedium';
import { CloseSvg } from '../icons/ButtonSvgIcons';

// Types
interface Photo {
    src: string;
    id?: number;
}

interface RoomImagesProps {
    photos: Photo[];
    apColors: ThemeColors;
    style?: ViewStyle;
}

interface RoomImagesState {
    showGal: boolean;
    galIndex: number;
}

const RoomImages: React.FC<RoomImagesProps> = ({ photos, apColors, style }) => {
    const [state, setState] = useState<RoomImagesState>({
        showGal: false,
        galIndex: 0
    });

    const gallerySource = useMemo(() => {
        if (!Array.isArray(photos) || photos.length === 0) return [];
        
        return photos.map(photo => ({
            source: { uri: photo.src }
        }));
    }, [photos]);

    const showGallery = useCallback(() => {
        setState(prevState => ({
            ...prevState,
            showGal: true
        }));
    }, []);

    const hideGallery = useCallback(() => {
        setState(prevState => ({
            ...prevState,
            showGal: false
        }));
    }, []);

    return (
        <View style={[styles.container, style]}>
            <TouchableOpacity onPress={showGallery} activeOpacity={0.7}>
                <TextMedium style={[styles.viewButton, { color: apColors.tText }]}>
                    {translate('slisting', 'view_room_images', {})}
                </TextMedium>
            </TouchableOpacity>
            
            <Modal
                transparent={false}
                animationType="fade"
                visible={state.showGal}
                onRequestClose={hideGallery}
            >
                <View style={styles.modelStyle}>
                    <ImageViewing
                        images={gallerySource}
                        imageIndex={state.galIndex}
                        visible={state.showGal}
                        onRequestClose={hideGallery}
                    />
                    
                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={styles.closeButtonStyle}
                        onPress={hideGallery}
                    >
                        <CloseSvg fill="#FFF" style={styles.closeIcon} />
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        // Container styles
    } as ViewStyle,
    viewButton: {
        fontSize: 15,
        marginTop: 10,
    } as TextStyle,
    modelStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
    } as ViewStyle,
    gallery: {
        flex: 1,
        backgroundColor: '#000'
    } as ViewStyle,
    closeButtonStyle: {
        width: 16,
        height: 16,
        top: 52,
        left: 15,
        position: 'absolute',
    } as ViewStyle,
    closeIcon: {
        width: 16,
        height: 16,
    } as ViewStyle,
});

export default RoomImages;