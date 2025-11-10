import { 
    APP_LANGUAGE_CHANGE_SUCCESS,
    APP_CURRENCY_CHANGE_SUCCESS,
} from '../actions/actionTypes';

const initialState = {
    language: 'en',
    currency: 'USD',
};

const app = (state = initialState, action: any) => {
    switch (action.type) {
        case APP_LANGUAGE_CHANGE_SUCCESS: 
            return {...state, language: action.payload }
            
        case APP_CURRENCY_CHANGE_SUCCESS: 
            return {...state, currency: action.payload }
            
        default:
            return state;
    }
};

export default app;