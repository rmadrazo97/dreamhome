import React from 'react';
import {
    useColorScheme,
    ViewStyle,
    TextStyle,
} from 'react-native';
import ResultPopup from './ResultPopup';
import TextHeavy from './ui/TextHeavy';
import TextRegular from './ui/TextRegular';
import getThemedColors from '../helpers/Theme';

// Types
interface SuccessPopupProps {
    visible: boolean;
    title: string;
    message?: string;
    buttons?: React.ReactNode;
    style?: ViewStyle;
}

const SuccessPopup: React.FC<SuccessPopupProps> = ({
    visible,
    title,
    message = '',
    buttons,
    style
}) => {
    const colors = getThemedColors(useColorScheme());

    return (
        <ResultPopup loading={visible} style={style}>
            <TextHeavy style={[styles.title, { color: colors.tText }]}>
                {title}
            </TextHeavy>
            {message && message !== '' && (
                <TextRegular style={[styles.message, { color: colors.pText }]}>
                    {message}
                </TextRegular>
            )}
            {buttons && (
                <View style={styles.buttonsContainer}>
                    {buttons}
                </View>
            )}
        </ResultPopup>
    );
};

const styles = {
    title: {
        fontSize: 22,
        textAlign: 'center' as const,
        lineHeight: 28,
    } as TextStyle,
    message: {
        fontSize: 15,
        textAlign: 'center' as const,
        marginTop: 20,
    } as TextStyle,
    buttonsContainer: {
        marginTop: 20,
    } as ViewStyle,
};

export default SuccessPopup;