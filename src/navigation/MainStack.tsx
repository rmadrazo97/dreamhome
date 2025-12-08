import React, { useLayoutEffect } from 'react';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';

import HomeStack from './HomeStack';
import FilterScreen from '../screens/FilterScreen';
import SignInScreen from '../screens/SignInScreen';
import ForgetPwdScreen from '../screens/ForgetPwdScreen';
import RegisterScreen from '../screens/RegisterScreen';
import { themedColors } from '../constants/Colors';

const Stack = createStackNavigator();

interface MainStackProps {
    navigation: any;
    route: any;
}

const MainStack: React.FC<MainStackProps> = ({ navigation, route }) => {
    const apColors = useSelector((state: any) => state.apColors) || themedColors.default;
    
    // apColors should always be available from reducer's initialState
    if (!apColors) {
        return null;
    }

    useLayoutEffect(() => {
        const routeName = getFocusedRouteNameFromRoute(route) ?? 'HomeStack';
        let tabBarVisible = routeName == 'HomeStack';
        const state = navigation.getState();
        
        if (tabBarVisible && null != state) {
            const { routes, index } = state;
            const childRoute = routes[index];
            
            if (null != childRoute.state && null != childRoute.state.index) {
                const child2 = childRoute.state.routes[childRoute.state.index];
                
                if (null != child2.state.index && null != child2.state.routes) {
                    if ('Home' != child2.state.routes[child2.state.index]['name']) {
                        tabBarVisible = false;
                    }
                }
            }
        }
        navigation.setOptions({ tabBarVisible });
    }, [navigation, route]);

    return (
        <Stack.Navigator
            initialRouteName="HomeStack"
            screenOptions={{
                gestureEnabled: false,
                presentation: 'modal',
                headerShown: false,
            }}
        >
            <Stack.Screen
                name="HomeStack"
                component={HomeStack}
            />
            
            <Stack.Screen name="Filter">
                {props => <FilterScreen {...props} />}
            </Stack.Screen>
            
            <Stack.Screen name="SignIn">
                {props => <SignInScreen {...props} />}
            </Stack.Screen>
            
            <Stack.Screen name="ForgetPwd" options={{ headerShown: false, tabBarVisible: false }}>
                {props => <ForgetPwdScreen {...props} />}
            </Stack.Screen>
            
            <Stack.Screen name="Register">
                {props => <RegisterScreen {...props} />}
            </Stack.Screen>
        </Stack.Navigator>
    );
};

export default MainStack;
