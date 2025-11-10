import { TOGGLE_THEME } from './actionTypes';

// Types
interface ThemeAction {
    type: typeof TOGGLE_THEME;
    payload: string;
}

// Action Creator
export const toggleTheme = (theme: string): ThemeAction => ({
    type: TOGGLE_THEME,
    payload: theme,
});

export default {
    toggleTheme,
};