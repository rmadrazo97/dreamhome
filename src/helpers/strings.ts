import store from '../store';
import { sprintf } from 'sprintf-js';

export function getTrans(key: string = '', value: string = '', key2?: string | null): string {
    const { strings } = store.getState();
    
    if (!strings) return value;
    
    if (key2 && strings[key]?.[key2]) {
        return strings[key][key2];
    }
    
    if (strings[key]) {
        return strings[key];
    }
    
    return value;
}

export function getFormatTrans(
    key: string = '', 
    value: string = '', 
    key2?: string | null, 
    val1: string = '', 
    val2: string = ''
): string {
    const string = getTrans(key, value, key2);
    return sprintf(string, val1, val2);
}

export default {
    getTrans,
    getFormatTrans,
};