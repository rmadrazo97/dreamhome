import { ThemeColors } from '../types';
import { themedColors } from '../constants/Colors';

// Initial state for apColors
const initialState: ThemeColors = themedColors.default as ThemeColors;

// Action types
const SET_AP_COLORS = 'SET_AP_COLORS';
const RESET_AP_COLORS = 'RESET_AP_COLORS';

// Action creators
export const setApColors = (colors: ThemeColors) => ({
    type: SET_AP_COLORS,
    payload: colors,
});

export const resetApColors = () => ({
    type: RESET_AP_COLORS,
});

// Reducer
const apColors = (state: ThemeColors = initialState, action: any): ThemeColors => {
    switch (action.type) {
        case SET_AP_COLORS:
            return action.payload;
        case RESET_AP_COLORS:
            return initialState;
        default:
            return state;
    }
};

export default apColors;
