import { Appearance, ColorSchemeName } from 'react-native';
import { themedColors } from '../constants/Colors';
import { ThemeColors } from '../types';

export interface ThemeContextType {
    colors: ThemeColors;
    theme: ColorSchemeName;
}

export const useTheme = (): ThemeContextType => {
    const theme = Appearance.getColorScheme();
    const colors = (theme ? themedColors[theme] : themedColors.default) as ThemeColors;
    
    return {
        colors,
        theme,
    };
};

export default function getThemedColors(theme?: ColorSchemeName): ThemeColors {
    const colors = theme ? themedColors[theme] : themedColors.default;
    if (!colors) {
        // Fallback to default colors if theme not found
        return themedColors.default as ThemeColors;
    }
    return colors as ThemeColors;
}