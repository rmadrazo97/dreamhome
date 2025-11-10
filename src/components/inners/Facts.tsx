import React, { useMemo } from 'react';
import { ThemeColors } from '../../types';
import {
    StyleSheet,
    View,
    ViewStyle,
    TextStyle,
} from 'react-native';
import { translate } from "../../helpers/i18n";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { aweIcon } from '../../helpers/helpers';
import TextBold from '../../components/ui/TextBold';
import TextRegular from '../../components/ui/TextRegular';

// Types
interface Fact {
    id: number;
    title: string;
    number: string | number;
    icon: string;
}

interface FactsProps {
    data: Fact[];
    apColors: ThemeColors;
    showTitle?: boolean;
    style?: ViewStyle;
}

interface FactItemProps {
    data: Fact;
    apColors: ThemeColors;
}

const FactItem: React.FC<FactItemProps> = ({ data, apColors }) => {
    return (
        <View style={styles.factWrap}>
            <View style={styles.factInner}>
                {data.icon && data.icon !== '' && (
                    <FontAwesome5 
                        name={aweIcon(data.icon)} 
                        style={[styles.factIcon, { color: apColors.tText }]}
                    />
                )}
                <TextRegular style={[styles.factTitle, { color: apColors.tText }]}>
                    {data.title}
                </TextRegular>
                <TextBold style={[styles.factNumber, { color: apColors.appColor }]}>
                    {data.number}
                </TextBold>
            </View>
        </View>
    );
};

const Facts: React.FC<FactsProps> = ({ data, apColors, showTitle = false, style }) => {
    const factItems = useMemo(() => {
        if (!Array.isArray(data) || data.length === 0) return [];
        
        return data.map((fact, index) => (
            <FactItem
                key={fact.id || index}
                data={fact}
                apColors={apColors}
            />
        ));
    }, [data, apColors]);

    return (
        <View style={[styles.container, style]}>
            {showTitle && (
                <TextBold style={[styles.title, { color: apColors.tText }]}>
                    {translate('slisting', 'facts', {})}
                </TextBold>
            )}
            <View style={styles.factsWrap}>
                {factItems}
            </View>
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
    factsWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 10,
    } as ViewStyle,
    factWrap: {
        width: '47%',
        marginBottom: 10,
    } as ViewStyle,
    factInner: {
        flex: 1,
    } as ViewStyle,
    factIcon: {
        fontSize: 17,
    } as TextStyle,
    factTitle: {
        fontSize: 17,
        marginTop: 5,
    } as TextStyle,
    factNumber: {
        fontSize: 22,
        marginTop: 5,
    } as TextStyle,
});

export default Facts;