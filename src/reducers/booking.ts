import { 
    CKINOUT_SELECTED, 
    PROCESS_TO_CHECKOUT, 
    CKINOUT_SUBMITTING, 
    CHECKOUT_SUBMIT_SUCCESS, 
    CHECKOUT_SUBMIT_FAILURE, 
    CHECKOUT_EXIT ,

    BOOKING_CANCEL,
    BOOKING_CANCEL_SUCCESS,
    BOOKING_CANCEL_FAILURE,

    BOOKING_STATUS,
} from '../actions/actionTypes';

const initialState = {
    dateOne: {},
    dateTwo: {},
    datas: {},
    submitting: false,
    submitted: false,
    isSuccess: false,
    submittedData: {},
    message: '',
    url: '',
    booking_id: 0,
    bk_status: '',
};

const booking = (state = initialState, action: any) => {
    switch (action.type) {
        case CKINOUT_SELECTED: 
            
            return {...state, ...action.payload, submitting: false, submitted: false, isSuccess: false, submittedData: {}, message: '' }; // 
            // const {dateOne,dateTwo} = action.payload
            // return {...state, dateOne, dateTwo};
        case PROCESS_TO_CHECKOUT: 
            
            return { ...state, datas: action.payload, submitted: false, submitting: false, isSuccess: false, message: '', url: '', booking_id: 0, bk_status: '' };
        case CKINOUT_SUBMITTING: 
            return { ...state, submitting: action.payload, submitted: false, isSuccess: false, message: '', url: '', booking_id: 0, bk_status: '' };
        case CHECKOUT_SUBMIT_SUCCESS: 
            let url = '',booking_id = 0, scform = false;
            if( null != action.payload.url ) url = action.payload.url;
            if( null != action.payload.booking_id ) booking_id = action.payload.booking_id;
            if( null != action.payload.scform ) scform = action.payload.scform;

            return { ...state, submittedData: action.payload, submitted: true, submitting: false, isSuccess: true, message: '', url, booking_id, bk_status: '', scform };
        case CHECKOUT_SUBMIT_FAILURE: 
            return { ...state, submittedData: action.payload, submitted: true, submitting: false, isSuccess: false, message: '', url: '', booking_id: 0, bk_status: '' };
        case CHECKOUT_EXIT:
            return { ...state, submitting: false, submitted: false, isSuccess: false, submittedData: {}, message: '', url: '', booking_id: 0, bk_status: '' };
        case BOOKING_CANCEL:
            return { ...state, submitting: true, submitted: false, isSuccess: false, submittedData: {}, message: '' };
        case BOOKING_CANCEL_SUCCESS:
            return { ...state, submitting: false, submitted: true, isSuccess: true, submittedData: {}, message: '' };
        case BOOKING_CANCEL_FAILURE:
            return { ...state, submitting: false, submitted: true, isSuccess: false, submittedData: {}, message: action.message };
        case BOOKING_STATUS:
            return { ...state, bk_status: action.status, submitting: false, submitted: false, isSuccess: false, submittedData: {}, message: '', url: '' };
        
        default:
            return state;
    }
};

export default booking;