import { Platform } from 'react-native';
import { 
    EDIT_PROFILE_CLOSE_POPUP,
    EDIT_PROFILE_SUBMITTING,
    EDIT_PROFILE_SUCCESS,
    EDIT_PROFILE_FAILURE,
    // notifications
    GET_NOTIFICATIONS,
    GET_NOTIFICATIONS_SUCCESS,
    GET_NOTIFICATIONS_FAILURE,
    REFRESH_NOTIFICATIONS,
    LMORE_NOTIFICATIONS,
    LMORE_NOTIFICATIONS_SUCCESS,
    LMORE_NOTIFICATIONS_FAILURE,
    // bookings
    GET_USER_BOOKINGS,
    GET_USER_BOOKINGS_SUCCESS,
    GET_USER_BOOKINGS_FAILURE,
    LMORE_USER_BOOKINGS,
    LMORE_USER_BOOKINGS_SUCCESS,
    LMORE_USER_BOOKINGS_FAILURE,
} from './actionTypes';
import FormData from 'form-data';
import axios from 'axios';
import { getAppLangCode } from '../helpers/store';
import SiteDetails from '../constants/SiteDetails';

// Types
interface ProfileData {
    [key: string]: any;
    customAvatar?: {
        uri: string;
        data: string;
        fileName?: string;
    };
}

interface ApiResponse {
    success: boolean;
    data?: any;
    message?: string;
    error?: string;
}

interface NotificationData {
    data: any[];
    pages: number;
}

interface BookingData {
    items: any[];
    pages: number;
}

interface FileInfo {
    name: string;
    ext: string;
}

// Action Creators
export const profileClosePopup = () => ({
    type: EDIT_PROFILE_CLOSE_POPUP,
});

const profileSubmitting = (data: boolean) => ({
    type: EDIT_PROFILE_SUBMITTING,
    payload: data,
});

const submitProfileSuccess = (data: any) => ({
    type: EDIT_PROFILE_SUCCESS,
    payload: data,
});

const submitProfileFailure = (data: any) => ({
    type: EDIT_PROFILE_FAILURE,
    payload: data,
});

const extractFileName = (path: string): FileInfo => {
    const regex = /^.+\/(.+\/)*(.+)\.(.+)$/gm;
    let m: RegExpExecArray | null;
    let name = '';
    let ext = '';

    while ((m = regex.exec(path)) !== null) {
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        
        m.forEach((match, groupIndex) => {
            if (groupIndex === 2) {
                name = match;
            } 
            if (groupIndex === 3) {
                ext = match;
            } 
        });
    }

    return { name, ext };
};

export const submitProfile = (data: ProfileData) => {
    return (dispatch: any) => {
        dispatch(profileSubmitting(true));
        
        const formData = new FormData();
        
        for (const property in data) {
            if (property !== 'customAvatar') {
                formData.append(property, data[property]);
            } else if (data['customAvatar']) {
                const nameExt = extractFileName(data['customAvatar']['uri']);
                
                const imageObj = {
                    data: data['customAvatar']['data'], 
                    fname: `${nameExt.name}.${nameExt.ext}`, 
                    fext: nameExt.ext 
                };

                formData.append('customAvatar', JSON.stringify(imageObj));
            }
        }
        
        if (data['customAvatar']) {
            data.avatar = data['customAvatar']['uri'];
        }
        
        axios.post(`/user/edit`, formData, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
                'Authorization': SiteDetails.app_key,
            }
        }).then((res: { data: ApiResponse }) => {
            const { success } = res.data;
            if (success) {
                dispatch(submitProfileSuccess(data));
            } else {
                dispatch(submitProfileFailure(res.data));
            }
        }).catch((err: any) => {
            console.error('Profile update error:', err);
            dispatch(submitProfileFailure('Profile update failed'));
        });
    };
};

// Notifications
const getNotificationsInit = (bool: boolean) => ({
    type: GET_NOTIFICATIONS,
    payload: bool,
});

const getNotificationsSuccess = (notifications: any[], notipages: number) => ({
    type: GET_NOTIFICATIONS_SUCCESS,
    notifications,
    notipages,
});

const getNotificationsFailure = (data: any) => ({
    type: GET_NOTIFICATIONS_FAILURE,
    payload: data,
});

