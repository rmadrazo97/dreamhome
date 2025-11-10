import React, { useState, useEffect, useCallback } from 'react';
import { Action, Store } from './index';

// Redux action types
export const APP_LANGUAGE_CHANGE_SUCCESS = 'APP_LANGUAGE_CHANGE_SUCCESS';
export const APP_CURRENCY_CHANGE_SUCCESS = 'APP_CURRENCY_CHANGE_SUCCESS';
export const GET_SITE_DATAS = 'GET_SITE_DATAS';
export const GET_SITE_DATAS_SUCCESS = 'GET_SITE_DATAS_SUCCESS';
export const GET_SITE_DATAS_FAILURE = 'GET_SITE_DATAS_FAILURE';
export const GET_CURRENCY_ATTRS = 'GET_CURRENCY_ATTRS';
export const GET_CURRENCY_ATTRS_SUCCESS = 'GET_CURRENCY_ATTRS_SUCCESS';
export const GET_STRINGS_SUCCESS = 'GET_STRINGS_SUCCESS';
export const GET_USER_SUCCESS = 'GET_USER_SUCCESS';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const EDIT_PROFILE_CLOSE_POPUP = 'EDIT_PROFILE_CLOSE_POPUP';
export const EDIT_PROFILE_SUBMITTING = 'EDIT_PROFILE_SUBMITTING';
export const EDIT_PROFILE_SUCCESS = 'EDIT_PROFILE_SUCCESS';
export const EDIT_PROFILE_FAILURE = 'EDIT_PROFILE_FAILURE';
export const GET_NOTIFICATIONS = 'GET_NOTIFICATIONS';
export const GET_NOTIFICATIONS_SUCCESS = 'GET_NOTIFICATIONS_SUCCESS';
export const GET_NOTIFICATIONS_FAILURE = 'GET_NOTIFICATIONS_FAILURE';
export const REFRESH_NOTIFICATIONS = 'REFRESH_NOTIFICATIONS';
export const LMORE_NOTIFICATIONS = 'LMORE_NOTIFICATIONS';
export const LMORE_NOTIFICATIONS_SUCCESS = 'LMORE_NOTIFICATIONS_SUCCESS';
export const LMORE_NOTIFICATIONS_FAILURE = 'LMORE_NOTIFICATIONS_FAILURE';
export const GET_USER_BOOKINGS = 'GET_USER_BOOKINGS';
export const GET_USER_BOOKINGS_SUCCESS = 'GET_USER_BOOKINGS_SUCCESS';
export const GET_USER_BOOKINGS_FAILURE = 'GET_USER_BOOKINGS_FAILURE';
export const LMORE_USER_BOOKINGS = 'LMORE_USER_BOOKINGS';
export const LMORE_USER_BOOKINGS_SUCCESS = 'LMORE_USER_BOOKINGS_SUCCESS';
export const LMORE_USER_BOOKINGS_FAILURE = 'LMORE_USER_BOOKINGS_FAILURE';
export const GET_LISTING = 'GET_LISTING';
export const GET_LISTING_SUCCESS = 'GET_LISTING_SUCCESS';
export const GET_LISTING_ERROR = 'GET_LISTING_ERROR';
export const REVIEW_SUBMIT = 'REVIEW_SUBMIT';
export const REVIEW_SUBMIT_SUCCESS = 'REVIEW_SUBMIT_SUCCESS';
export const REVIEW_SUBMIT_FAILURE = 'REVIEW_SUBMIT_FAILURE';
export const REVIEW_SUBMIT_CLOSE_POPUP = 'REVIEW_SUBMIT_CLOSE_POPUP';
export const CLAIM_SUBMIT = 'CLAIM_SUBMIT';
export const CLAIM_SUBMIT_SUCCESS = 'CLAIM_SUBMIT_SUCCESS';
export const BOOKMARK_LISTING_SUCCESS = 'BOOKMARK_LISTING_SUCCESS';
export const CKINOUT_SELECTED = 'CKINOUT_SELECTED';
export const PROCESS_TO_CHECKOUT = 'PROCESS_TO_CHECKOUT';
export const CKINOUT_SUBMITTING = 'CKINOUT_SUBMITTING';
export const CHECKOUT_SUBMIT_SUCCESS = 'CHECKOUT_SUBMIT_SUCCESS';
export const CHECKOUT_SUBMIT_FAILURE = 'CHECKOUT_SUBMIT_FAILURE';
export const CHECKOUT_EXIT = 'CHECKOUT_EXIT';
export const BOOKING_STATUS = 'BOOKING_STATUS';
export const BOOKING_CANCEL = 'BOOKING_CANCEL';
export const BOOKING_CANCEL_SUCCESS = 'BOOKING_CANCEL_SUCCESS';
export const BOOKING_CANCEL_FAILURE = 'BOOKING_CANCEL_FAILURE';
export const FILTER_BY_CAT = 'FILTER_BY_CAT';
export const FILTER_BY_LOC = 'FILTER_BY_LOC';
export const FILTER_BY_TAG = 'FILTER_BY_TAG';
export const FILTER_BY_FEA = 'FILTER_BY_FEA';
export const FILTER_NEAR_BY = 'FILTER_NEAR_BY';
export const FILTER_RESET = 'FILTER_RESET';
export const APPLY_FILTERS = 'APPLY_FILTERS';
export const GET_LISTINGS_START = 'GET_LISTINGS_START';
export const GET_LISTINGS_SUCCESS = 'GET_LISTINGS_SUCCESS';
export const GET_LISTINGS_FAILURE = 'GET_LISTINGS_FAILURE';
export const LMORE_LISTINGS_START = 'LMORE_LISTINGS_START';
export const LMORE_LISTINGS_SUCCESS = 'LMORE_LISTINGS_SUCCESS';
export const LMORE_LISTINGS_FAILURE = 'LMORE_LISTINGS_FAILURE';
export const GET_CONTACTS = 'GET_CONTACTS';
export const GET_CONTACTS_SUCCESS = 'GET_CONTACTS_SUCCESS';
export const GET_CONTACTS_FAILURE = 'GET_CONTACTS_FAILURE';
export const GET_REPLIES = 'GET_REPLIES';
export const GET_REPLIES_SUCCESS = 'GET_REPLIES_SUCCESS';
export const GET_REPLIES_FAILURE = 'GET_REPLIES_FAILURE';
export const GET_TOP_REPLIES = 'GET_TOP_REPLIES';
export const GET_TOP_REPLIES_SUCCESS = 'GET_TOP_REPLIES_SUCCESS';
export const POST_REPLY_SUCCESS = 'POST_REPLY_SUCCESS';
export const CLEAR_REPLIES = 'CLEAR_REPLIES';

