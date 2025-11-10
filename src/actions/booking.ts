import { 
    CKINOUT_SELECTED, 
    PROCESS_TO_CHECKOUT, 
    CKINOUT_SUBMITTING, 
    CHECKOUT_SUBMIT_SUCCESS,
    CHECKOUT_SUBMIT_FAILURE, 
    CHECKOUT_EXIT,
    BOOKING_CANCEL,
    BOOKING_CANCEL_SUCCESS,
    BOOKING_CANCEL_FAILURE,
} from './actionTypes';
import axios from 'axios';

// Types
interface CheckInOutData {
    checkIn: string;
    checkOut: string;
    [key: string]: any;
}

interface CheckoutData {
    [key: string]: any;
}

interface BookingCancelData {
    bookingId: string | number;
    [key: string]: any;
}

interface ApiResponse {
    success: boolean;
    data?: any;
    error?: string;
    message?: string;
}

// Action Creators
export const checkInOutSelect = (ckinout: CheckInOutData) => ({
    type: CKINOUT_SELECTED,
    payload: ckinout,
});

export const processToCheckout = (data: CheckoutData) => ({
    type: PROCESS_TO_CHECKOUT,
    payload: data,
});

const checkoutSubmitting = (bool: boolean) => ({
    type: CKINOUT_SUBMITTING,
    payload: bool,
});

const submitCheckoutSuccess = (data: any) => ({
    type: CHECKOUT_SUBMIT_SUCCESS,
    payload: data,
});

const submitCheckoutFailure = (data: any) => ({
    type: CHECKOUT_SUBMIT_FAILURE,
    payload: data,
});

export const submitCheckout = (data: CheckoutData) => {
    return (dispatch: any) => {
        dispatch(checkoutSubmitting(true));
        axios({
            method: 'POST',
            url: `/booking/checkout`,
            data: data,
        }).then((res: { data: ApiResponse }) => {
            const { success } = res.data;
            if (success) {
                dispatch(submitCheckoutSuccess(res.data));
            } else {
                dispatch(submitCheckoutFailure(res.data));
            }
        }).catch((err: any) => {
            console.error('Checkout error:', err);
            dispatch(submitCheckoutFailure('Internal error'));
        });
    };
};

export const checkoutExit = () => ({
    type: CHECKOUT_EXIT
});

const cancelBookingInit = () => ({
    type: BOOKING_CANCEL,
});

const cancelBookingSuccess = () => ({
    type: BOOKING_CANCEL_SUCCESS,
});

const cancelBookingFailure = (message: string) => ({
    type: BOOKING_CANCEL_FAILURE,
    message,
});

export const cancelBooking = (data: BookingCancelData) => {
    return (dispatch: any) => {
        dispatch(cancelBookingInit());
        axios({
            method: 'POST',
            url: `/booking/cancel`,
            data: data,
        }).then((res: { data: ApiResponse }) => {
            const { success } = res.data;
            if (success) {
                dispatch(cancelBookingSuccess());
            } else {
                const errorMessage = res.data.error || 'Unknown error';
                dispatch(cancelBookingFailure(errorMessage));
            }
        }).catch((err: any) => {
            console.error('Cancel booking error:', err);
            dispatch(cancelBookingFailure('Internal error'));
        });
    };
};

export default {
    checkInOutSelect,
    processToCheckout,
    submitCheckout,
    checkoutExit,
    cancelBooking,
};