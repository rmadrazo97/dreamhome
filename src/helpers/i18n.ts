import { I18nManager } from "react-native";
import I18n from "i18n-js";
import moment from 'moment';

// Import locale files
import en from "../locales/en";
import fr from "../locales/fr";
import tr from "../locales/tr";
import cn from "../locales/cn";
import pt from "../locales/pt";
import es from "../locales/es";
import jp from "../locales/jp";
import pl from "../locales/pl";
import ru from "../locales/ru";
import it from "../locales/it";
import de from "../locales/de";
import vi from "../locales/vi";
import my from "../locales/my";

// Translation getters
const translationGetters = {
    en: en,
    fr: fr,
    tr: tr,
    cn: cn,
    pt: pt,
    es: es,
    jp: jp,
    pl: pl,
    ru: ru,
    it: it,
    de: de,
    vi: vi,
    my: my,
};

export const translate = (key: string, key2?: string, config?: any): string => {
    let tkey = key;
    if (key2 && key2 !== '') {
        tkey += `.${key2}`;
    }
    try {
        const result = I18n.t(tkey, { defaultValue: '', ...config });
        
        // If result is null or undefined, return empty string
        if (result == null) {
            return '';
        }
        
        // If result is already a string, return it (but check it's not '[object Object]')
        if (typeof result === 'string') {
            // Sometimes I18n might return '[object Object]' as a string if something went wrong
            if (result === '[object Object]' || result.startsWith('[object')) {
                console.warn('I18n returned object string for key:', tkey);
                return '';
            }
            return result;
        }
        
        // If result is an object, this shouldn't happen for simple string translations
        // but handle it gracefully
        if (typeof result === 'object') {
            console.warn('I18n returned object for key:', tkey, result);
            // Try to extract a meaningful value
            if ('defaultValue' in result && typeof result.defaultValue === 'string') {
                return result.defaultValue;
            }
            return '';
        }
        
        // For numbers, booleans, etc., convert to string
        return String(result);
    } catch (error) {
        console.warn('Translation error for key:', tkey, error);
        return '';
    }
};

export const setI18nConfig = (lang: string = 'en', rtl: boolean = false): void => {
    const fallback = { languageTag: "en", isRTL: false };
    const languageTag = lang;
    const isRTL = rtl || fallback.isRTL;

    I18n.fallbacks = true;
    I18nManager.forceRTL(isRTL);
    I18n.translations = translationGetters;
    I18n.locale = languageTag;
};

export const dateFormat = (date: any, format: string = 'MMMM DD, YYYY'): string => {
    let mdate = moment(date);
    if (!mdate.isValid()) {
        mdate = moment();
    }
    return mdate.format(format);
};

export const dateTimeFormat = (date: any, format: string = 'MMMM DD, YYYY HH:mm:ss'): string => {
    let mdate = moment(date);
    if (!mdate.isValid()) {
        mdate = moment();
    }
    return mdate.format(format);
};

export default {
    translate,
    setI18nConfig,
    dateFormat,
    dateTimeFormat,
};