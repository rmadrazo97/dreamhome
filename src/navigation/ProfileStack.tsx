import React, { useLayoutEffect } from 'react';
import { useColorScheme } from 'react-native';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from "react-redux";

import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/profile/Edit';
import NotificationsScreen from '../screens/profile/Notifications';
import CurrencyScreen from '../screens/profile/Currency';
import LanguageScreen from '../screens/profile/Language';
import ChatScreen from '../screens/ChatScreen';
import Reply from '../screens/ReplySingle';
import WebScreen from '../screens/profile/WebScreen';
import SignInScreen from '../screens/SignInScreen';
import ForgetPwdScreen from '../screens/ForgetPwdScreen';
import RegisterScreen from '../screens/RegisterScreen';

import getThemedColors from '../helpers/Theme';
import { translate } from "../helpers/i18n";
import BackButton from '../components/inners/BackButton';

const Stack = createStackNavigator();

interface ProfileStackProps {
    navigation: any;
    route: any;
}

const ProfileStack: React.FC<ProfileStackProps> = ({ navigation, route }) => {
    const user = useSelector((state: any) => state.user);
    const { isLoggedIn } = user;
    const colors = getThemedColors(useColorScheme());

    useLayoutEffect(() => {
        const routeName = getFocusedRouteNameFromRoute(route) ?? (isLoggedIn ? "Profile" : 'SignIn');
        navigation.setOptions({ tabBarVisible: routeName == 'Profile' });
    }, [navigation, route, isLoggedIn]);

    return (
        <Stack.Navigator
            initialRouteName={isLoggedIn ? "Profile" : 'SignIn'}
            screenOptions={({ navigation, route }) => ({
                gestureEnabled: false,
                headerShown: false,
                headerLeft: () => (
                    <BackButton 
                        color={colors.backBtn} 
                        onPress={navigation.goBack} 
                        style={{ marginLeft: 10 }} 
                    />
                ),
                headerStyle: colors.headerNavStyle,
                headerTitleStyle: colors.headerTitleStyle,
                headerTitleAlign: 'center',
            })}
        >
            {isLoggedIn ? (
                <>
                    <Stack.Screen name="Profile" options={{ headerShown: false }}>
                        {props => <ProfileScreen {...props} />}
                    </Stack.Screen>

                    <Stack.Screen name="EditProfile" options={{ title: translate('editprofile', 'title') }}>
                        {props => <EditProfileScreen {...props} />}
                    </Stack.Screen>

                    <Stack.Screen name="Notifications" options={{ title: translate('notifications', 'title') }}>
                        {props => <NotificationsScreen {...props} />}
                    </Stack.Screen>

                    <Stack.Screen name="Chat" options={{ headerShown: false }}>
                        {props => <ChatScreen {...props} />}
                    </Stack.Screen>

                    <Stack.Screen name="Reply" options={{ title: translate('reply_screen') }}>
                        {props => <Reply {...props} />}
                    </Stack.Screen>

                    <Stack.Screen name="Language" options={{ title: translate('language_screen') }}>
                        {props => <LanguageScreen {...props} />}
                    </Stack.Screen>

                    <Stack.Screen name="Currency" options={{ title: translate('currency_screen') }}>
                        {props => <CurrencyScreen {...props} />}
                    </Stack.Screen>

                    <Stack.Screen 
                        name="ProfileWeb" 
                        initialParams={{ title: 'Info', url: '' }} 
                        options={({ route }) => ({ title: route.params.title })}
                    >
                        {props => <WebScreen {...props} />}
                    </Stack.Screen>
                </>
            ) : (
                <>
                    <Stack.Screen 
                        name="SignIn" 
                        options={{ headerShown: false }} 
                        initialParams={{ loggedInRoute: 'Profile' }}
                    >
                        {props => <SignInScreen {...props} apColors={colors} />}
                    </Stack.Screen>
                    <Stack.Screen name="ForgetPwd" options={{ headerShown: false, tabBarVisible: false }}>
                        {props => <ForgetPwdScreen {...props} apColors={colors} />}
                    </Stack.Screen>
                    <Stack.Screen name="Register" options={{ headerShown: false }}>
                        {props => <RegisterScreen {...props} apColors={colors} />}
                    </Stack.Screen>
                </>
            )}
        </Stack.Navigator>
    );
};

export default ProfileStack;
