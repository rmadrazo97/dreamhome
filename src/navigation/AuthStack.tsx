import React from 'react';
import { useColorScheme } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import FilterScreen from '../screens/FilterScreen';
import SignInScreen from '../screens/SignInScreen';
import ForgetPwdScreen from '../screens/ForgetPwdScreen';
import RegisterScreen from '../screens/RegisterScreen';

import getThemedColors from '../helpers/Theme';

const Stack = createStackNavigator();

interface AuthStackProps {
    navigation: any;
    route: any;
}

const AuthStack: React.FC<AuthStackProps> = ({ navigation, route }) => {
    const colors = getThemedColors(useColorScheme());

    return (
        <Stack.Navigator
            initialRouteName="SignIn"
            screenOptions={{
                gestureEnabled: false,
                presentation: 'modal',
                headerShown: false,
            }}
        >
            <Stack.Screen name="SignIn">
                {props => <SignInScreen {...props} apColors={colors} />}
            </Stack.Screen>
            
            <Stack.Screen name="ForgetPwd">
                {props => <ForgetPwdScreen {...props} apColors={colors} />}
            </Stack.Screen>
            
            <Stack.Screen name="Register">
                {props => <RegisterScreen {...props} apColors={colors} />}
            </Stack.Screen>
        </Stack.Navigator>
    );
};

export default AuthStack;
