import React, { useState, useCallback, useRef } from 'react';
import { 
    View, 
    TextInput, 
    StyleSheet, 
    TouchableOpacity, 
    Linking,
    ScrollView,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { SafeAreaConsumer } from 'react-native-safe-area-context';
import axios from 'axios';

import { getAppLangCode } from '../helpers/store';
import colors, { mediumFontFamily } from '../constants/Colors';
import { translate } from "../helpers/i18n";
import SiteDetails from '../constants/SiteDetails';
import CloseButton from '../components/inners/CloseButton';
import TextRegular from '../components/ui/TextRegular';
import TextHeavy from '../components/ui/TextHeavy';
import Loader from '../components/Loader';
import ErrorSuccessPopup from '../components/ErrorSuccessPopup';

// Types
interface RegisterScreenState {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    validating: boolean;
    focus: string;
    errors: {
        username: string;
        email: string;
        password: string;
        confirmPassword: string;
    };
    showPopup: boolean;
    isSuccess: boolean;
    title: string;
    message: string;
}

const RegisterScreen = ({ navigation }: { navigation: any }) => {
    const [state, setState] = useState<RegisterScreenState>({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        validating: false,
        focus: '',
        errors: {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        showPopup: false,
        isSuccess: false,
        title: '',
        message: '',
    });

    // Refs for form inputs
    const usernameRef = useRef<TextInput>(null);
    const emailRef = useRef<TextInput>(null);
    const passwordRef = useRef<TextInput>(null);
    const confirmPasswordRef = useRef<TextInput>(null);

    // Navigation options
    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    const validateForm = useCallback(() => {
        setState(prevState => {
            const { username, email, password, confirmPassword } = prevState;
            const errors = {
                username: '',
                email: '',
                password: '',
                confirmPassword: '',
            };

            // Validate username
            if (!username.trim()) {
                errors.username = String(translate('username_required') || '');
            } else if (username.length < 3) {
                errors.username = String(translate('username_min_length') || '');
            } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
                errors.username = String(translate('username_invalid_chars') || '');
            }

            // Validate email
            if (!email.trim()) {
                errors.email = String(translate('email_required') || '');
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                errors.email = String(translate('email_invalid') || '');
            }

            // Validate password
            if (!password.trim()) {
                errors.password = String(translate('password_required') || '');
            } else if (password.length < 6) {
                errors.password = String(translate('password_min_length') || '');
            } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
                errors.password = String(translate('password_requirements') || '');
            }

            // Validate confirm password
            if (!confirmPassword.trim()) {
                errors.confirmPassword = String(translate('confirm_password_required') || '');
            } else if (password !== confirmPassword) {
                errors.confirmPassword = String(translate('passwords_do_not_match') || '');
            }

            return {
                ...prevState,
                errors,
            };
        });

        return !Object.values(state.errors).some(error => error !== '');
    }, [state.errors]);

    const handleRegister = useCallback(async () => {
        // Prevent multiple submissions
        if (state.validating || state.showPopup) {
            return;
        }

        if (!validateForm()) {
            return;
        }

        // Ensure popup is closed when starting new request
        setState(prevState => ({ 
            ...prevState, 
            validating: true,
            showPopup: false 
        }));

        try {
            const langCode = await getAppLangCode();
            const response = await axios.post('https://dreamhome.techlead.solutions/wp-json/cththemes/v1/listings/register', {
                username: state.username.trim(),
                email: state.email.trim().toLowerCase(),
                password: state.password,
                lang: langCode,
            });
            console.log('response', response);
            if (response.data.success) {
                setState(prevState => ({
                    ...prevState,
                    validating: false,
                    isSuccess: true,
                    title: translate('registration_success'),
                    message: translate('registration_success_message'),
                }));

                // Small delay to ensure state is settled
                setTimeout(() => {
                    setState(prevState => ({
                        ...prevState,
                        showPopup: true,
                    }));
                }, 300);
            } else {
                setState(prevState => ({
                    ...prevState,
                    validating: false,
                    isSuccess: false,
                    title: translate('registration_failed'),
                    message: response.data.message || translate('registration_error'),
                }));

                // Small delay to ensure state is settled
                setTimeout(() => {
                    setState(prevState => ({
                        ...prevState,
                        showPopup: true,
                    }));
                }, 300);
            }
        } catch (error: any) {
            console.error('Registration error:', error);
            setState(prevState => ({
                ...prevState,
                validating: false,
                isSuccess: false,
                title: translate('registration_failed'),
                message: error.response?.data?.message || translate('registration_error'),
            }));

            // Small delay to ensure state is settled
            setTimeout(() => {
                setState(prevState => ({
                    ...prevState,
                    showPopup: true,
                }));
            }, 300);
        }
    }, [state.username, state.email, state.password, state.validating, state.showPopup, validateForm]);

    const handleInputChange = useCallback((field: keyof RegisterScreenState['errors'], value: string) => {
        setState(prevState => ({
            ...prevState,
            [field]: value,
            errors: {
                ...prevState.errors,
                [field]: '',
            },
        }));
    }, []);

    const handleInputFocus = useCallback((field: string) => {
        setState(prevState => ({
            ...prevState,
            focus: field,
        }));
    }, []);

    const handleInputBlur = useCallback(() => {
        setState(prevState => ({
            ...prevState,
            focus: '',
        }));
    }, []);

    const handleClosePopup = useCallback(() => {
        // Ensure popup closes properly
        setState(prevState => ({
            ...prevState,
            showPopup: false,
        }));

        // Reset states after closing if not successful
        if (!state.isSuccess) {
            setTimeout(() => {
                setState(prevState => ({
                    ...prevState,
                    isSuccess: false,
                    title: '',
                    message: '',
                }));
            }, 300);
        } else {
            // Navigate back on success
            setTimeout(() => {
                navigation.goBack();
            }, 300);
        }
    }, [navigation, state.isSuccess]);

    const handleBackPress = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const handleSignInPress = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const handleTermsPress = useCallback(() => {
        if (SiteDetails.terms_page) {
            Linking.openURL(SiteDetails.terms_page);
        }
    }, []);

    const handlePrivacyPress = useCallback(() => {
        if (SiteDetails.url) {
            Linking.openURL(SiteDetails.url);
        }
    }, []);

    const { 
        username, 
        email, 
        password, 
        confirmPassword,
        validating, 
        focus, 
        errors, 
        showPopup, 
        isSuccess, 
        title, 
        message 
    } = state;

    return (
        <SafeAreaConsumer>
            {insets => (
                <KeyboardAvoidingView 
                    style={[styles.container, { 
                        backgroundColor: colors.appBg,
                        paddingTop: insets?.top,
                        paddingLeft: insets?.left,
                        paddingRight: insets?.right
                    }]}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <CloseButton 
                            isBlack={true} 
                            onPress={handleBackPress} 
                            style={styles.closeButton}
                        />
                    </View>

                    {/* Content */}
                    <ScrollView 
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={styles.content}>
                        <View style={styles.titleContainer}>
                            <TextHeavy style={[styles.title, { color: colors.hText }]}>
                                {translate('create_account')}
                            </TextHeavy>
                            <TextRegular style={[styles.subtitle, { color: colors.regularText }]}>
                                {translate('register_subtitle')}
                            </TextRegular>
                        </View>

                        {/* Form */}
                        <View style={styles.form}>
                            {/* Username */}
                            <View style={styles.inputGroup}>
                                <TextRegular style={[styles.inputLabel, { color: colors.pText }]}>
                                    {translate('username')}
                                </TextRegular>
                                <TextInput
                                    ref={usernameRef}
                                    style={[
                                        styles.input,
                                        {
                                            borderColor: focus === 'username' ? colors.appColor : colors.separator,
                                            color: colors.regularText,
                                            backgroundColor: colors.secondBg
                                        }
                                    ]}
                                    value={username}
                                    onChangeText={(value) => handleInputChange('username', value)}
                                    onFocus={() => handleInputFocus('username')}
                                    onBlur={handleInputBlur}
                                    placeholder={translate('enter_username')}
                                    placeholderTextColor={colors.fieldLbl}
                                    autoCapitalize="none"
                                    returnKeyType="next"
                                    onSubmitEditing={() => emailRef.current?.focus()}
                                />
                                {errors.username ? (
                                    <TextRegular style={[styles.errorText, { color: colors.errorColor }]}>
                                        {errors.username}
                                    </TextRegular>
                                ) : null}
                            </View>

                            {/* Email */}
                            <View style={styles.inputGroup}>
                                <TextRegular style={[styles.inputLabel, { color: colors.pText }]}>
                                    {translate('email')}
                                </TextRegular>
                                <TextInput
                                    ref={emailRef}
                                    style={[
                                        styles.input,
                                        {
                                            borderColor: focus === 'email' ? colors.appColor : colors.separator,
                                            color: colors.regularText,
                                            backgroundColor: colors.secondBg
                                        }
                                    ]}
                                    value={email}
                                    onChangeText={(value) => handleInputChange('email', value)}
                                    onFocus={() => handleInputFocus('email')}
                                    onBlur={handleInputBlur}
                                    placeholder={translate('enter_email')}
                                    placeholderTextColor={colors.fieldLbl}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    returnKeyType="next"
                                    onSubmitEditing={() => passwordRef.current?.focus()}
                                />
                                {errors.email ? (
                                    <TextRegular style={[styles.errorText, { color: colors.errorColor }]}>
                                        {errors.email}
                                    </TextRegular>
                                ) : null}
                            </View>

                            {/* Password */}
                            <View style={styles.inputGroup}>
                                <TextRegular style={[styles.inputLabel, { color: colors.pText }]}>
                                    {translate('password')}
                                </TextRegular>
                                <TextInput
                                    ref={passwordRef}
                                    style={[
                                        styles.input,
                                        {
                                            borderColor: focus === 'password' ? colors.appColor : colors.separator,
                                            color: colors.regularText,
                                            backgroundColor: colors.secondBg
                                        }
                                    ]}
                                    value={password}
                                    onChangeText={(value) => handleInputChange('password', value)}
                                    onFocus={() => handleInputFocus('password')}
                                    onBlur={handleInputBlur}
                                    placeholder={translate('enter_password')}
                                    placeholderTextColor={colors.fieldLbl}
                                    secureTextEntry
                                    returnKeyType="next"
                                    onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                                />
                                {errors.password ? (
                                    <TextRegular style={[styles.errorText, { color: colors.errorColor }]}>
                                        {errors.password}
                                    </TextRegular>
                                ) : null}
                            </View>

                            {/* Confirm Password */}
                            <View style={styles.inputGroup}>
                                <TextRegular style={[styles.inputLabel, { color: colors.pText }]}>
                                    {translate('confirm_password')}
                                </TextRegular>
                                <TextInput
                                    ref={confirmPasswordRef}
                                    style={[
                                        styles.input,
                                        {
                                            borderColor: focus === 'confirmPassword' ? colors.appColor : colors.separator,
                                            color: colors.regularText,
                                            backgroundColor: colors.secondBg
                                        }
                                    ]}
                                    value={confirmPassword}
                                    onChangeText={(value) => handleInputChange('confirmPassword', value)}
                                    onFocus={() => handleInputFocus('confirmPassword')}
                                    onBlur={handleInputBlur}
                                    placeholder={translate('confirm_password_placeholder')}
                                    placeholderTextColor={colors.fieldLbl}
                                    secureTextEntry
                                    returnKeyType="done"
                                    onSubmitEditing={handleRegister}
                                />
                                {errors.confirmPassword ? (
                                    <TextRegular style={[styles.errorText, { color: colors.errorColor }]}>
                                        {errors.confirmPassword}
                                    </TextRegular>
                                ) : null}
                            </View>

                            {/* Register Button */}
                            <TouchableOpacity
                                style={[styles.registerButton, { backgroundColor: colors.appColor }]}
                                onPress={handleRegister}
                                disabled={validating}
                            >
                                {validating ? (
                                    <Loader loading={validating} />
                                ) : (
                                    <TextHeavy style={styles.registerButtonText}>
                                        {translate('register')}
                                    </TextHeavy>
                                )}
                            </TouchableOpacity>

                            {/* Terms and Privacy */}
                            <View style={styles.legalContainer}>
                                <TextRegular style={[styles.legalText, { color: colors.regularText }]}>
                                    {translate('by_registering_you_agree')}{' '}
                                </TextRegular>
                                <TouchableOpacity onPress={handleTermsPress}>
                                    <TextRegular style={[styles.legalLink, { color: colors.appColor }]}>
                                        {translate('terms_conditions')}
                                    </TextRegular>
                                </TouchableOpacity>
                                <TextRegular style={[styles.legalText, { color: colors.regularText }]}>
                                    {' '}{translate('and')}{' '}
                                </TextRegular>
                                <TouchableOpacity onPress={handlePrivacyPress}>
                                    <TextRegular style={[styles.legalLink, { color: colors.appColor }]}>
                                        {translate('privacy_policy')}
                                    </TextRegular>
                                </TouchableOpacity>
                            </View>

                            {/* Sign In Link */}
                            <View style={styles.signInContainer}>
                                <TextRegular style={[styles.signInText, { color: colors.regularText }]}>
                                    {translate('already_have_account')}{' '}
                                </TextRegular>
                                <TouchableOpacity onPress={handleSignInPress}>
                                    <TextHeavy style={[styles.signInLink, { color: colors.appColor }]}>
                                        {translate('sign_in')}
                                    </TextHeavy>
                                </TouchableOpacity>
                            </View>
                        </View>
                        </View>
                    </ScrollView>

                    {/* Success/Error Popup */}
                    {showPopup && (
                        <ErrorSuccessPopup
                            isSuccess={isSuccess}
                            isError={!isSuccess}
                            title={String(title || '')}
                            message={String(message || '')}
                            onClose={handleClosePopup}
                            visible={showPopup}
                        />
                    )}
                </KeyboardAvoidingView>
            )}
        </SafeAreaConsumer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    closeButton: {
        marginLeft: 15,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 28,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 22,
    },
    form: {
        flex: 1,
    },
    inputGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        marginBottom: 8,
        fontWeight: '500',
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
        fontFamily: mediumFontFamily,
    },
    errorText: {
        fontSize: 12,
        marginTop: 5,
        fontWeight: '500',
    },
    registerButton: {
        height: 50,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    registerButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    legalContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    legalText: {
        fontSize: 12,
        lineHeight: 18,
    },
    legalLink: {
        fontSize: 12,
        textDecorationLine: 'underline',
        fontWeight: '500',
    },
    signInContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    signInText: {
        fontSize: 14,
    },
    signInLink: {
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default RegisterScreen;
