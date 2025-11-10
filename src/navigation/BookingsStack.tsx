import React, { useLayoutEffect } from 'react';
import { useColorScheme } from 'react-native';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from "react-redux";

import BookingsScreen from '../screens/BookingsScreen';
import SBookingScreen from '../screens/bookings/Booking';
import SignInScreen from '../screens/SignInScreen';
import ForgetPwdScreen from '../screens/ForgetPwdScreen';
import RegisterScreen from '../screens/RegisterScreen';

import { translate } from "../helpers/i18n";
import getThemedColors from '../helpers/Theme';
import BackButton from '../components/inners/BackButton';

const Stack = createStackNavigator();

interface BookingsStackProps {
    navigation: any;
    route: any;
}

const BookingsStack: React.FC<BookingsStackProps> = ({ navigation, route }) => {
    const user = useSelector((state: any) => state.user);
    const { isLoggedIn } = user;
    const colors = getThemedColors(useColorScheme());

    useLayoutEffect(() => {
        const routeName = getFocusedRouteNameFromRoute(route) ?? (isLoggedIn ? 'Bookings' : 'SignIn');
        navigation.setOptions({ tabBarVisible: routeName == 'Bookings' });
    }, [navigation, route, isLoggedIn]);

    return (
        <Stack.Navigator
            initialRouteName={isLoggedIn ? 'Bookings' : 'SignIn'}
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
                    <Stack.Screen name="Bookings" options={{ title: translate('bks_screen') }}>
                        {props => <BookingsScreen {...props} />}
                    </Stack.Screen>

                    <Stack.Screen 
                        name="SBooking" 
                        options={({ navigation }) => ({
                            title: translate('sbk_screen'),
                            headerLeft: () => (
                                <BackButton 
                                    color={colors.backBtn} 
                                    onPress={navigation.goBack} 
                                    style={{ marginLeft: 10 }} 
                                />
                            ),
                        })}
                    >
                        {props => <SBookingScreen {...props} />}
                    </Stack.Screen>
                </>
            ) : (
                <>
                    <Stack.Screen 
                        name="SignIn" 
                        options={{ headerShown: false }} 
                        initialParams={{ loggedInRoute: 'Bookings' }}
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

export default BookingsStack;
