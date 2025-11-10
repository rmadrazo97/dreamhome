import React from 'react';
import { Text, TextProps, useColorScheme } from 'react-native';
import { decode } from 'html-entities';
import getThemedColors from '../../helpers/Theme';
import { boldFontFamily } from '../../constants/Colors';

interface TextHeavyProps extends TextProps {
    children?: React.ReactNode;
}

const TextHeavy: React.FC<TextHeavyProps> = ({ children, style, ...props }) => {
    const colors = getThemedColors(useColorScheme());
    // Handle null/undefined
    if (children == null || children === undefined) {
        return (
            <Text 
                {...props} 
                style={[
                    { fontFamily: boldFontFamily, color: colors.heavyText }, 
                    style
                ]}
            />
        );
    }
    
    // Handle string directly
    if (typeof children === 'string' || children instanceof String) {
        return (
            <Text 
                {...props} 
                style={[
                    { fontFamily: boldFontFamily, color: colors.heavyText }, 
                    style
                ]}
            >
                {decode(children as string, { level: 'all' })}
            </Text>
        );
    }
    
    // Handle arrays - filter out null/undefined and convert to strings
    if (Array.isArray(children)) {
        const processedChildren = children
            .filter(child => child != null && child !== undefined && child !== false)
            .map(child => {
                if (typeof child === 'string' || child instanceof String) {
                    return child;
                }
                if (typeof child === 'number' || typeof child === 'boolean') {
                    return String(child);
                }
                // For React elements, return as-is (React Native Text can handle nested Text)
                return child;
            });
        
        return (
            <Text 
                {...props} 
                style={[
                    { fontFamily: boldFontFamily, color: colors.heavyText }, 
                    style
                ]}
            >
                {processedChildren.map((child) => {
                    if (typeof child === 'string' || child instanceof String) {
                        return decode(child as string, { level: 'all' });
                    }
                    return child;
                })}
            </Text>
        );
    }
    
    // Handle numbers and booleans
    if (typeof children === 'number' || typeof children === 'boolean') {
        return (
            <Text 
                {...props} 
                style={[
                    { fontFamily: boldFontFamily, color: colors.heavyText }, 
                    style
                ]}
            >
                {String(children)}
            </Text>
        );
    }
    
    // Fallback - convert to string
    return (
        <Text 
            {...props} 
            style={[
                { fontFamily: boldFontFamily, color: colors.heavyText }, 
                style
            ]}
        >
            {String(children || '')}
        </Text>
    );
};

export default TextHeavy;