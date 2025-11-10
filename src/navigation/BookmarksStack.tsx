import React, { useLayoutEffect } from 'react';
import { useColorScheme } from 'react-native';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from "react-redux";

import BookmarksScreen from '../screens/BookmarksScreen';
import SignInScreen from '../screens/SignInScreen';
import ForgetPwdScreen from '../screens/ForgetPwdScreen';
import RegisterScreen from '../screens/RegisterScreen';

import getThemedColors from '../helpers/Theme';
import { translate } from "../helpers/i18n";

const Stack = createStackNavigator();

interface BookmarksStackProps {
    navigation: any;
    route: any;
}

const BookmarksStack: React.FC<BookmarksStackProps> = ({ navigation, route }) => {
    const user = useSelector((state: any) => state.user);
    const { isLoggedIn } = user;
    const colors = getThemedColors(useColorScheme());

    useLayoutEffect(() => {
        const routeName = getFocusedRouteNameFromRoute(route) ?? (isLoggedIn ? 'Bookmarks' : 'SignIn');
        navigation.setOptions({ tabBarVisible: routeName == 'Bookmarks' });
    }, [navigation, route, isLoggedIn]);

    return (
        <Stack.Navigator
            initialRouteName={isLoggedIn ? 'Bookmarks' : 'SignIn'}
            screenOptions={({ navigation, route }) => ({
                gestureEnabled: false,
                headerShown: false,
                headerStyle: colors.headerNavStyle,
                headerTitleStyle: colors.headerTitleStyle,
                headerTitleAlign: 'center',
            })}
        >
            {isLoggedIn ? (
                <>
                    <Stack.Screen name="Bookmarks" options={{ title: translate('bm_screen') }}>
                        {props => <BookmarksScreen {...props} />}
                    </Stack.Screen>
                </>
            ) : (
                <>
                    <Stack.Screen 
                        name="SignIn" 
                        options={{ headerShown: false, tabBarVisible: false }} 
                        initialParams={{ loggedInRoute: 'Bookmarks' }}
                    >
                        {props => <SignInScreen {...props} apColors={colors} />}
                    </Stack.Screen>
                    
                    <Stack.Screen name="ForgetPwd" options={{ headerShown: false, tabBarVisible: false }}>
                        {props => <ForgetPwdScreen {...props} apColors={colors} />}
                    </Stack.Screen>
                    
                    <Stack.Screen name="Register" options={{ headerShown: false, tabBarVisible: false }}>
                        {props => <RegisterScreen {...props} apColors={colors} />}
                    </Stack.Screen>
                </>
            )}
        </Stack.Navigator>
    );
};

export default BookmarksStack;
