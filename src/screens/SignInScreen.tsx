import React, { useState, useCallback } from 'react';
import { 
    View, 
    TextInput, 
    StyleSheet, 
    TouchableOpacity, 
    Image,
    ViewStyle,
    TextStyle,
    ImageStyle
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaConsumer } from 'react-native-safe-area-context';
import axios from 'axios';

import { getAppLangCode } from '../helpers/store';
import { mediumFontFamily } from '../constants/Colors';
import { translate } from "../helpers/i18n";
import { getUserDatas } from '../helpers/user';
import BackButton from '../components/inners/BackButton';
import TextRegular from '../components/ui/TextRegular';
import TextHeavy from '../components/ui/TextHeavy';
import Loader from '../components/Loader';
import ErrorSuccessPopup from '../components/ErrorSuccessPopup';
import { ThemeColors, NavigationProp } from '../types';

// Types
interface SignInProps {
    navigation: NavigationProp;
    apColors: ThemeColors;
}

const SignInScreen: React.FC<SignInProps> = ({ navigation, apColors }) => {
    // Separate state hooks
    const [log, setLog] = useState('');
    const [password, setPassword] = useState('');
    const [validating, setValidating] = useState(false);
    const [focus, setFocus] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [title, setTitle] = useState(translate('login_wrong'));
    const [message, setMessage] = useState('');
    const [showPopup, setShowPopup] = useState(false);

    // Navigation options
    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
            headerTransparent: true,
            title: 'Please sign in',
        });
    }, [navigation]);

    const handleInputChange = useCallback((field: 'log' | 'password', value: string) => {
        if (field === 'log') {
            setLog(value);
        } else if (field === 'password') {
            setPassword(value);
        }
    }, []);

    const handleFocus = useCallback((field: string) => {
        setFocus(field);
    }, []);

    const handleBlur = useCallback(() => {
        setFocus('');
    }, []);

    const handleSubmit = useCallback(async () => {
        // Prevent multiple submissions
        if (validating || showPopup) {
            return;
        }

        if (!log.trim() || !password.trim()) {
            setIsSuccess(false);
            setTitle(translate('login_wrong'));
            setMessage(translate('login_empty'));

            // Ensure popup is closed before showing new one
            setShowPopup(false);
            setTimeout(() => {
                setShowPopup(true);
            }, 100);
            return;
        }

        setValidating(true);
        // Ensure popup is closed when starting new request
        setShowPopup(false);

        try {
            const lang = await getAppLangCode();
            const response = await axios.post('https://dreamhome.techlead.solutions/wp-json/cththemes/v1/listings/login', {
                log,
                password,
                cthlang: lang
            });
            console.log('response', response);
            if (response.data && response.data.success) {
                const { user, authToken } = response.data;
                
                // Store user data
                await AsyncStorage.setItem('user', JSON.stringify({
                    id: user.id,
                    authToken,
                    display_name: user.display_name,
                    avatar: user.avatar,
                    role_name: user.role_name
                }));

                // Get user data and update Redux store
                await getUserDatas();

                setValidating(false);
                setIsSuccess(true);
                setTitle(translate('login_success'));
                setMessage(translate('login_welcome'));

                // Small delay to ensure state is settled
                setTimeout(() => {
                    setShowPopup(true);
                }, 300);

                // Navigate after successful login
                setTimeout(() => {
                    navigation.navigate('Home');
                }, 2000);

            } else {
                setValidating(false);
                setIsSuccess(false);
                setTitle(translate('login_wrong'));
                setMessage(response.data?.message || translate('login_error'));

                // Small delay to ensure state is settled
                setTimeout(() => {
                    setShowPopup(true);
                }, 300);
            }
        } catch (error) {
            console.error('Login error:', error);
            setValidating(false);
            setIsSuccess(false);
            setTitle(translate('login_wrong'));
            setMessage(translate('login_error'));
            // Small delay to ensure state is settled
            setTimeout(() => {
                setShowPopup(true);
            }, 300);
        }
    }, [log, password, navigation, validating, showPopup]);

    const handleClosePopup = useCallback(() => {
        // Ensure popup closes properly
        setShowPopup(false);
        // Reset states after closing
        setTimeout(() => {
            setIsSuccess(false);
            setTitle(translate('login_wrong'));
            setMessage('');
        }, 300);
    }, []);

    return (
        <SafeAreaConsumer>
            {insets => (
                <View style={[styles.container, { 
                    backgroundColor: apColors.appBg, 
                    paddingTop: insets?.top || 0,
                    paddingLeft: insets?.left || 0,
                    paddingRight: insets?.right || 0
                }]}>
                    <View style={styles.header}>
                        <BackButton 
                            color={apColors.backBtn} 
                            onPress={() => navigation.goBack()} 
                        />
                    </View>

                    <View style={styles.content}>
                        <View style={styles.logoContainer}>
                            <Image
                                source={require('../../assets/images/new-logo2.png')}
                                style={styles.logo}
                                resizeMode="contain"
                            />
                        </View>

                        <View style={styles.form}>
                            <TextHeavy style={[styles.title, { color: apColors.hText }]}>
                                {translate('welcome_back')}
                            </TextHeavy>

                            <TextRegular style={[styles.subtitle, { color: apColors.pText }]}>
                                {translate('sign_in_subtitle')}
                            </TextRegular>

                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={[
                                        styles.input,
                                        {
                                            borderColor: focus === 'log' ? apColors.appColor : apColors.separator,
                                            color: apColors.regularText,
                                            backgroundColor: apColors.secondBg
                                        }
                                    ]}
                                    placeholder={translate('email_or_username')}
                                    placeholderTextColor={apColors.fieldLbl}
                                    value={log}
                                    onChangeText={(value) => handleInputChange('log', value)}
                                    onFocus={() => handleFocus('log')}
                                    onBlur={handleBlur}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={[
                                        styles.input,
                                        {
                                            borderColor: focus === 'password' ? apColors.appColor : apColors.separator,
                                            color: apColors.regularText,
                                            backgroundColor: apColors.secondBg
                                        }
                                    ]}
                                    placeholder={translate('password')}
                                    placeholderTextColor={apColors.fieldLbl}
                                    value={password}
                                    onChangeText={(value) => handleInputChange('password', value)}
                                    onFocus={() => handleFocus('password')}
                                    onBlur={handleBlur}
                                    secureTextEntry
                                />
                            </View>

                            <TouchableOpacity
                                style={[styles.forgotPassword, { borderBottomColor: apColors.appColor }]}
                                onPress={() => navigation.navigate('ForgetPwd')}
                            >
                                <TextRegular style={[styles.forgotPasswordText, { color: apColors.appColor }]}>
                                    {translate('forgot_password')}
                                </TextRegular>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.loginButton, { backgroundColor: apColors.appColor }]}
                                onPress={handleSubmit}
                                disabled={validating}
                            >
                                {validating ? (
                                    <Loader loading={validating} />
                                ) : (
                                    <TextHeavy style={styles.loginButtonText}>
                                        {translate('sign_in')}
                                    </TextHeavy>
                                )}
                            </TouchableOpacity>

                            <View style={styles.signUpContainer}>
                                <TextRegular style={[styles.signUpText, { color: apColors.pText }]}>
                                    {translate('dont_have_account')}
                                </TextRegular>
                                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                                    <TextHeavy style={[styles.signUpLink, { color: apColors.appColor }]}>
                                        {translate('sign_up')}
                                    </TextHeavy>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {showPopup && (
                        <ErrorSuccessPopup
                            isSuccess={isSuccess}
                            isError={!isSuccess}
                            title={String(title || '')}
                            message={String(message || '')}
                            onClose={handleClosePopup}
                            visible={showPopup}
                            apColors={apColors}
                        />
                    )}
                </View>
            )}
        </SafeAreaConsumer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    } as ViewStyle,
    header: {
        paddingHorizontal: 15,
        paddingVertical: 10,
    } as ViewStyle,
    content: {
        flex: 1,
        paddingHorizontal: 30,
        justifyContent: 'center',
    } as ViewStyle,
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    } as ViewStyle,
    logo: {
        width: 80,
        height: 80,
    } as ImageStyle,
    form: {
        width: '100%',
    } as ViewStyle,
    title: {
        fontSize: 28,
        textAlign: 'center',
        marginBottom: 10,
    } as TextStyle,
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 40,
    } as TextStyle,
    inputContainer: {
        marginBottom: 20,
    } as ViewStyle,
    input: {
        height: 50,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
        fontFamily: mediumFontFamily,
    } as TextStyle,
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 30,
        borderBottomWidth: 1,
    } as ViewStyle,
    forgotPasswordText: {
        fontSize: 14,
    } as TextStyle,
    loginButton: {
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    } as ViewStyle,
    loginButtonText: {
        color: '#FFF',
        fontSize: 16,
    } as TextStyle,
    signUpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    } as ViewStyle,
    signUpText: {
        fontSize: 14,
        marginRight: 5,
    } as TextStyle,
    signUpLink: {
        fontSize: 14,
    } as TextStyle,
});

export default SignInScreen;
