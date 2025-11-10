import React from 'react';
import { StyleSheet, View, useColorScheme, ViewStyle, TextStyle } from 'react-native';
import TextHeavy from './TextHeavy';
import getThemedColors from '../../helpers/Theme';

interface NavTitleProps {
    title: string;
    style?: ViewStyle;
}

const NavTitle: React.FC<NavTitleProps> = ({ title, style }) => {
    const colors = getThemedColors(useColorScheme());
    
    return (
        <View style={[styles.wrapper, style]}>
            <TextHeavy style={[styles.title, { color: colors.backBtn }]}>
                {title}
            </TextHeavy>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        alignItems: 'center',
    } as ViewStyle,
    title: {
        textAlign: 'center', 
        fontSize: 17, 
    } as TextStyle,
});

export default NavTitle;