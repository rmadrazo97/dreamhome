import React, { useState, useEffect, useCallback } from 'react';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from './index';

// Navigation types
export type NavigationProp = NavigationProp<RootStackParamList>;
export type RouteProp<T extends keyof RootStackParamList> = RouteProp<RootStackParamList, T>;

// Screen component props
export interface ScreenProps<T extends keyof RootStackParamList = keyof RootStackParamList> {
  navigation: NavigationProp;
  route: RouteProp<T>;
}

// Tab navigation types
export interface TabScreenProps<T extends keyof RootStackParamList = keyof RootStackParamList> extends ScreenProps<T> {
  // Additional tab-specific props can be added here
}

// Stack navigation types
export interface StackScreenProps<T extends keyof RootStackParamList = keyof RootStackParamList> extends ScreenProps<T> {
  // Additional stack-specific props can be added here
}

// Navigation options
export interface NavigationOptions {
  headerShown?: boolean;
  title?: string;
  headerStyle?: any;
  headerTitleStyle?: any;
  headerLeft?: () => React.ReactNode;
  headerRight?: () => React.ReactNode;
  tabBarIcon?: (props: { color: string; size: number; focused: boolean }) => React.ReactNode;
  tabBarLabel?: (props: { color: string; focused: boolean }) => React.ReactNode;
}

// Screen component type
export interface ScreenComponent<T = any> extends React.FC<ScreenProps> {
  navigationOptions?: NavigationOptions | ((props: ScreenProps) => NavigationOptions);
}
