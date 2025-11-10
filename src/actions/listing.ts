import axios from 'axios';
import moment from 'moment';
import { 
    GET_LISTING, 
    GET_LISTING_SUCCESS, 
    GET_LISTING_ERROR,
    REVIEW_SUBMIT,
    REVIEW_SUBMIT_SUCCESS,
    REVIEW_SUBMIT_FAILURE,
    REVIEW_SUBMIT_CLOSE_POPUP,
    CLAIM_SUBMIT,
    CLAIM_SUBMIT_SUCCESS,
    BOOKMARK_LISTING_SUCCESS,
} from './actionTypes';

// Types
interface ApiResponse {
    success: boolean;
    data?: any;
    message?: string;
    error?: string;
    ID?: string | number;
}

interface ReviewData {
    [key: string]: any;
}

interface ClaimData {
    [key: string]: any;
}

interface BookmarkData {
    user_id: string | number;
    listing: string | number;
}

// Action Creators
export const getListing = (bool: boolean) => ({
    type: GET_LISTING,
    payload: bool,
});

export const getListingSuccess = (data: any) => ({
    type: GET_LISTING_SUCCESS,
    payload: data,
    loading: false,
});

export const getListingError = (error: any) => ({
    type: GET_LISTING_ERROR,
    payload: error,
    loading: false,
});

export const getListingAction = (id: string | number) => {
    return (dispatch: any) => {
        dispatch(getListing(true));
        const dayStart = moment().format('YYYY-MM-DD'); 
        axios.get(`/${id}/${dayStart}`).then((res: { data: any }) => {
            dispatch(getListingSuccess(res.data));
        }).catch((err: any) => {
            console.error('Get listing error:', err);
            dispatch(getListingError(err));
        });
    };
};

// Review Actions
const reviewSubmitting = () => ({
    type: REVIEW_SUBMIT,
});

const submitReviewSuccess = (data: any) => ({
    type: REVIEW_SUBMIT_SUCCESS,
    payload: data,
});

const submitReviewFailure = () => ({
    type: REVIEW_SUBMIT_FAILURE,
});

export const submitReview = (data: ReviewData) => {
    return (dispatch: any) => {
        dispatch(reviewSubmitting());
        axios({
            method: 'POST',
            url: `/reviews/add`,
            data: data,
        }).then((res: { data: ApiResponse }) => {
            const { success, ID } = res.data;
            if (success) {
                dispatch(submitReviewSuccess(ID));
            } else {
                dispatch(submitReviewFailure());
            }
        }).catch((err: any) => {
            console.error('Submit review error:', err);
            dispatch(submitReviewFailure());
        });
    };
};

export const reviewClosePopup = () => ({
    type: REVIEW_SUBMIT_CLOSE_POPUP,
});

// Claim Actions
const claimSubmitting = () => ({
    type: CLAIM_SUBMIT,
});

const submitClaimSuccess = (success: boolean, message: string) => ({
    type: CLAIM_SUBMIT_SUCCESS,
    success,
    message
});

export const submitClaim = (data: ClaimData) => {
    return (dispatch: any) => {
        dispatch(claimSubmitting());
        axios({
            method: 'POST',
            url: `/claim/add`,
            data: data,
        }).then((res: { data: ApiResponse }) => {
            const message = res.data.data?.message || '';
            if (res.data.success) {
                dispatch(submitClaimSuccess(true, message));
            } else {
                dispatch(submitClaimSuccess(false, message));
            }
        }).catch((err: any) => {
            console.error('Submit claim error:', err);
            dispatch(submitClaimSuccess(false, 'Internal error'));
        });
    };
};

export const submitReport = (data: ClaimData) => {
    return (dispatch: any) => {
        dispatch(claimSubmitting());
        axios({
            method: 'POST',
            url: `/report/add`,
            data: data,
        }).then((res: { data: ApiResponse }) => {
            const message = res.data.data?.message || '';
            if (res.data.success) {
                dispatch(submitClaimSuccess(true, message));
            } else {
                dispatch(submitClaimSuccess(false, message));
            }
        }).catch((err: any) => {
            console.error('Submit report error:', err);
            dispatch(submitClaimSuccess(false, 'Internal error'));
        });
    };
};

// Bookmark Actions
const bookmarkListingSuccess = (success: boolean, message: string, listing: string | number = 0) => ({
    type: BOOKMARK_LISTING_SUCCESS,
    success,
    message,
    listing
});

export const bookmarkListing = (user_id: string | number, listing: string | number) => {
    return (dispatch: any) => {
        axios({
            method: 'POST',
            url: `/user/bookmark`,
            data: {
                user_id,
                listing
            },
        }).then((res: { data: ApiResponse }) => {
            const message = res.data.message || '';
            if (res.data.success) {
                dispatch(bookmarkListingSuccess(true, message, listing));
            } else {
                dispatch(bookmarkListingSuccess(false, message));
            }
        }).catch((err: any) => {
            console.error('Bookmark listing error:', err);
            dispatch(bookmarkListingSuccess(false, 'Internal error'));
        });
    };
};

export default {
    getListing,
    getListingAction,
    submitReview,
    reviewClosePopup,
    submitClaim,
    submitReport,
    bookmarkListing,
};