// Action type union
export type ActionType = 
  | typeof APP_LANGUAGE_CHANGE_SUCCESS
  | typeof APP_CURRENCY_CHANGE_SUCCESS
  | typeof GET_SITE_DATAS
  | typeof GET_SITE_DATAS_SUCCESS
  | typeof GET_SITE_DATAS_FAILURE
  | typeof GET_CURRENCY_ATTRS
  | typeof GET_CURRENCY_ATTRS_SUCCESS
  | typeof GET_STRINGS_SUCCESS
  | typeof GET_USER_SUCCESS
  | typeof LOGOUT_SUCCESS
  | typeof EDIT_PROFILE_CLOSE_POPUP
  | typeof EDIT_PROFILE_SUBMITTING
  | typeof EDIT_PROFILE_SUCCESS
  | typeof EDIT_PROFILE_FAILURE
  | typeof GET_NOTIFICATIONS
  | typeof GET_NOTIFICATIONS_SUCCESS
  | typeof GET_NOTIFICATIONS_FAILURE
  | typeof REFRESH_NOTIFICATIONS
  | typeof LMORE_NOTIFICATIONS
  | typeof LMORE_NOTIFICATIONS_SUCCESS
  | typeof LMORE_NOTIFICATIONS_FAILURE
  | typeof GET_USER_BOOKINGS
  | typeof GET_USER_BOOKINGS_SUCCESS
  | typeof GET_USER_BOOKINGS_FAILURE
  | typeof LMORE_USER_BOOKINGS
  | typeof LMORE_USER_BOOKINGS_SUCCESS
  | typeof LMORE_USER_BOOKINGS_FAILURE
  | typeof GET_LISTING
  | typeof GET_LISTING_SUCCESS
  | typeof GET_LISTING_ERROR
  | typeof REVIEW_SUBMIT
  | typeof REVIEW_SUBMIT_SUCCESS
  | typeof REVIEW_SUBMIT_FAILURE
  | typeof REVIEW_SUBMIT_CLOSE_POPUP
  | typeof CLAIM_SUBMIT
  | typeof CLAIM_SUBMIT_SUCCESS
  | typeof BOOKMARK_LISTING_SUCCESS
  | typeof CKINOUT_SELECTED
  | typeof PROCESS_TO_CHECKOUT
  | typeof CKINOUT_SUBMITTING
  | typeof CHECKOUT_SUBMIT_SUCCESS
  | typeof CHECKOUT_SUBMIT_FAILURE
  | typeof CHECKOUT_EXIT
  | typeof BOOKING_STATUS
  | typeof BOOKING_CANCEL
  | typeof BOOKING_CANCEL_SUCCESS
  | typeof BOOKING_CANCEL_FAILURE
  | typeof FILTER_BY_CAT
  | typeof FILTER_BY_LOC
  | typeof FILTER_BY_TAG
  | typeof FILTER_BY_FEA
  | typeof FILTER_NEAR_BY
  | typeof FILTER_RESET
  | typeof APPLY_FILTERS
  | typeof GET_LISTINGS_START
  | typeof GET_LISTINGS_SUCCESS
  | typeof GET_LISTINGS_FAILURE
  | typeof LMORE_LISTINGS_START
  | typeof LMORE_LISTINGS_SUCCESS
  | typeof LMORE_LISTINGS_FAILURE
  | typeof GET_CONTACTS
  | typeof GET_CONTACTS_SUCCESS
  | typeof GET_CONTACTS_FAILURE
  | typeof GET_REPLIES
  | typeof GET_REPLIES_SUCCESS
  | typeof GET_REPLIES_FAILURE
  | typeof GET_TOP_REPLIES
  | typeof GET_TOP_REPLIES_SUCCESS
  | typeof POST_REPLY_SUCCESS
  | typeof CLEAR_REPLIES;

