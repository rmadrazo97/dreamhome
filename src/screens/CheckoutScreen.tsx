import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
    ScrollView,
    View,
    TextInput,
    Image,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Linking,
    ViewStyle,
    TextStyle,
    ImageStyle
} from 'react-native';
import { SafeAreaConsumer } from 'react-native-safe-area-context';
import { connect } from 'react-redux';

import { mediumFontFamily, regularFontFamily } from '../constants/Colors';
import { translate } from "../helpers/i18n";
import { checkBkPayment } from "../helpers/store";
import BtnLarge from '../components/ui/BtnLarge';
import BtnFull from '../components/ui/BtnFull';
import BtnLink from '../components/ui/BtnLink';
import TextRegular from '../components/ui/TextRegular';
import TextMedium from '../components/ui/TextMedium';
import TextHeavy from '../components/ui/TextHeavy';
import { CheckMarkSvg } from '../components/icons/ButtonSvgIcons';
import { submitCheckout, checkoutExit } from '../actions/booking';
import Loader from '../components/Loader';
import ErrorSuccessPopup from '../components/ErrorSuccessPopup';
import { ThemeColors, NavigationProp, Booking } from '../types';

// Types
interface CheckoutScreenState {
    loading: boolean;
    submitting: boolean;
    payment_method: string;
    booking_id: string | null;
    payment_url: string | null;
    isSuccess: boolean;
    title: string;
    message: string;
    showPopup: boolean;
    formData: {
        first_name: string;
        last_name: string;
        email: string;
        phone: string;
        address: string;
        city: string;
        zip_code: string;
        country: string;
        notes: string;
    };
}

interface CheckoutScreenProps {
    navigation: NavigationProp;
    apColors: ThemeColors;
    booking: any;
    user: any;
}

let checkTimeout: NodeJS.Timeout | null = null;

const checkOnlinePayment = (booking_id: string): any => {
    checkTimeout = setTimeout(() => {
        checkBkPayment(booking_id);
    }, 3000);
};

