import { 
    // chats
    GET_CONTACTS,
    GET_CONTACTS_SUCCESS,
    GET_CONTACTS_FAILURE,
    GET_REPLIES,
    GET_REPLIES_SUCCESS,
    GET_REPLIES_FAILURE,
    GET_TOP_REPLIES,
    GET_TOP_REPLIES_SUCCESS,
    POST_REPLY_SUCCESS,
    CLEAR_REPLIES,
} from './actionTypes';
import axios from 'axios';
import { getAppLangCode } from '../helpers/store';

// Types
interface ApiResponse {
    success: boolean;
    data?: any;
    message?: string;
    error?: string;
}

interface ReplyData {
    cid: string | number;
    lastRID?: string | number;
    firstRID?: string | number;
    cthlang?: string;
}

interface PostReplyData {
    [key: string]: any;
}

// Action Creators
const getContactsInit = () => ({
    type: GET_CONTACTS,
});

const getContactsSuccess = (data: any) => ({
    type: GET_CONTACTS_SUCCESS,
    payload: data,
});

const getContactsFailure = (data: any) => ({
    type: GET_CONTACTS_FAILURE,
    payload: data,
});

export const getContacts = (id: string | number) => {
    return (dispatch: any) => {
        dispatch(getContactsInit());
        getAppLangCode().then((lang: string) => {
            axios({
                method: 'GET',
                url: `/user/contacts/${id}`,
                params: {
                    cthlang: lang
                },
            }).then((res: { data: any }) => {
                dispatch(getContactsSuccess(res.data));
            }).catch((err: any) => {
                console.error('Get contacts error:', err);
                dispatch(getContactsFailure('Failed to load contacts'));
            });
        });
    };
};

const getRepliesInit = (cid: string | number) => ({
    type: GET_REPLIES,
    payload: cid
});

const getRepliesSuccess = (data: any, lastRID: string | number | null) => ({
    type: GET_REPLIES_SUCCESS,
    payload: data,
    lastRID
});

export const getReplies = (ctid: string | number, lastRID: string | number | null = null) => {
    return (dispatch: any) => {
        if (lastRID === null && ctid !== 'New') {
            dispatch(getRepliesInit(ctid));
        }
        
        const data: ReplyData = {
            cid: ctid
        };
        
        if (lastRID !== null) {
            data.lastRID = lastRID;
        }
        
        getAppLangCode().then((lang: string) => {
            data.cthlang = lang;
            axios({
                method: 'GET',
                url: `/user/replies`,
                params: data,
            }).then((res: { data: any }) => {
                dispatch(getRepliesSuccess(res.data, lastRID));
            }).catch((err: any) => {
                console.error('Get replies error:', err);
            });
        });
    };
};

const postReplySuccess = (data: any) => ({
    type: POST_REPLY_SUCCESS,
    payload: data,
});

export const postReply = (data: PostReplyData) => {
    return (dispatch: any) => {
        axios({
            method: 'POST',
            url: `/user/reply`,
            data: data,
        }).then((res: { data: ApiResponse }) => {
            const { success, reply } = res.data;
            if (success) {
                dispatch(postReplySuccess(reply));
            }
        }).catch((err: any) => {
            console.error('Post reply error:', err);
        });
    };
};

const getTopRepliesSuccess = (data: any) => ({
    type: GET_TOP_REPLIES_SUCCESS,
    payload: data,
});

const getTopRepliesInit = () => ({
    type: GET_TOP_REPLIES,
});

export const getMoreTopReplies = (ctid: string | number, firstRID: string | number | null = null) => {
    return (dispatch: any) => {
        dispatch(getTopRepliesInit());
        
        const data: ReplyData = {
            cid: ctid
        };
        
        if (firstRID !== null) {
            data.firstRID = firstRID;
        }
        
        axios({
            method: 'GET',
            url: `/user/replies`,
            params: data
        }).then((res: { data: any }) => {
            dispatch(getTopRepliesSuccess(res.data));
        }).catch((err: any) => {
            console.error('Get more top replies error:', err);
        });
    };
};

export const clearReplies = () => ({
    type: CLEAR_REPLIES,
});

export default {
    getContacts,
    getReplies,
    postReply,
    getMoreTopReplies,
    clearReplies,
};