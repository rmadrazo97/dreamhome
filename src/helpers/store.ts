import store from '../store';
import axios from 'axios';
import { getCurrencyAsync, getLanguageAsync } from "./user";
import { 
    APP_LANGUAGE_CHANGE_SUCCESS,
    APP_CURRENCY_CHANGE_SUCCESS,
    GET_SITE_DATAS,
    GET_SITE_DATAS_FAILURE,
    GET_CURRENCY_ATTRS,
    GET_CURRENCY_ATTRS_SUCCESS,
    FILTER_BY_CAT,
    FILTER_BY_LOC,
    FILTER_BY_TAG,
    FILTER_BY_FEA,
    FILTER_NEAR_BY,
    GET_LISTINGS_START,
    GET_LISTINGS_SUCCESS,
    GET_LISTINGS_FAILURE,
    LMORE_LISTINGS_START,
    LMORE_LISTINGS_SUCCESS,
    LMORE_LISTINGS_FAILURE,
    GET_STRINGS_SUCCESS,
    BOOKING_STATUS,
    FILTER_RESET,
} from '../actions/actionTypes';
import SiteDetails from '../constants/SiteDetails';

// Types
interface FilterParams {
    cthlang?: string;
    [key: string]: any;
}

interface ListingsResponse {
    items: any[];
    pages: any;
}

export const changeAppLanguage = (code: string): void => {
    store.dispatch({ type: APP_LANGUAGE_CHANGE_SUCCESS, payload: code });
};

export const changeAppCurrency = (code: string): void => {
    store.dispatch({ type: APP_CURRENCY_CHANGE_SUCCESS, payload: code });
};

export const getSiteDatas = async (): Promise<void> => {
    try {
        store.dispatch({ type: GET_SITE_DATAS });
        const lang = await getAppLangCode();
        
        // Add pagination parameters to get all listings
        const params = {
            cthlang: lang,
            posts_per_page: 100, // Increase per page limit to get more items
            page: 1,       // Start with first page
        };
        
        const res = await axios({
            method: 'GET',
            url: `${SiteDetails.url}wp-json/cththemes/v1/listings`,
            params: params, // Use the params object instead of just cthlang
        }).catch(err => {
            console.log('Site data fetch error:', err);
            return null;
        });
        
        console.log('res site', res);
        if (res?.data) {
            // Structure the data properly for the listings reducer
            const listingsData = {
                items: res.data.items || [],
                pages: res.data.pages || 1
            };
            store.dispatch({ type: GET_LISTINGS_SUCCESS, payload: listingsData });
        } else {
            store.dispatch({ type: GET_SITE_DATAS_FAILURE });
        }
    } catch (error) {
        console.log('Site data error:', error);
        store.dispatch({ type: GET_SITE_DATAS_FAILURE });
    }
};

export const getCurrencyAttrs = async (curr?: string): Promise<void> => {
    try {
        if (!curr) curr = await getCurrencyAsync();
        
        const lang = await getAppLangCode();
        
        store.dispatch({ type: GET_CURRENCY_ATTRS });

        const res = await axios({
            method: 'GET',
            url: `${SiteDetails.url}wp-json/cththemes/v1/listings/currency`,
            params: { 
                currency: curr,
                cthlang: lang
            },
        }).catch(err => {
            console.log('Currency attrs error:', err);
            return null;
        });
        
        if (res?.data) {
            store.dispatch({ type: GET_CURRENCY_ATTRS_SUCCESS, payload: res.data });
        } else {
            console.log('No currency data received');
        }
    } catch (error) {
        console.log('Currency attrs error:', error);
    }
};

export const getStrings = async (lang_code?: string): Promise<void> => {
    try {
        if (!lang_code) {
            const lang = await getLanguageAsync();
            lang_code = lang.code;
        }

        const res = await axios({
            method: 'GET',
            url: `${SiteDetails.url}wp-json/cththemes/v1/listings/site/strings`,
            params: { cthlang: lang_code },
        }).catch(err => {
            console.log('Strings fetch error:', err);
            return null;
        });
        if (res?.data) {
            store.dispatch({ type: GET_STRINGS_SUCCESS, payload: res.data });
        }
    } catch (error) {
        console.log('Strings error:', error);
    }
};

export const filterListings = async (params: FilterParams, lmore = false): Promise<void> => {
    try {
        store.dispatch({ type: lmore ? LMORE_LISTINGS_START : GET_LISTINGS_START });
        const lang = await getAppLangCode();
        
        if (typeof params === 'object') {
            params.cthlang = lang;
        }

        const res = await axios({
            method: 'GET',
            url: `${SiteDetails.url}wp-json/cththemes/v1/listings`,
            params: params,
        }).catch(err => {
            console.log('Listings fetch error:', err);
            return null;
        });

        if (res?.data) {
            const { items, pages }: ListingsResponse = res.data;
            if (items && pages) {
                store.dispatch({ 
                    type: lmore ? LMORE_LISTINGS_SUCCESS : GET_LISTINGS_SUCCESS, 
                    items, 
                    pages 
                });
            } else {
                store.dispatch({ 
                    type: lmore ? LMORE_LISTINGS_FAILURE : GET_LISTINGS_FAILURE 
                });
            }
        } else {
            store.dispatch({ 
                type: lmore ? LMORE_LISTINGS_FAILURE : GET_LISTINGS_FAILURE 
            });
        }
    } catch (error) {
        console.log('Filter listings error:', error);
        store.dispatch({ 
            type: lmore ? LMORE_LISTINGS_FAILURE : GET_LISTINGS_FAILURE 
        });
    }
};

export const filterByCat = (id: number): void => {
    store.dispatch({ type: FILTER_BY_CAT, payload: id });
};

export const filterByLoc = (id: number): void => {
    store.dispatch({ type: FILTER_BY_LOC, payload: id });
};

export const filterByTag = (id: number): void => {
    store.dispatch({ type: FILTER_BY_TAG, payload: id });
};

export const filterByFea = (id: number): void => {
    store.dispatch({ type: FILTER_BY_FEA, payload: id });
};

export const filterNearBy = (lat: number, lng: number): void => {
    store.dispatch({ type: FILTER_NEAR_BY, lat, lng });
};

export const filterReset = (): void => {
    store.dispatch({ type: FILTER_RESET });
};

// Extract post navigation params
export const extractPostParams = (post: any): { id: any; title: any } => {
    const { id, title } = post;
    return { id, title };
};

export const isUserLoggedIn = (): boolean => {
    const { user } = store.getState();
    return Boolean(user?.isLoggedIn);
};

export const checkBkPayment = (id: number): void => {
    axios({
        method: 'GET',
        url: `${SiteDetails.url}wp-json/cththemes/v1/listings/booking/status`,
        params: { id }
    }).then(res => {
        store.dispatch({
            type: BOOKING_STATUS,
            status: res.data.status
        });
    }).catch(err => {
        console.log('Booking status error:', err);
    });
};

export const getAppLangCode = async (): Promise<string> => {
    const { code } = await getLanguageAsync();
    return code;
};

export default store;