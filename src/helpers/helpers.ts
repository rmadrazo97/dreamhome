import { getThemedColors } from './Theme';

export function aweIcon(icon: string): string {
    return icon
        .replace('fa ', '')
        .replace('fas', '')
        .replace('fab', '')
        .replace('far', '')
        .replace('fal', '')
        .trim()
        .replace('fa-', '')
        .replace('cheeseburger', 'hamburger') // restaurant
        .replace('cutlery', 'utensils') // restaurant
        .replace('futbol-o', 'futbol') // fitness
        .replace('hand-peace-o', 'hand-peace')
        .replace('smile-plus', 'smile');
}

export function categoryColor(color: string): string {
    const colors = getThemedColors() || {};
    
    if (color === 'custom') {
        return colors.appColor || '#007AFF';
    }
    
    const colorKey = color.replace('-bg', 'CBg');
    return colors[colorKey] || colors.appColor || '#007AFF';
}

export const validateEmail = (email: string): boolean => {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(String(email).toLowerCase());
};

export default {
    aweIcon,
    categoryColor,
    validateEmail,
};