// Action creators
export interface ActionCreators {
  changeAppLanguage: (code: string) => Action<string>;
  changeAppCurrency: (code: string) => Action<string>;
  getSiteDatas: () => Action;
  getSiteDatasSuccess: (data: any) => Action<any>;
  getSiteDatasFailure: () => Action;
  getCurrencyAttrs: () => Action;
  getCurrencyAttrsSuccess: (data: any) => Action<any>;
  getStringsSuccess: (data: any) => Action<any>;
  getUserSuccess: (user: any) => Action<any>;
  logoutSuccess: () => Action;
  editProfileClosePopup: () => Action;
  editProfileSubmitting: () => Action;
  editProfileSuccess: (data: any) => Action<any>;
  editProfileFailure: (error: string) => Action<string>;
  getNotifications: () => Action;
  getNotificationsSuccess: (data: any) => Action<any>;
  getNotificationsFailure: (error: string) => Action<string>;
  refreshNotifications: () => Action;
  lmoreNotifications: () => Action;
  lmoreNotificationsSuccess: (data: any) => Action<any>;
  lmoreNotificationsFailure: (error: string) => Action<string>;
  getUserBookings: () => Action;
  getUserBookingsSuccess: (data: any) => Action<any>;
  getUserBookingsFailure: (error: string) => Action<string>;
  lmoreUserBookings: () => Action;
  lmoreUserBookingsSuccess: (data: any) => Action<any>;
  lmoreUserBookingsFailure: (error: string) => Action<string>;
  getListing: () => Action;
  getListingSuccess: (listing: any) => Action<any>;
  getListingError: (error: string) => Action<string>;
  reviewSubmit: () => Action;
  reviewSubmitSuccess: (data: any) => Action<any>;
  reviewSubmitFailure: (error: string) => Action<string>;
  reviewSubmitClosePopup: () => Action;
  claimSubmit: () => Action;
  claimSubmitSuccess: (data: any) => Action<any>;
  bookmarkListingSuccess: (listingId: number) => Action<number>;
  ckinoutSelected: (data: any) => Action<any>;
  processToCheckout: (data: any) => Action<any>;
  ckinoutSubmitting: () => Action;
  checkoutSubmitSuccess: (data: any) => Action<any>;
  checkoutSubmitFailure: (error: string) => Action<string>;
  checkoutExit: () => Action;
  bookingStatus: (status: string) => Action<string>;
  bookingCancel: () => Action;
  bookingCancelSuccess: () => Action;
  bookingCancelFailure: (error: string) => Action<string>;
  filterByCat: (id: number) => Action<number>;
  filterByLoc: (id: number) => Action<number>;
  filterByTag: (id: string) => Action<string>;
  filterByFea: (id: string) => Action<string>;
  filterNearBy: (lat: number, lng: number) => Action<{lat: number; lng: number}>;
  filterReset: () => Action;
  applyFilters: () => Action;
  getListingsStart: () => Action;
  getListingsSuccess: (data: any) => Action<any>;
  getListingsFailure: (error: string) => Action<string>;
  lmoreListingsStart: () => Action;
  lmoreListingsSuccess: (data: any) => Action<any>;
  lmoreListingsFailure: (error: string) => Action<string>;
  getContacts: () => Action;
  getContactsSuccess: (data: any) => Action<any>;
  getContactsFailure: (error: string) => Action<string>;
  getReplies: () => Action;
  getRepliesSuccess: (data: any) => Action<any>;
  getRepliesFailure: (error: string) => Action<string>;
  getTopReplies: () => Action;
  getTopRepliesSuccess: (data: any) => Action<any>;
  postReplySuccess: (data: any) => Action<any>;
  clearReplies: () => Action;
}

