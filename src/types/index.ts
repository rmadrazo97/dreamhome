import React, { useState, useEffect, useCallback } from 'react';
// Core React Native types
import { ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { NavigationProp, RouteProp } from '@react-navigation/native';

// Theme and Colors
export interface ThemeColors {
  appColor: string;
  appBg: string;
  secondBg: string;
  backBtn: string;
  replyBg: string;
  errorColor: string;
  redCBg: string;
  purpCBg: string;
  blueCBg: string;
  yellowCBg: string;
  greenCBg: string;
  orangeCBg: string;
  shadowCl: string;
  regularText: string;
  mediumText: string;
  boldText: string;
  heavyText: string;
  hText: string;
  tText: string;
  taxTitle: string;
  taxCount: string;
  addressText: string;
  pText: string;
  searchText: string;
  searchBg: string;
  avatarIcon: string;
  separator: string;
  searchIconBg: string;
  fieldLbl: string;
  inputFocus: string;
  pastDay: string;
  unavailableDay: string;
  lMoreText: string;
  buttonPrimaryBg: string;
  headerNavStyle: ViewStyle;
  headerTitleStyle: TextStyle;
  tabBarColors: {
    activeTintColor: string;
    inactiveTintColor: string;
    style: ViewStyle;
  };
  modalBg: string;
  modalInner: string;
}

// User types
export interface User {
  id: number;
  authToken: string;
  display_name: string;
  avatar?: string;
  role_name: string;
  isLoggedIn: boolean;
}

// Site data types
export interface SiteData {
  terms_page: string;
  policy_page: string;
  help_page: string;
  about_page: string;
  [key: string]: any;
}

// Listing types
export interface Listing {
  id: number;
  ID?: number; // For API compatibility
  title: string;
  address: string;
  price?: string;
  rating?: number;
  thumbnail?: string;
  images?: string[];
  distance?: string;
  adults?: number;
  children?: number;
  quantities?: number;
  features?: string[];
  categories?: Category[];
  location?: Location;
  host?: Host;
  reviews?: Review[];
  faqs?: FAQ[];
  availability?: Availability;
  rooms?: Room[];
  slots?: Slot[];
  services?: Service[];
  // Additional API fields
  ltype_id?: number;
  latitude?: number;
  longitude?: number;
  url?: string;
  content?: string;
  cats?: Category[];
}

export interface Category {
  id: number;
  name: string;
  title?: string; // For backward compatibility
  color: string;
  icon: string;
  count?: number;
  thumbnail?: string;
}

export interface Location {
  id: number;
  name: string;
  title?: string; // For backward compatibility
  lat: number;
  lng: number;
  count?: number;
  thumbnail?: string;
}

export interface Host {
  id: number;
  name: string;
  avatar?: string;
  rating: number;
  response_time: string;
  member_since: string;
}

export interface Review {
  id: number;
  user_name: string;
  user_avatar?: string;
  rating: number;
  comment: string;
  date: string;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
}

export interface Availability {
  start_date: string;
  end_date: string;
  available_dates: string[];
  unavailable_dates: string[];
}

export interface Room {
  id: number;
  title: string;
  adults: number;
  children: number;
  price: string;
  quantities: number;
  images?: string[];
}

export interface Slot {
  _id: string;
  time: string;
  price: string;
  available: boolean;
  quantity: number;
}

export interface Service {
  id: number;
  name: string;
  price: string;
  description: string;
}

// Booking types
export interface Booking {
  id: number;
  listing_id: number;
  user_id: number;
  check_in: string;
  check_out: string;
  guests: number;
  total_price: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  rooms?: Room[];
  slots?: Slot[];
  services?: Service[];
}

// Filter types
export interface FilterState {
  cats: number[];
  locs: number[];
  feas: string[];
  tags: string[];
  prices: [number, number];
  nearby: 'on' | 'off';
  address_lat: string;
  address_lng: string;
  distance: number;
  orderby: 'date' | 'price' | 'rating' | 'distance';
  layout: 'list' | 'grid';
  status: string;
}

// Navigation types
export type RootStackParamList = {
  Home: undefined;
  Near: undefined;
  Explore: undefined;
  Bookings: undefined;
  Bookmarks: undefined;
  Profile: undefined;
  SignIn: undefined;
  Register: undefined;
  ForgetPwd: undefined;
  Listing: { id: number; title: string };
  Search: { query?: string };
  Filter: undefined;
  Map: undefined;
  Availability: { listingId: number };
  Booking: { listingId: number };
  Checkout: { bookingData: any };
  Comments: { listingId: number };
  Claim: { listingId: number };
  Report: { listingId: number };
  Reply: { commentId: number };
  EditProfile: undefined;
  Notifications: undefined;
  Language: undefined;
  Currency: undefined;
  Chat: undefined;
  Archive: { categoryId?: number; locationId?: number };
  Categories: undefined;
  Locations: undefined;
};

export type NavigationProp = NavigationProp<RootStackParamList, keyof RootStackParamList>;
export type RouteProp<T extends keyof RootStackParamList> = RouteProp<RootStackParamList, T>;

// Component prop types
export interface BaseComponentProps {
  style?: ViewStyle | TextStyle | ImageStyle;
  children?: React.ReactNode;
}

export interface ThemedComponentProps extends BaseComponentProps {
  apColors: ThemeColors;
  apTheme?: 'light' | 'dark';
}

export interface NavigationComponentProps extends ThemedComponentProps {
  navigation: NavigationProp;
  route: RouteProp<any>;
}

// Redux types
export interface AppState {
  app: {
    language: string;
    currency: string;
  };
  user: User;
  site: SiteData;
  listings: {
    items: Listing[];
    pages: {
      current: number;
      total: number;
    };
    loading: boolean;
  };
  filter: FilterState;
  booking: {
    selectedRooms: Room[];
    selectedSlots: Slot[];
    selectedServices: Service[];
    totalPrice: string;
  };
  chat: {
    contacts: Contact[];
    messages: Message[];
  };
  loading: boolean;
}

export interface Contact {
  id: number;
  name: string;
  avatar?: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

export interface Message {
  id: number;
  contact_id: number;
  message: string;
  timestamp: string;
  is_sent: boolean;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pages: {
    current: number;
    total: number;
    per_page: number;
  };
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
}

export interface EditProfileForm {
  name: string;
  email: string;
  phone?: string;
  bio?: string;
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Event types
export interface TouchEvent {
  nativeEvent: {
    locationX: number;
    locationY: number;
  };
}

export interface TextInputEvent {
  nativeEvent: {
    text: string;
  };
}

// Style types
export interface StyleSheetType {
  [key: string]: ViewStyle | TextStyle | ImageStyle;
}

// Hook types
export interface UseStateReturn<T> {
  state: T;
  setState: React.Dispatch<React.SetStateAction<T>>;
}

export interface UseEffectReturn {
  cleanup?: () => void;
}

// Component state types
export interface HomeScreenState {
  data: any[];
  showSearch: boolean;
  stext: string;
  results: any[];
  showClear: boolean;
  scrollDir: string;
}

export interface ListingScreenState {
  listing: Listing | null;
  loading: boolean;
  error: string | null;
}

export interface BookingScreenState {
  selectedRooms: Room[];
  selectedSlots: Slot[];
  selectedServices: Service[];
  totalPrice: string;
  loading: boolean;
}

export interface FilterScreenState {
  filters: FilterState;
  loading: boolean;
}

export interface ProfileScreenState {
  data: any[];
  loading: boolean;
}

export interface ChatScreenState {
  contacts: Contact[];
  messages: Message[];
  loading: boolean;
  refreshing: boolean;
}

// Action types
export interface Action<T = any> {
  type: string;
  payload?: T;
}

export interface AsyncAction<T = any> extends Action<T> {
  meta?: {
    requestId: string;
    timestamp: number;
  };
}

// Redux action creators
export interface ActionCreators {
  [key: string]: (...args: any[]) => Action | AsyncAction;
}

// Store types
export interface Store {
  dispatch: (action: Action) => void;
  getState: () => AppState;
  subscribe: (listener: () => void) => () => void;
}

// Navigation options
export interface NavigationOptions {
  headerShown?: boolean;
  title?: string;
  headerStyle?: ViewStyle;
  headerTitleStyle?: TextStyle;
  headerLeft?: () => React.ReactNode;
  headerRight?: () => React.ReactNode;
  tabBarIcon?: (props: { color: string; size: number; focused: boolean }) => React.ReactNode;
  tabBarLabel?: (props: { color: string; focused: boolean }) => React.ReactNode;
}

// Screen component types
export interface ScreenComponent<T = any> extends React.FC<NavigationComponentProps> {
  navigationOptions?: NavigationOptions | ((props: { navigation: NavigationProp; route: RouteProp<any> }) => NavigationOptions);
}

// Custom hook types
export interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export interface UseFormReturn<T> {
  values: T;
  errors: Partial<T>;
  setValue: (key: keyof T, value: any) => void;
  setError: (key: keyof T, error: string) => void;
  handleSubmit: (onSubmit: (values: T) => void) => (e?: any) => void;
  reset: () => void;
}

// Animation types
export interface AnimationConfig {
  duration: number;
  delay?: number;
  easing?: string;
}

export interface AnimatedValue {
  value: number;
  addListener: (callback: (value: { value: number }) => void) => string;
  removeListener: (id: string) => void;
  removeAllListeners: () => void;
  setValue: (value: number) => void;
  setOffset: (offset: number) => void;
  flattenOffset: () => void;
  extractOffset: () => void;
  stopAnimation: (callback?: (value: number) => void) => void;
  resetAnimation: (callback?: (value: number) => void) => void;
  interpolate: (config: any) => any;
}

// Gesture types
export interface GestureState {
  stateID: number;
  moveX: number;
  moveY: number;
  x0: number;
  y0: number;
  dx: number;
  dy: number;
  vx: number;
  vy: number;
  numberActiveTouches: number;
}

// Image types
export interface ImageSource {
  uri: string;
  width?: number;
  height?: number;
  headers?: { [key: string]: string };
}

export interface ImageStyle extends ViewStyle {
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
  tintColor?: string;
  overlayColor?: string;
}

// Text types
export interface TextStyle extends ViewStyle {
  color?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  fontStyle?: 'normal' | 'italic';
  textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  textDecorationLine?: 'none' | 'underline' | 'line-through' | 'underline line-through';
  textDecorationStyle?: 'solid' | 'double' | 'dotted' | 'dashed';
  textDecorationColor?: string;
  textShadowColor?: string;
  textShadowOffset?: { width: number; height: number };
  textShadowRadius?: number;
  letterSpacing?: number;
  lineHeight?: number;
  textAlignVertical?: 'auto' | 'top' | 'bottom' | 'center';
  includeFontPadding?: boolean;
  textBreakStrategy?: 'highQuality' | 'balanced' | 'simple';
}

// View types
export interface ViewStyle extends ViewStyle {
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  borderTopLeftRadius?: number;
  borderTopRightRadius?: number;
  borderBottomLeftRadius?: number;
  borderBottomRightRadius?: number;
  borderStyle?: 'solid' | 'dotted' | 'dashed';
  opacity?: number;
  elevation?: number;
  shadowColor?: string;
  shadowOffset?: { width: number; height: number };
  shadowOpacity?: number;
  shadowRadius?: number;
  transform?: any[];
  overflow?: 'visible' | 'hidden' | 'scroll';
  backfaceVisibility?: 'visible' | 'hidden';
  borderCurve?: 'circular' | 'continuous';
  borderEndColor?: string;
  borderEndWidth?: number;
  borderStartColor?: string;
  borderStartWidth?: number;
  borderTopColor?: string;
  borderTopWidth?: number;
  borderRightColor?: string;
  borderRightWidth?: number;
  borderBottomColor?: string;
  borderBottomWidth?: number;
  borderLeftColor?: string;
  borderLeftWidth?: number;
  borderTopLeftRadius?: number;
  borderTopRightRadius?: number;
  borderBottomLeftRadius?: number;
  borderBottomRightRadius?: number;
  borderTopStartRadius?: number;
  borderTopEndRadius?: number;
  borderBottomStartRadius?: number;
  borderBottomEndRadius?: number;
}

// Ticket type
export interface Ticket {
  id: string;
  title: string;
  description?: string;
  price: number;
  image?: string;
  max_quantity?: number;
  quantity?: number;
}


export default index;