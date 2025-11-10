import React, { useCallback, useLayoutEffect } from 'react';
import { NavigationProp } from '../../types';
import ForgetPwdScreen from '../ForgetPwdScreen';

interface ForgetPwRegForgetPwdProps {
    navigation: NavigationProp;
    apColors?: any;
}

const ForgetPwRegForgetPwd: React.FC<ForgetPwRegForgetPwdProps> = ({ navigation, apColors }) => {
    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false
        });
    }, [navigation]);

    const onDone = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    return (
        <ForgetPwdScreen
            navigation={navigation}
            apColors={apColors}
            onDone={onDone}
        />
    );
};

export default ForgetPwRegForgetPwd;