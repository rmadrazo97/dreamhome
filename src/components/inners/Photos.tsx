import React, { useMemo, useCallback } from 'react';
import { ThemeColors } from '../../types';
import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    ViewStyle,
    ImageStyle,
} from 'react-native';

// Types
interface Photo {
    src: string;
    id?: number;
}

interface PhotosProps {
    photos: Photo[];
    style?: ViewStyle;
}

interface PhotoItemProps {
    photo: Photo;
    style?: ViewStyle;
}

const PhotoItem: React.FC<PhotoItemProps> = ({ photo, style }) => {
    const handlePress = useCallback(() => {
        // Handle photo press if needed
    }, []);

    return (
        <View style={[styles.photo, style]}>
            <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
                <View style={styles.photoInner}>
                    <Image
                        style={styles.photoImage}
                        source={{ uri: photo.src }}
                        resizeMode="cover"
                    />
                </View>
            </TouchableOpacity>
        </View>
    );
};

const Photos: React.FC<PhotosProps> = ({ photos, style }) => {
    const photoItems = useMemo(() => {
        if (!Array.isArray(photos) || photos.length === 0) return [];
        
        return photos.map((photo, index) => (
            <PhotoItem
                key={photo.id || index}
                photo={photo}
            />
        ));
    }, [photos]);

    return (
        <View style={[styles.container, style]}>
            {photoItems}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginLeft: -10,
        marginRight: -10,
    } as ViewStyle,
    photo: {
        padding: 10,
    } as ViewStyle,
    photoInner: {
        borderRadius: 4,
        overflow: 'hidden',
    } as ViewStyle,
    photoImage: {
        minWidth: 96,
        minHeight: 96,
        flex: 1,
    } as ImageStyle,
});

export default Photos;