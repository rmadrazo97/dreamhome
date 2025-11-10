import React, { useCallback } from 'react';
import { NavigationProp } from '../../types';
import RegisterScreen from '../RegisterScreen';

interface HomeRegisterProps {
    navigation: NavigationProp;
    apColors?: any;
}

const HomeRegister: React.FC<HomeRegisterProps> = ({ navigation, apColors }) => {
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

export default HomeRegister;