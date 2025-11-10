import React, { useCallback } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    ViewStyle,
} from 'react-native';
import { CloseSvg } from '../icons/ButtonSvgIcons';

// Types
interface CloseButtonProps {
    onPress?: () => void;
    color?: string;
    isBlack?: boolean;
    style?: ViewStyle;
}

const CloseButton: React.FC<CloseButtonProps> = ({ 
    onPress, 
    color, 
    isBlack = false, 
    style 
}) => {
    const handlePress = useCallback(() => {
        if (onPress) {
            onPress();
        }
    }, [onPress]);

    const fill = color || (isBlack ? '#000' : '#FFF');

    return (
        <View style={[styles.container, style]}>
            <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
                <View style={styles.navButton}>
                    <CloseSvg fill={fill} />
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 28,
    } as ViewStyle,
    navButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 28,
        height: 28,
    } as ViewStyle,
});

export default CloseButton;