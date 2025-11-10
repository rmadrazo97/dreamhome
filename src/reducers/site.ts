import { 
    GET_SITE_DATAS_SUCCESS,
    GET_LISTINGS_SUCCESS,
} from '../actions/actionTypes';

const initialState = {
    explore: [],
    cats: [],
    locs: [],
    feas: [],
    tags: [],

    layout: {},
    languages: [],
    currencies: [],
    base_currency: {},

    terms_page: '',
    policy_page: '',
    help_page: '',
    about_page: '',
    listings: [],
    
};

const site = (state = initialState, action: any) => {
    switch (action.type) {
        case GET_SITE_DATAS_SUCCESS: 
            return action.payload
        case GET_LISTINGS_SUCCESS:
            return { ...state, listings: action.items }
        default:
            return state;
    }
};

export default site;