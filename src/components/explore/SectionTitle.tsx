import React from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    useColorScheme,
    ViewStyle,
    TextStyle,
} from 'react-native';
import { translate } from "../../helpers/i18n";
import TextHeavy from '../ui/TextHeavy';
import getThemedColors from '../../helpers/Theme';

interface SectionTitleProps {
    title?: string;
    showAll?: boolean;
    allText?: string;
    onViewAllPress?: () => void;
    style?: ViewStyle;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ 
    title, 
    showAll, 
    allText, 
    onViewAllPress, 
    style 
}) => {
    const colors = getThemedColors(useColorScheme());
    
    return (
        <View style={[styles.container, style]}>
            {title && title !== '' && (
                <TextHeavy style={[styles.title, { color: colors.tText }]}>
                    {title}
                </TextHeavy>
            )}
            {showAll && (
                <TouchableOpacity onPress={onViewAllPress}>
                    <TextHeavy style={[styles.subTitle, { color: colors.tText }]}>
                        {allText && allText !== '' ? allText : translate('home', 'view_all', {})}
                    </TextHeavy>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        marginBottom: 15,
        justifyContent: 'space-between'
    } as ViewStyle,
    title: {
        fontSize: 20,
        lineHeight: 25,
    } as TextStyle,
    subTitle: {
        fontSize: 15,
        lineHeight: 20,
    } as TextStyle,
});

export default SectionTitle;