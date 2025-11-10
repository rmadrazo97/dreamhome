import React, { useCallback } from 'react';
import { 
	View,
	StyleSheet 
} from 'react-native';
import { NavigationProp } from '../../types';
import SignInScreen from '../SignInScreen';
import BackButton from '../../components/inners/BackButton';

interface HomeSignInProps {
    navigation: NavigationProp;
    apColors?: any;
}

const HomeSignIn: React.FC<HomeSignInProps> = ({ navigation, apColors }) => {
    const toForgetPwd = useCallback(() => {
        navigation.navigate('HomeForgetPwd');
    }, [navigation]);

    const toRegister = useCallback(() => {
        navigation.navigate('HomeRegister');
    }, [navigation]);

    const renderHeader = useCallback(() => {
        return (
            <View style={styles.navBar}>
                <BackButton isBlack={true} onPress={() => navigation.goBack()}/>
            </View>
        );
    }, [navigation]);

    return (
        <SignInScreen
            navigation={navigation}
            apColors={apColors}
        />
    );
};

const styles = StyleSheet.create({
    navBar: {
        position: 'absolute',
        top: 52,
        left: 0,
        right: 0,
        zIndex: 200,
        paddingLeft: 15,
        paddingRight: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default HomeSignIn;