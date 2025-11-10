import React, { useState, useMemo, useCallback } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    useColorScheme,
    ViewStyle,
    TextStyle,
} from 'react-native';
import HTML from 'react-native-render-html';
import getThemedColors from '../../helpers/Theme';
import { regularFontFamily } from '../../constants/Colors';
import TextMedium from '../../components/ui/TextMedium';
import { FAQ } from '../../types';

// Types
interface LFaqsProps {
    data: FAQ[];
    style?: ViewStyle;
}

interface LFaqProps {
    data: FAQ;
    index: number;
    isFirst?: boolean;
}

const LFaq: React.FC<LFaqProps> = ({ data, index, isFirst = false }) => {
    const colors = getThemedColors(useColorScheme());
    const { title, content } = data;
    const [show, setShow] = useState(isFirst);

    const handleToggle = useCallback(() => {
        setShow(prev => !prev);
    }, []);

    const htmlContent = useMemo(() => ({
        html: content || ''
    }), [content]);

    const baseFontStyle = useMemo(() => ({
        fontFamily: regularFontFamily,
        fontSize: 15,
        color: colors.pText
    }), [colors.pText]);

    return (
        <View style={styles.itemWrap}>
            <View style={styles.itemInner}>
                <TouchableOpacity 
                    onPress={handleToggle} 
                    style={[styles.itemLeft, { borderBottomColor: colors.separator }]}
                    activeOpacity={0.7}
                >
                    <TextMedium style={[styles.itemTitle, { color: colors.tText }]}>
                        {title}
                    </TextMedium>
                    <TextMedium style={[styles.itemTitle, { color: colors.tText }]}>
                        {show ? '−' : '+'}
                    </TextMedium>
                </TouchableOpacity>
                
                {show && content && (
                    <View style={styles.itemRight}>
                        <HTML 
                            source={htmlContent}
                            baseFontStyle={baseFontStyle}
                            contentWidth={300}
                        />
                    </View>
                )}
            </View>
        </View>
    );
};

const LFaqs: React.FC<LFaqsProps> = ({ data, style }) => {
    const faqItems = useMemo(() => {
        return data.map((faq, index) => (
            <LFaq 
                key={faq.id || index} 
                data={faq} 
                index={index}
                isFirst={index === 0}
            />
        ));
    }, [data]);

    return (
        <View style={[styles.container, style]}>
            <View style={styles.childsWrap}>{faqItems}</View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    } as ViewStyle,
    childsWrap: {
        marginBottom: 15,
    } as ViewStyle,
    itemWrap: {
        // Individual FAQ item wrapper
    } as ViewStyle,
    itemInner: {
        // Inner container for FAQ item
    } as ViewStyle,
    itemLeft: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        paddingVertical: 15,
        paddingHorizontal: 5,
    } as ViewStyle,
    itemTitle: {
        fontSize: 15,
        flex: 1,
        marginRight: 10,
    } as TextStyle,
    itemRight: {
        paddingTop: 10,
        paddingHorizontal: 5,
    } as ViewStyle,
});

export default LFaqs;