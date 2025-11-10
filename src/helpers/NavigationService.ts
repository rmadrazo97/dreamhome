import { createRef } from 'react';
import { NavigationContainerRef } from '@react-navigation/native';

// Types
interface NavigationServiceType {
    navigate: (name: string, params?: any) => void;
    setParams: (params: any) => void;
    setTopLevelNavigator: (navigatorRef: any) => void;
}

export const navigationRef = createRef<NavigationContainerRef<any>>();

export function navigate(name: string, params?: any): void {
    navigationRef.current?.navigate(name, params);
}

export function setParams(params: any): void {
    navigationRef.current?.setParams(params);
}

export function setTopLevelNavigator(navigatorRef: any): void {
    // Implementation for setting top level navigator if needed
}

const NavigationService: NavigationServiceType = {
    navigate,
    setTopLevelNavigator,
    setParams,
};

export default NavigationService;