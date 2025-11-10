import React from 'react';
import { View, StyleSheet } from 'react-native';
import SignInScreen from '../SignInScreen';
import { ThemeColors, NavigationProp } from '../types';

interface ProfileSignInProps {
    navigation: NavigationProp;
    apColors: ThemeColors;
}

const ProfileSignIn: React.FC<ProfileSignInProps> = ({ navigation, apColors }) => {
    const handleForgetPwd = () => {
        navigation.navigate('ProfileForgetPwd');
    };

    const handleRegister = () => {
        navigation.navigate('ProfileRegister');
    };

    const handleDone = () => {
        navigation.navigate('Home');
    };

    return (
        <SignInScreen 
            navigation={navigation} 
            apColors={apColors}
            onForgetPwd={handleForgetPwd}
            onRegister={handleRegister}
            onDone={handleDone}
        />
    );
};

export default ProfileSignIn;