import React, { useCallback, useLayoutEffect } from 'react';
import { NavigationProp } from '../../types';
import RegisterScreen from '../RegisterScreen';

interface ForgetPwRegRegisterProps {
    navigation: NavigationProp;
    apColors?: any;
}

const ForgetPwRegRegister: React.FC<ForgetPwRegRegisterProps> = ({ navigation, apColors }) => {
    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false
        });
    }, [navigation]);

    const onDone = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    return (
        <RegisterScreen
            navigation={navigation}
            apColors={apColors}
            onDone={onDone}
        />
    );
};

export default ForgetPwRegRegister;