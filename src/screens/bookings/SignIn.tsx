import React, { useCallback } from 'react';
import { NavigationProp } from '../../types';
import SignInScreen from '../SignInScreen';

interface BookingsSignInProps {
    navigation: NavigationProp;
    apColors?: any;
}

const BookingsSignIn: React.FC<BookingsSignInProps> = ({ navigation, apColors }) => {
    const toForgetPwd = useCallback(() => {
        navigation.navigate('BookingsForgetPwd');
    }, [navigation]);

    const toRegister = useCallback(() => {
        navigation.navigate('BookingsRegister');
    }, [navigation]);

    const onPressDone = useCallback(() => {
        navigation.navigate('Home');
    }, [navigation]);

    return (
        <SignInScreen
            navigation={navigation}
            apColors={apColors}
            onForgetPwd={toForgetPwd}
            onRegister={toRegister}
            onDone={onPressDone}
        />
    );
};

export default BookingsSignIn;