import React, { useCallback } from 'react';
import { NavigationProp } from '../../types';
import ForgetPwdScreen from '../ForgetPwdScreen';

interface HomeForgetPwdProps {
    navigation: NavigationProp;
    apColors?: any;
}

const HomeForgetPwd: React.FC<HomeForgetPwdProps> = ({ navigation, apColors }) => {
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

export default HomeForgetPwd;