export const getNotifications = (id: string | number) => {
    return (dispatch: any) => {
        dispatch(getNotificationsInit(true));
        
        getAppLangCode().then((lang: string) => {
            axios({
                method: 'GET',
                url: `/user/notifications/${id}`,
                params: {
                    paged: 1,
                    cthlang: lang,
                },
            }).then((res: { data: ApiResponse & NotificationData }) => {
                const { success } = res.data;
                if (success) {
                    dispatch(getNotificationsSuccess(res.data.data, res.data.pages));
                } else {
                    dispatch(getNotificationsFailure(res.data.message || 'Failed to load notifications'));
                }
            }).catch((err: any) => {
                console.error('Get notifications error:', err);
                dispatch(getNotificationsFailure('Failed to load notifications'));
            });
        });
    };
};

const refreshNotificationsInit = (bool: boolean) => ({
    type: REFRESH_NOTIFICATIONS,
    payload: bool,
});

export const refreshNotifications = (id: string | number) => {
    return (dispatch: any) => {
        dispatch(refreshNotificationsInit(true));
        
        getAppLangCode().then((lang: string) => {
            axios({
                method: 'GET',
                url: `/user/notifications/${id}`,
                params: {
                    paged: 1,
                    cthlang: lang,
                },
            }).then((res: { data: ApiResponse & NotificationData }) => {
                const { success } = res.data;
                if (success) {
                    dispatch(getNotificationsSuccess(res.data.data, res.data.pages));
                } else {
                    dispatch(getNotificationsFailure(res.data.message || 'Failed to refresh notifications'));
                }
            }).catch((err: any) => {
                console.error('Refresh notifications error:', err);
                dispatch(getNotificationsFailure('Failed to refresh notifications'));
            });
        });
    };
};

const loadMoreNotificationsInit = (bool: boolean) => ({
    type: LMORE_NOTIFICATIONS,
    payload: bool,
});

const loadMoreNotificationsSuccess = (notifications: any[], notipages: number) => ({
    type: LMORE_NOTIFICATIONS_SUCCESS,
    notifications,
    notipages,
});

export const loadMoreNotifications = (id: string | number, paged: number) => {
    return (dispatch: any) => {
        dispatch(loadMoreNotificationsInit(true));
        
        getAppLangCode().then((lang: string) => {
            axios({
                method: 'GET',
                url: `/user/notifications/${id}`,
                params: {
                    paged: paged,
                    cthlang: lang,
                },
            }).then((res: { data: ApiResponse & NotificationData }) => {
                const { success } = res.data;
                if (success) {
                    dispatch(loadMoreNotificationsSuccess(res.data.data, res.data.pages));
                } else {
                    dispatch(getNotificationsFailure('Failed to load more notifications'));
                }
            }).catch((err: any) => {
                console.error('Load more notifications error:', err);
                dispatch(getNotificationsFailure('Failed to load more notifications'));
            });
        });
    };
};

// Bookings
const getBookingsInit = (lmore: boolean) => ({
    type: lmore ? LMORE_USER_BOOKINGS : GET_USER_BOOKINGS,
});

const getBookingsSuccess = (items: any[], pages: number, lmore: boolean) => ({
    type: lmore ? LMORE_USER_BOOKINGS_SUCCESS : GET_USER_BOOKINGS_SUCCESS,
    items,
    pages,
});

const getBookingsFailure = (lmore: boolean, data: any) => ({
    type: lmore ? LMORE_USER_BOOKINGS_FAILURE : GET_USER_BOOKINGS_FAILURE,
    payload: data,
});

export const getBookings = (id: string | number, paged: number = 1, lmore: boolean = false) => {
    return (dispatch: any) => {
        dispatch(getBookingsInit(lmore));

        axios.get(`/user/bookings/${id}?paged=${paged}`).then((res: { data: BookingData }) => {
            const { items, pages } = res.data;
            if (items && pages) {
                dispatch(getBookingsSuccess(items, pages, lmore));
            } else {
                dispatch(getBookingsFailure(lmore, 'Response data error'));
            }
        }).catch((err: any) => {
            console.error('Get bookings error:', err);
            dispatch(getBookingsFailure(lmore, 'Internal error'));
        });
    };
};

export default {
    profileClosePopup,
    submitProfile,
    getNotifications,
    refreshNotifications,
    loadMoreNotifications,
    getBookings,
};