// Thunk action type
export type ThunkAction<R, S, E, A extends Action> = (
  dispatch: (action: A) => void,
  getState: () => S,
  extraArgument: E
) => R;

// Async action creator type
export type AsyncActionCreator<T = any> = (
  ...args: any[]
) => ThunkAction<Promise<T>, any, any, Action>;

// Redux store type
export interface ReduxStore extends Store {
  dispatch: <T extends Action>(action: T) => T;
  getState: () => any;
  subscribe: (listener: () => void) => () => void;
  replaceReducer: (nextReducer: any) => void;
}

// Connected component props
export interface ConnectedComponentProps {
  dispatch: (action: Action) => void;
}

// Map state to props function type
export type MapStateToProps<TStateProps, TOwnProps = {}, State = any> = (
  state: State,
  ownProps: TOwnProps
) => TStateProps;

// Map dispatch to props function type
export type MapDispatchToProps<TDispatchProps, TOwnProps = {}> = 
  | TDispatchProps
  | ((dispatch: (action: Action) => void, ownProps: TOwnProps) => TDispatchProps);

// Connect function type
export interface ConnectFunction {
  <TStateProps = {}, TDispatchProps = {}, TOwnProps = {}>(
    mapStateToProps?: MapStateToProps<TStateProps, TOwnProps>,
    mapDispatchToProps?: MapDispatchToProps<TDispatchProps, TOwnProps>
  ): <TComponent extends React.ComponentType<TStateProps & TDispatchProps & TOwnProps>>(
    component: TComponent
  ) => React.ComponentType<TOwnProps>;
}


export default redux;