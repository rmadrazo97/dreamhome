import React, { useMemo, useCallback } from 'react';
import { ThemeColors } from '../../types';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    ViewStyle,
    TextStyle,
} from 'react-native';
import NavigationService from '../../helpers/NavigationService';
import { filterByFea } from '../../helpers/store';
import { translate } from "../../helpers/i18n";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { aweIcon } from '../../helpers/helpers';
import TextBold from '../../components/ui/TextBold';
import TextRegular from '../../components/ui/TextRegular';

// Types
interface Feature {
    id: number;
    name: string;
    icon: string;
}

interface FeaturesProps {
    data: Feature[];
    apColors: ThemeColors;
    showTitle?: boolean;
    style?: ViewStyle;
}

interface FeatureItemProps {
    data: Feature;
    apColors: ThemeColors;
    onPress: (id: number) => void;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ data, apColors, onPress }) => {
    console.log("FeatureItem:", data);
    const handlePress = useCallback(() => {
        onPress(data.id);
    }, [data.id, onPress]);

    return (
        <View style={styles.feature}>
            <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
                <View style={styles.feaInner}>
                    {data.icon && data.icon !== '' && (
                        <FontAwesome5 
                            name={aweIcon(data.icon)} 
                            style={[styles.icon, { color: apColors.appColor }]}
                        />
                    )}
                    <TextRegular style={styles.featureText}>
                        {data.name}
                    </TextRegular>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const Features: React.FC<FeaturesProps> = ({ data, apColors, showTitle = true, style }) => {
    const goToArchive = useCallback((id: number) => {
        filterByFea(id);
        NavigationService.navigate('Archive', {});
    }, []);

    const featureItems = useMemo(() => {
        if (!Array.isArray(data) || data.length === 0) return [];
        
        return data.map((feature, index) => (
            <FeatureItem
                key={feature.id || index}
                data={feature}
                apColors={apColors}
                onPress={goToArchive}
            />
        ));
    }, [data, apColors, goToArchive]);

    return (
        <>
            {showTitle && (
                <TextBold style={[styles.title, { color: apColors.tText }]}>
                    {translate('slisting', 'feas', {})}
                </TextBold>
            )}
            <View style={[styles.container, style]}>
                {featureItems}
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 15,
        marginTop: 10,
    } as TextStyle,
    container: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
    } as ViewStyle,
    feature: {
        paddingVertical: 5,
        paddingRight: 10,
    } as ViewStyle,
    feaInner: {
        flexDirection: 'row',
        alignItems: 'center',
    } as ViewStyle,
    icon: {
        fontSize: 15,
        backgroundColor: '#F5F6FA',
        width: 30,
        height: 30,
        borderRadius: 15,
        overflow: 'hidden',
        textAlign: 'center',
        lineHeight: 30,
        marginRight: 5,
    } as TextStyle,
    featureText: {
        fontSize: 15,
    } as TextStyle,
});

export default Features;