import React from 'react';
import {
    StyleSheet,
    View,
    useColorScheme,
    ViewStyle,
    TextStyle,
} from 'react-native';
import TextMedium from '../ui/TextMedium';
import { MarkerSvg } from '../icons/ButtonSvgIcons';
import getThemedColors from '../../helpers/Theme';

// Types
interface AddressProps {
    address: string;
    isBlack?: boolean;
    style?: ViewStyle;
}

const Address: React.FC<AddressProps> = ({ address, isBlack = false, style }) => {
    const colors = getThemedColors(useColorScheme());
    
    return (
        <View style={[styles.container, style]}>
            <MarkerSvg color={colors.addressText} style={styles.markerIcon} />
            <TextMedium style={[styles.addressText, { color: colors.addressText }]}>
                {address}
            </TextMedium>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    } as ViewStyle,
    markerIcon: {
        marginRight: 5,
    } as ViewStyle,
    addressText: {
        fontSize: 12,
    } as TextStyle,
});

export default Address;