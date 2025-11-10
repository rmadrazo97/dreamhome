import React, { useCallback } from 'react';
import { NavigationProp } from '../../types';
import SignInScreen from '../SignInScreen';

interface BookmarksSignInProps {
    navigation: NavigationProp;
    apColors?: any;
}

const BookmarksSignIn: React.FC<BookmarksSignInProps> = ({ navigation, apColors }) => {
    const toForgetPwd = useCallback(() => {
        navigation.navigate('BookmarksForgetPwd');
    }, [navigation]);

    const toRegister = useCallback(() => {
        navigation.navigate('BookmarksRegister');
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

export default BookmarksSignIn;