import AsyncStorage from '@react-native-async-storage/async-storage';
import { defaultLanguage, defaultCurrency } from '../constants/SiteDetails';
import store from '../store';
import axios from 'axios';
import { 
    GET_USER_SUCCESS, 
    LOGOUT_SUCCESS,
} from '../actions/actionTypes';

// Types
interface UserData {
    id: number;
    authToken: string;
    [key: string]: any;
}

interface ApiResponse {
    data: UserData | null;
    auth_token?: string;
}

// Utility function for timeout
function timeout(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const getUserDatas = async (): Promise<boolean> => {
    try {
        const user = await AsyncStorage.getItem('user');
        if (!user) return false;

        try {
            const userObj: UserData = JSON.parse(user);
            const { id, authToken } = userObj;
            
            if (!id || !authToken || id <= 0) return false;

            const res = await axios.get<ApiResponse>(`/user/${id}`).catch(err => {
                console.log('User fetch error:', err);
                return null;
            });
            
            if (res?.data && res.data !== null) {
                const { auth_token } = res.data;
                if (auth_token === authToken) {
                    store.dispatch({ 
                        type: GET_USER_SUCCESS, 
                        payload: { ...res.data, logTime: new Date().getTime() } 
                    });
                    return true;
                }
            }
        } catch (parseError) {
            console.log('User data parse error:', parseError);
        }
    } catch (storageError) {
        console.log('Storage read error:', storageError);
    }

    return false;
};

export const logOut = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem('user');
        store.dispatch({ type: LOGOUT_SUCCESS });
    } catch (error) {
        console.log('Logout error:', error);
    }
};

export const getLoggedInID = (): number => {
    const { user } = store.getState();
    if (user?.isLoggedIn && user.ID) {
        return user.ID;
    }
    return 0;
};

export const isUserLoggedIn = (): boolean => {
    const { user } = store.getState();
    return Boolean(user?.isLoggedIn);
};

export const getCurrencyAsync = async (): Promise<string> => {
    try {
        const currency = await AsyncStorage.getItem('currency');
        return currency || defaultCurrency;
    } catch (error) {
        console.log('Currency fetch error:', error);
        return defaultCurrency;
    }
};

export const setCurrencyAsync = async (currency: string): Promise<boolean> => {
    try {
        await AsyncStorage.setItem('currency', currency);
        return true;
    } catch (error) {
        console.log('Currency save error:', error);
        return false;
    }
};

export const getLanguageAsync = async (): Promise<any> => {
    try {
        const language = await AsyncStorage.getItem('language');
        if (language) {
            try {
                return JSON.parse(language);
            } catch (parseError) {
                console.log('Language parse error:', parseError);
            }
        }
    } catch (error) {
        console.log('Language fetch error:', error);
    }
    return defaultLanguage;
};

export const setLanguageAsync = async (language: any): Promise<boolean> => {
    try {
        await AsyncStorage.setItem('language', JSON.stringify(language));
        return true;
    } catch (error) {
        console.log('Language save error:', error);
        return false;
    }
};

export default {
    getUserDatas,
    logOut,
    getLoggedInID,
    isUserLoggedIn,
    getCurrencyAsync,
    setCurrencyAsync,
    getLanguageAsync,
    setLanguageAsync,
};