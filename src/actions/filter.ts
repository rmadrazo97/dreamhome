import { APPLY_FILTERS } from './actionTypes';

// Types
interface FilterData {
    [key: string]: any;
}

interface FilterAction {
    type: typeof APPLY_FILTERS;
    payload: FilterData;
}

// Action Creator
export const applyFilters = (data: FilterData) => {
    return (dispatch: any) => {
        dispatch({
            type: APPLY_FILTERS,
            payload: data,
        });
    };
};

export default {
    applyFilters,
};