const CheckoutScreen: React.FC<CheckoutScreenProps> = ({ navigation, apColors, booking, user }) => {
    const [state, setState] = useState<CheckoutScreenState>({
        loading: false,
        submitting: false,
        payment_method: 'cash',
        booking_id: null,
        payment_url: null,
        isSuccess: false,
        title: '',
        message: '',
        showPopup: false,
        formData: {
            first_name: user?.display_name?.split(' ')[0] || '',
            last_name: user?.display_name?.split(' ').slice(1).join(' ') || '',
            email: user?.email || '',
            phone: user?.phone || '',
            address: '',
            city: '',
            zip_code: '',
            country: '',
            notes: '',
        },
    });

    // Navigation options
    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    const handleInputChange = useCallback((field: keyof CheckoutScreenState['formData'], value: string) => {
        setState(prevState => ({
            ...prevState,
            formData: {
                ...prevState.formData,
                [field]: value,
            },
        }));
    }, []);

    const handlePaymentMethodChange = useCallback((method: string) => {
        setState(prevState => ({
            ...prevState,
            payment_method: method,
        }));
    }, []);

    const handleSubmit = useCallback(async () => {
        if (!booking) {
            Alert.alert(translate('error'), translate('no_booking_data'));
            return;
        }

        setState(prevState => ({
            ...prevState,
            submitting: true,
        }));

        try {
            const checkoutData = {
                ...booking,
                ...state.formData,
                payment_method: state.payment_method,
            };

            const response = await submitCheckout(checkoutData);
            
            if (response.success) {
                setState(prevState => ({
                    ...prevState,
                    booking_id: response.booking_id,
                    payment_url: response.payment_url,
                    submitting: false,
                }));

                if (state.payment_method === 'online' && response.payment_url) {
                    // Open payment URL
                    await Linking.openURL(response.payment_url);
                    
                    // Start checking payment status
                    checkOnlinePayment(response.booking_id);
                } else {
                    // Cash payment - show success
                    setState(prevState => ({
                        ...prevState,
                        isSuccess: true,
                        title: translate('booking_success'),
                        message: translate('booking_confirmed'),
                        showPopup: true,
                    }));
                }
            } else {
                setState(prevState => ({
                    ...prevState,
                    submitting: false,
                    isSuccess: false,
                    title: translate('booking_failed'),
                    message: response.message || translate('booking_error'),
                    showPopup: true,
                }));
            }
        } catch (error) {
            console.error('Checkout error:', error);
            setState(prevState => ({
                ...prevState,
                submitting: false,
                isSuccess: false,
                title: translate('booking_failed'),
                message: translate('booking_error'),
                showPopup: true,
            }));
        }
    }, [booking, state.formData, state.payment_method]);

    const handleClosePopup = useCallback(() => {
        setState(prevState => ({
            ...prevState,
            showPopup: false,
        }));

        if (state.isSuccess) {
            navigation.navigate('Bookings');
        }
    }, [navigation, state.isSuccess]);

    const handleExit = useCallback(() => {
        checkoutExit();
        navigation.goBack();
    }, [navigation]);

    useEffect(() => {
        return () => {
            if (checkTimeout) {
                clearTimeout(checkTimeout);
            }
        };
    }, []);

    const { 
        loading, 
        submitting, 
        payment_method, 
        booking_id, 
        payment_url, 
        isSuccess, 
        title, 
        message, 
        showPopup, 
        formData 
    } = state;

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: apColors.appBg }]}>
                <View style={styles.loadingContainer}>
                    <Loader />
                    <Text style={[styles.loadingText, { color: apColors.regularText }]}>
                        {translate('loading')}...
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <SafeAreaConsumer>
            {insets => (
                <View style={[styles.container, { 
                    backgroundColor: apColors.appBg,
                    paddingTop: insets.top,
                    paddingLeft: insets.left,
                    paddingRight: insets.right
                }]}>
                    <ScrollView style={styles.scrollView}>
                        {/* Header */}
                        <View style={styles.header}>
                            <TextHeavy style={[styles.title, { color: apColors.hText }]}>
                                {translate('checkout')}
                            </TextHeavy>
                        </View>

                        {/* Booking Summary */}
                        {booking && (
                            <View style={[styles.summarySection, { backgroundColor: apColors.secondBg, borderColor: apColors.separator }]}>
                                <TextHeavy style={[styles.sectionTitle, { color: apColors.hText }]}>
                                    {translate('booking_summary')}
                                </TextHeavy>
                                
                                <View style={styles.summaryRow}>
                                    <TextRegular style={[styles.summaryLabel, { color: apColors.pText }]}>
                                        {translate('listing')}:
                                    </TextRegular>
                                    <TextMedium style={[styles.summaryValue, { color: apColors.regularText }]}>
                                        {booking.listing?.title}
                                    </TextMedium>
                                </View>

                                <View style={styles.summaryRow}>
                                    <TextRegular style={[styles.summaryLabel, { color: apColors.pText }]}>
                                        {translate('check_in')}:
                                    </TextRegular>
                                    <TextMedium style={[styles.summaryValue, { color: apColors.regularText }]}>
                                        {booking.checkin}
                                    </TextMedium>
                                </View>

                                <View style={styles.summaryRow}>
                                    <TextRegular style={[styles.summaryLabel, { color: apColors.pText }]}>
                                        {translate('check_out')}:
                                    </TextRegular>
                                    <TextMedium style={[styles.summaryValue, { color: apColors.regularText }]}>
                                        {booking.checkout}
                                    </TextMedium>
                                </View>

                                <View style={[styles.summaryRow, styles.totalRow]}>
                                    <TextHeavy style={[styles.summaryLabel, { color: apColors.hText }]}>
                                        {translate('total')}:
                                    </TextHeavy>
                                    <TextHeavy style={[styles.summaryValue, { color: apColors.appColor }]}>
                                        {booking.total_price}
                                    </TextHeavy>
                                </View>
                            </View>
                        )}

                        {/* Personal Information */}
                        <View style={styles.section}>
                            <TextHeavy style={[styles.sectionTitle, { color: apColors.hText }]}>
                                {translate('personal_information')}
                            </TextHeavy>

                            <View style={styles.inputRow}>
                                <View style={styles.inputHalf}>
                                    <TextRegular style={[styles.inputLabel, { color: apColors.pText }]}>
                                        {translate('first_name')}
                                    </TextRegular>
                                    <TextInput
                                        style={[styles.input, {
                                            borderColor: apColors.separator,
                                            color: apColors.regularText,
                                            backgroundColor: apColors.secondBg
                                        }]}
                                        value={formData.first_name}
                                        onChangeText={(value) => handleInputChange('first_name', value)}
                                        placeholder={translate('enter_first_name')}
                                        placeholderTextColor={apColors.fieldLbl}
                                    />
                                </View>

                                <View style={styles.inputHalf}>
                                    <TextRegular style={[styles.inputLabel, { color: apColors.pText }]}>
                                        {translate('last_name')}
                                    </TextRegular>
                                    <TextInput
                                        style={[styles.input, {
                                            borderColor: apColors.separator,
                                            color: apColors.regularText,
                                            backgroundColor: apColors.secondBg
                                        }]}
                                        value={formData.last_name}
                                        onChangeText={(value) => handleInputChange('last_name', value)}
                                        placeholder={translate('enter_last_name')}
                                        placeholderTextColor={apColors.fieldLbl}
                                    />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <TextRegular style={[styles.inputLabel, { color: apColors.pText }]}>
                                    {translate('email')}
                                </TextRegular>
                                <TextInput
                                    style={[styles.input, {
                                        borderColor: apColors.separator,
                                        color: apColors.regularText,
                                        backgroundColor: apColors.secondBg
                                    }]}
                                    value={formData.email}
                                    onChangeText={(value) => handleInputChange('email', value)}
                                    placeholder={translate('enter_email')}
                                    placeholderTextColor={apColors.fieldLbl}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <TextRegular style={[styles.inputLabel, { color: apColors.pText }]}>
                                    {translate('phone')}
                                </TextRegular>
                                <TextInput
                                    style={[styles.input, {
                                        borderColor: apColors.separator,
                                        color: apColors.regularText,
                                        backgroundColor: apColors.secondBg
                                    }]}
                                    value={formData.phone}
                                    onChangeText={(value) => handleInputChange('phone', value)}
                                    placeholder={translate('enter_phone')}
                                    placeholderTextColor={apColors.fieldLbl}
                                    keyboardType="phone-pad"
                                />
                            </View>
                        </View>

                        {/* Address Information */}
                        <View style={styles.section}>
                            <TextHeavy style={[styles.sectionTitle, { color: apColors.hText }]}>
                                {translate('address_information')}
                            </TextHeavy>

                            <View style={styles.inputGroup}>
                                <TextRegular style={[styles.inputLabel, { color: apColors.pText }]}>
                                    {translate('address')}
                                </TextRegular>
                                <TextInput
                                    style={[styles.input, {
                                        borderColor: apColors.separator,
                                        color: apColors.regularText,
                                        backgroundColor: apColors.secondBg
                                    }]}
                                    value={formData.address}
                                    onChangeText={(value) => handleInputChange('address', value)}
                                    placeholder={translate('enter_address')}
                                    placeholderTextColor={apColors.fieldLbl}
                                />
                            </View>

                            <View style={styles.inputRow}>
                                <View style={styles.inputHalf}>
                                    <TextRegular style={[styles.inputLabel, { color: apColors.pText }]}>
                                        {translate('city')}
                                    </TextRegular>
                                    <TextInput
                                        style={[styles.input, {
                                            borderColor: apColors.separator,
                                            color: apColors.regularText,
                                            backgroundColor: apColors.secondBg
                                        }]}
                                        value={formData.city}
                                        onChangeText={(value) => handleInputChange('city', value)}
                                        placeholder={translate('enter_city')}
                                        placeholderTextColor={apColors.fieldLbl}
                                    />
                                </View>

                                <View style={styles.inputHalf}>
                                    <TextRegular style={[styles.inputLabel, { color: apColors.pText }]}>
                                        {translate('zip_code')}
                                    </TextRegular>
                                    <TextInput
                                        style={[styles.input, {
                                            borderColor: apColors.separator,
                                            color: apColors.regularText,
                                            backgroundColor: apColors.secondBg
                                        }]}
                                        value={formData.zip_code}
                                        onChangeText={(value) => handleInputChange('zip_code', value)}
                                        placeholder={translate('enter_zip_code')}
                                        placeholderTextColor={apColors.fieldLbl}
                                    />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <TextRegular style={[styles.inputLabel, { color: apColors.pText }]}>
                                    {translate('country')}
                                </TextRegular>
                                <TextInput
                                    style={[styles.input, {
                                        borderColor: apColors.separator,
                                        color: apColors.regularText,
                                        backgroundColor: apColors.secondBg
                                    }]}
                                    value={formData.country}
                                    onChangeText={(value) => handleInputChange('country', value)}
                                    placeholder={translate('enter_country')}
                                    placeholderTextColor={apColors.fieldLbl}
                                />
                            </View>
                        </View>

                        {/* Payment Method */}
                        <View style={styles.section}>
                            <TextHeavy style={[styles.sectionTitle, { color: apColors.hText }]}>
                                {translate('payment_method')}
                            </TextHeavy>

                            <TouchableOpacity
                                style={[styles.paymentOption, {
                                    borderColor: payment_method === 'cash' ? apColors.appColor : apColors.separator,
                                    backgroundColor: payment_method === 'cash' ? apColors.appColor + '10' : apColors.secondBg
                                }]}
                                onPress={() => handlePaymentMethodChange('cash')}
                            >
                                <View style={styles.paymentOptionContent}>
                                    <TextMedium style={[styles.paymentOptionText, { 
                                        color: payment_method === 'cash' ? apColors.appColor : apColors.regularText 
                                    }]}>
                                        {translate('cash_payment')}
                                    </TextMedium>
                                    {payment_method === 'cash' && <CheckMarkSvg color={apColors.appColor} />}
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.paymentOption, {
                                    borderColor: payment_method === 'online' ? apColors.appColor : apColors.separator,
                                    backgroundColor: payment_method === 'online' ? apColors.appColor + '10' : apColors.secondBg
                                }]}
                                onPress={() => handlePaymentMethodChange('online')}
                            >
                                <View style={styles.paymentOptionContent}>
                                    <TextMedium style={[styles.paymentOptionText, { 
                                        color: payment_method === 'online' ? apColors.appColor : apColors.regularText 
                                    }]}>
                                        {translate('online_payment')}
                                    </TextMedium>
                                    {payment_method === 'online' && <CheckMarkSvg color={apColors.appColor} />}
                                </View>
                            </TouchableOpacity>
                        </View>

                        {/* Notes */}
                        <View style={styles.section}>
                            <TextHeavy style={[styles.sectionTitle, { color: apColors.hText }]}>
                                {translate('notes')} ({translate('optional')})
                            </TextHeavy>

                            <TextInput
                                style={[styles.textArea, {
                                    borderColor: apColors.separator,
                                    color: apColors.regularText,
                                    backgroundColor: apColors.secondBg
                                }]}
                                value={formData.notes}
                                onChangeText={(value) => handleInputChange('notes', value)}
                                placeholder={translate('enter_notes')}
                                placeholderTextColor={apColors.fieldLbl}
                                multiline
                                numberOfLines={4}
                            />
                        </View>
                    </ScrollView>

                    {/* Bottom Actions */}
                    <View style={[styles.bottomActions, { backgroundColor: apColors.appBg, borderTopColor: apColors.separator }]}>
                        <BtnLink
                            style={styles.cancelButton}
                            onPress={handleExit}
                        >
                            {translate('cancel')}
                        </BtnLink>

                        <BtnFull
                            style={[styles.submitButton, { backgroundColor: apColors.appColor }]}
                            onPress={handleSubmit}
                            disabled={submitting}
                        >
                            {submitting ? (
                                <ActivityIndicator color="#FFF" />
                            ) : (
                                <TextHeavy style={styles.submitButtonText}>
                                    {translate('confirm_booking')}
                                </TextHeavy>
                            )}
                        </BtnFull>
                    </View>

                    {/* Success/Error Popup */}
                    {showPopup && (
                        <ErrorSuccessPopup
                            isSuccess={isSuccess}
                            title={title}
                            message={message}
                            onClose={handleClosePopup}
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    } as ViewStyle,
    loadingText: {
        marginTop: 10,
        fontSize: 16,
    } as TextStyle,
    scrollView: {
        flex: 1,
    } as ViewStyle,
    header: {
        paddingHorizontal: 15,
        paddingVertical: 20,
    } as ViewStyle,
    title: {
        fontSize: 24,
    } as TextStyle,
    section: {
        paddingHorizontal: 15,
        paddingVertical: 15,
    } as ViewStyle,
    sectionTitle: {
        fontSize: 18,
        marginBottom: 15,
    } as TextStyle,
    summarySection: {
        marginHorizontal: 15,
        marginVertical: 10,
        padding: 15,
        borderRadius: 8,
        borderWidth: 1,
    } as ViewStyle,
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    } as ViewStyle,
    summaryLabel: {
        fontSize: 14,
    } as TextStyle,
    summaryValue: {
        fontSize: 14,
    } as TextStyle,
    totalRow: {
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        marginTop: 8,
        paddingTop: 8,
    } as ViewStyle,
    inputRow: {
        flexDirection: 'row',
        marginBottom: 15,
    } as ViewStyle,
    inputHalf: {
        flex: 1,
        marginRight: 10,
    } as ViewStyle,
    inputGroup: {
        marginBottom: 15,
    } as ViewStyle,
    inputLabel: {
        fontSize: 14,
        marginBottom: 5,
    } as TextStyle,
    input: {
        height: 45,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 16,
        fontFamily: regularFontFamily,
    } as TextStyle,
    textArea: {
        height: 100,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        fontFamily: regularFontFamily,
        textAlignVertical: 'top',
    } as TextStyle,
    paymentOption: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
    } as ViewStyle,
    paymentOptionContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    } as ViewStyle,
    paymentOptionText: {
        fontSize: 16,
    } as TextStyle,
    bottomActions: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderTopWidth: 1,
    } as ViewStyle,
    cancelButton: {
        flex: 1,
        marginRight: 10,
    } as ViewStyle,
    submitButton: {
        flex: 2,
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
    } as ViewStyle,
    submitButtonText: {
        color: '#FFF',
        fontSize: 16,
    } as TextStyle,
});

// Redux connection
const mapStateToProps = (state: any) => ({
    booking: state.booking,
    user: state.user,
});

export default connect(mapStateToProps)(CheckoutScreen);
