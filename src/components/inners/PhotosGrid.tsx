import React, { useState, useMemo, useCallback } from 'react';
import { ThemeColors } from '../../types';
import {
	StyleSheet,
	View,
	Image,
	TouchableOpacity,
    Dimensions,
    ViewStyle,
    ImageStyle,
    TextStyle,
} from 'react-native';
import ImageViewing from 'react-native-image-viewing';
import { translate } from "../../helpers/i18n";
import TextBold from '../../components/ui/TextBold';
import { CloseSvg } from '../icons/ButtonSvgIcons';

// Types
interface Photo {
    src: string;
    href?: string;
    id?: number;
}

interface PhotosGridProps {
    photos: Photo[];
    apColors: ThemeColors;
    showTitle?: boolean;
    style?: ViewStyle;
}

interface PhotosGridState {
    showGal: boolean;
    galIndex: number;
}

interface PhotoItemProps {
    photo: Photo;
    index: number;
    onPress: (index: number) => void;
    style?: ViewStyle;
}

const PhotoItem: React.FC<PhotoItemProps> = ({ photo, index, onPress, style }) => {
    const handlePress = useCallback(() => {
        onPress(index);
    }, [index, onPress]);

	return (
        <View style={[styles.photo, style]}>
            <TouchableOpacity onPress={handlePress} style={styles.photoTouchable} activeOpacity={0.7}>
                <View style={styles.photoInner}>
                    <Image
                        style={styles.photoImage}
                        source={{ uri: photo.href }}
                        resizeMode="cover"
                    />
                </View>
            </TouchableOpacity>
		</View>
    );
};

const PhotosGrid: React.FC<PhotosGridProps> = ({ photos, apColors, showTitle = true, style }) => {
    const [state, setState] = useState<PhotosGridState>({
        showGal: false,
        galIndex: 0
    });

    const windowWidth = Dimensions.get('window').width;
    const imageSize = (windowWidth - 30) / 3;

    const photoItems = useMemo(() => {
        if (!Array.isArray(photos) || photos.length === 0) return [];
        
        return photos.map((photo, index) => (
            <PhotoItem
                key={photo.id || index}
                photo={photo}
                index={index}
                onPress={(index) => setState(prevState => ({ ...prevState, showGal: true, galIndex: index }))}
            />
        ));
    }, [photos]);

    const gallerySource = useMemo(() => {
        if (!Array.isArray(photos) || photos.length === 0) return [];
        
        return photos.map(photo => ({
            uri: photo.href
        }));
    }, [photos]);

    const hideGallery = useCallback(() => {
        setState(prevState => ({
            ...prevState,
            showGal: false
        }));
    }, []);

    return (
        <View style={[styles.container, style]}>
            {showTitle && (
                <TextBold style={[styles.title, { color: apColors.tText }]}>
                    {translate('slisting', 'photos', {})}
                </TextBold>
            )}

            <View style={styles.inner}>{photoItems}</View>
            
            <ImageViewing
                images={gallerySource}
                imageIndex={state.galIndex}
                visible={state.showGal}
                onRequestClose={hideGallery}
                HeaderComponent={() => (
                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={styles.closeButtonStyle}
                        onPress={hideGallery}
                    >
                        <CloseSvg fill="#FFF" style={styles.closeIcon} />
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        // Container styles
    } as ViewStyle,
    title: {
        fontSize: 15,
        marginTop: 10,
    } as TextStyle,
	inner: {
		flex: 1,
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginLeft: -10,
		marginRight: -10,
    } as ViewStyle,
    photo: {
		padding: 10,
        width: '33.33%',
    } as ViewStyle,
    photoTouchable: {
        flex: 1,
    } as ViewStyle,
    photoInner: {
        flex: 1,
		borderRadius: 4,
		overflow: 'hidden',
    } as ViewStyle,
    photoImage: {
		minWidth: 96,
		minHeight: 96,
		flex: 1,
    } as ImageStyle,
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

export default PhotosGrid;