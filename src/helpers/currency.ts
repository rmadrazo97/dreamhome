import { toNumber } from 'i18n-js';
import store from '../store';

// Types
interface CurrencyState {
    rate: string;
    decimal: string;
    dec_sep: string;
    ths_sep: string;
    sb_pos: string;
    symbol: string;
}

export function old_fomartCurrOut(price: any, with_symbol: boolean = true): string {
    price = parseFloat(price);
    if (isNaN(price)) price = 0;
    
    const { currency }: { currency: CurrencyState } = store.getState();
    
    if (currency) {
        price = parseFloat(price) * parseFloat(currency.rate);
        const decimal = parseInt(currency.decimal);
        
        if (decimal > 0) {
            const pattern = new RegExp(
                currency.dec_sep === '.'
                    ? '(\\d)(?=(\\d{3})+\\.)'
                    : `(\\d)(?=(\\d{3})+${currency.dec_sep})`,
                'g',
            );
            price = price
                .toFixed(decimal)
                .replace('.', currency.dec_sep)
                .replace(pattern, '$1' + currency.ths_sep);
        } else {
            price = (Math.round(price) + '').replace(
                /(\d)(?=(\d{3})+$)/g,
                '$1' + currency.ths_sep,
            );
        }
        
        if (with_symbol) {
            if (currency.sb_pos === 'left') {
                price = currency.symbol + price;
            } else if (currency.sb_pos === 'left_space') {
                price = currency.symbol + ' ' + price;
            } else if (currency.sb_pos === 'right_space') {
                price += ' ' + currency.symbol;
            } else {
                price += currency.symbol;
            }
        }
    } else if (with_symbol) {
        price = '$' + price;
    }

    return price;
}

export function fomartCurrOut(price: any, with_symbol: boolean = true): string {
    price = parseFloat(price);
    if (isNaN(price)) price = 0;
    
    const { currency }: { currency: CurrencyState } = store.getState();
    
    if (currency) {
        price = parseFloat(price) * parseFloat(currency.rate);
        const decimal = parseInt(currency.decimal);

        let suffix = '';
        if (price > 99999 && price < 1000000) {
            suffix = ' K';
            price = price / 1000;
        } else if (price >= 1000000) {
            suffix = ' M';
            price = price / 1000000;
        }

        if (decimal > 0) {
            const pattern = new RegExp(
                currency.dec_sep === '.'
                    ? '(\\d)(?=(\\d{3})+\\.)'
                    : `(\\d)(?=(\\d{3})+${currency.dec_sep})`,
                'g',
            );
            price = price
                .toFixed(decimal)
                .replace('.', currency.dec_sep)
                .replace(pattern, '$1' + currency.ths_sep);
        } else {
            price = (Math.round(price) + '').replace(
                /(\d)(?=(\d{3})+$)/g,
                '$1' + currency.ths_sep,
            );
        }

        if (with_symbol) {
            if (currency.sb_pos === 'left') {
                price = currency.symbol + price + suffix;
            } else if (currency.sb_pos === 'left_space') {
                price = currency.symbol + ' ' + price + suffix;
            } else if (currency.sb_pos === 'right_space') {
                price += ' ' + currency.symbol + suffix;
            } else {
                price += currency.symbol + suffix;
            }
        }
    } else if (with_symbol) {
        price = '$' + price;
    }

    return price;
}

export function formatNumber(num: any, decimal: number = 1): number {
    num = parseFloat(num);
    if (isNaN(num)) return 0;
    return parseFloat(num.toFixed(decimal));
}

export function formatInt(num: any): number {
    num = parseInt(num);
    if (isNaN(num)) return 0;
    return num;
}

export function formatFloat(num: any): number {
    num = parseFloat(num);
    if (isNaN(num)) return 0;
    return num;
}

function inrange(min: number, number: number, max: number): boolean {
    return !isNaN(number) && number >= min && number <= max;
}

export function valid_coords(number_lat: any, number_lng: any): boolean {
    number_lat = parseFloat(number_lat);
    number_lng = parseFloat(number_lng);
    return inrange(-90, number_lat, 90) && inrange(-180, number_lng, 180);
}

export default {
    old_fomartCurrOut,
    fomartCurrOut,
    formatNumber,
    formatInt,
    formatFloat,
    valid_coords,
};