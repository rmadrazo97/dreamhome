import React, { useCallback, useMemo } from 'react';
import { StyleSheet, View, Modal, TouchableOpacity, Animated } from 'react-native';
import TextHeavy from './ui/TextHeavy';
import TextRegular from './ui/TextRegular';
import { ThemeColors } from '../types';

// Types
interface ErrorSuccessPopupProps {
    isSuccess?: boolean;
    isError?: boolean;
    title: string;
    message?: string;
    successButton?: React.ReactNode;
    errorButton?: React.ReactNode;
    onSuccessPress?: () => void;
    onErrorPress?: () => void;
    onClose?: () => void;
    apColors?: ThemeColors;
    visible?: boolean;
    autoHide?: boolean;
    hideDelay?: number;
}

const ErrorSuccessPopup: React.FC<ErrorSuccessPopupProps> = ({
    isSuccess = false,
    isError = false,
    title,
    message = '',
    successButton,
    errorButton,
    onSuccessPress,
    onErrorPress,
    onClose,
    apColors,
    visible = true,
    autoHide = false,
    hideDelay = 3000,
}) => {
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    // Show animation
    React.useEffect(() => {
        if (visible && (isSuccess || isError)) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [visible, isSuccess, isError, fadeAnim]);

    // Auto hide functionality
    React.useEffect(() => {
        if (autoHide && (isSuccess || isError) && visible) {
            const timer = setTimeout(() => {
                onClose?.();
            }, hideDelay);
            return () => clearTimeout(timer);
        }
    }, [autoHide, isSuccess, isError, visible, hideDelay, onClose]);

    const handleSuccessPress = useCallback(() => {
        onSuccessPress?.();
        if (!autoHide) {
            onClose?.();
        }
    }, [onSuccessPress, onClose, autoHide]);

    const handleErrorPress = useCallback(() => {
        onErrorPress?.();
        if (!autoHide) {
            onClose?.();
        }
    }, [onErrorPress, onClose, autoHide]);

    const handleBackdropPress = useCallback(() => {
        onClose?.();
    }, [onClose]);

    // Memoized styles
    const dynamicStyles = useMemo(() => ({
        titleStyle: {
            fontSize: 22,
            textAlign: 'center' as const,
            lineHeight: 28,
            color: apColors?.tText || '#000',
        },
        messageStyle: {
            fontSize: 15,
            textAlign: 'center' as const,
            marginTop: 20,
            color: apColors?.pText || '#666',
        },
        backdropStyle: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
    }), [apColors]);

    // Memoized popup content style
    const popupContentStyle = useMemo(() => [
        styles.popupContent,
        { backgroundColor: apColors?.modalInner || '#FFFFFF' }
    ], [apColors]);

    // Memoized content - render directly without nested Modal
    const successContent = useMemo(() => (
        <View style={popupContentStyle}>
            <TextHeavy style={dynamicStyles.titleStyle}>{title}</TextHeavy>
            {message !== '' && (
                <TextRegular style={dynamicStyles.messageStyle}>
                    {message}
                </TextRegular>
            )}
            {successButton && (
                <TouchableOpacity onPress={handleSuccessPress}>
                    {successButton}
                </TouchableOpacity>
            )}
        </View>
    ), [title, message, successButton, dynamicStyles, handleSuccessPress, popupContentStyle]);

    const errorContent = useMemo(() => (
        <View style={popupContentStyle}>
            <TextHeavy style={dynamicStyles.titleStyle}>{title}</TextHeavy>
            {message !== '' && (
                <TextRegular style={dynamicStyles.messageStyle}>
                    {message}
                </TextRegular>
            )}
            {errorButton && (
                <TouchableOpacity onPress={handleErrorPress}>
                    {errorButton}
                </TouchableOpacity>
            )}
        </View>
    ), [title, message, errorButton, dynamicStyles, handleErrorPress, popupContentStyle]);

    if (!visible) {
        return null;
    }

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <Animated.View 
                style={[
                    styles.backdrop, 
                    dynamicStyles.backdropStyle,
                    { opacity: fadeAnim }
                ]}
            >
                <TouchableOpacity 
                    style={styles.backdropTouchable}
                    onPress={handleBackdropPress}
                    activeOpacity={1}
                >
                    <View style={styles.container}>
                        {isSuccess && successContent}
                        {isError && errorContent}
                    </View>
                </TouchableOpacity>
            </Animated.View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backdropTouchable: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    popupContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        marginHorizontal: 30,
        padding: 30,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 280,
    },
});

export default ErrorSuccessPopup;