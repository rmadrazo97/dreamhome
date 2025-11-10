import React, { useState, useEffect, useCallback } from 'react';
import { 
    View,
    Image,
    ScrollView,
    TextInput,
    Button,
    TouchableOpacity, 
    StyleSheet,
    Platform,
    ViewStyle,
    TextStyle,
    ImageStyle
} from 'react-native';
import { SafeAreaConsumer } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { connect } from 'react-redux';

import { boldFontFamily } from '../../constants/Colors';
import { translate } from "../../helpers/i18n";
import TextHeavy from '../../components/ui/TextHeavy';
import TextBold from '../../components/ui/TextBold';
import TextMedium from '../../components/ui/TextMedium';
import TextRegular from '../../components/ui/TextRegular';
import BtnLarge from '../../components/ui/BtnLarge';
import BtnFull from '../../components/ui/BtnFull';
import { PhotoSvg } from '../../components/icons/ButtonSvgIcons';
import Loader from '../../components/Loader';
import SuccessPopup from '../../components/SuccessPopup';
import { submitProfile, profileClosePopup } from '../../actions/user';
import { ThemeColors, NavigationProp, User } from '../../types';

// Types
interface EditProfileState {
    focus: string;
    ID: string;
    first_name: string;
    last_name: string;
    display_name: string;
    description: string;
    email: string;
    phone: string;
    website: string;
    address: string;
    company: string;
    date_of_birth: string;
    showDatePicker: boolean;
    dfDate: Date;
    customAvatar: any;
    loading: boolean;
    showSuccess: boolean;
}

interface EditProfileProps {
    navigation: NavigationProp;
    apColors: ThemeColors;
    user: User;
    profile: any;
}

const EditProfile: React.FC<EditProfileProps> = ({ navigation, apColors, user, profile }) => {
    const [state, setState] = useState<EditProfileState>(() => {
        const { ID, avatar, first_name, last_name, display_name, description, email, phone, website, address, company, date_of_birth } = user;
        
        let dfDate = moment(date_of_birth);
        if (dfDate.isValid() === false) {
            dfDate = moment().subtract(18, 'years');
        }
        
        return {
            focus: '',
            ID,
            first_name: first_name || '',
            last_name: last_name || '',
            display_name: display_name || '',
            description: description || '',
            email: email || '',
            phone: phone || '',
            website: website || '',
            address: address || '',
            company: company || '',
            date_of_birth: date_of_birth || '',
            showDatePicker: false,
            dfDate: dfDate.toDate(),
            customAvatar: null,
            loading: false,
            showSuccess: false,
        };
    });

    // Navigation options
    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    const onInputChange = useCallback((name: keyof EditProfileState) => (text: string) => {
        setState(prevState => ({
            ...prevState,
            [name]: text
        }));
    }, []);

    const onFocusInput = useCallback((name: string) => {
        setState(prevState => ({
            ...prevState,
            focus: name
        }));
    }, []);

    const onShowDatePicker = useCallback(() => {
        setState(prevState => ({
            ...prevState,
            focus: 'date_of_birth',
            showDatePicker: true
        }));
    }, []);

    const onHideDatePicker = useCallback(() => {
        setState(prevState => ({
            ...prevState,
            showDatePicker: false
        }));
    }, []);

    const onDateChange = useCallback((event: any, selectedDate?: Date) => {
        const { dfDate } = state;
        const currentDate = selectedDate || dfDate;
        setState(prevState => ({
            ...prevState,
            dfDate: currentDate,
            date_of_birth: moment(currentDate).format('YYYY-MM-DD'),
            showDatePicker: Platform.OS === 'ios' ? true : false
        }));
    }, [state.dfDate]);

    const onShowImagePicker = useCallback(() => {
        const options = {
            title: translate('select_photo'),
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorMessage) {
                console.log('ImagePicker Error: ', response.errorMessage);
            } else if (response.assets && response.assets[0]) {
                const source = { uri: response.assets[0].uri };
                setState(prevState => ({
                    ...prevState,
                    customAvatar: source
                }));
            }
        });
    }, []);

    const onShowCamera = useCallback(() => {
        const options = {
            title: translate('take_photo'),
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };

        launchCamera(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled camera');
            } else if (response.errorMessage) {
                console.log('Camera Error: ', response.errorMessage);
            } else if (response.assets && response.assets[0]) {
                const source = { uri: response.assets[0].uri };
                setState(prevState => ({
                    ...prevState,
                    customAvatar: source
                }));
            }
        });
    }, []);

    const handleSubmit = useCallback(async () => {
        setState(prevState => ({ ...prevState, loading: true }));

        try {
            const profileData = {
                ID: state.ID,
                first_name: state.first_name,
                last_name: state.last_name,
                display_name: state.display_name,
                description: state.description,
                email: state.email,
                phone: state.phone,
                website: state.website,
                address: state.address,
                company: state.company,
                date_of_birth: state.date_of_birth,
                avatar: state.customAvatar,
            };

            const response = await submitProfile(profileData);
            
            if (response.success) {
                setState(prevState => ({
                    ...prevState,
                    loading: false,
                    showSuccess: true
                }));
            } else {
                setState(prevState => ({
                    ...prevState,
                    loading: false
                }));
            }
        } catch (error) {
            console.error('Profile update error:', error);
            setState(prevState => ({
                ...prevState,
                loading: false
            }));
        }
    }, [state]);

    const handleCloseSuccess = useCallback(() => {
        setState(prevState => ({
            ...prevState,
            showSuccess: false
        }));
        profileClosePopup();
        navigation.goBack();
    }, [navigation]);

    const handleBackPress = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const { 
        focus, 
        first_name, 
        last_name, 
        display_name, 
        description, 
        email, 
        phone, 
        website, 
        address, 
        company, 
        date_of_birth, 
        showDatePicker, 
        dfDate, 
        customAvatar, 
        loading, 
        showSuccess 
    } = state;

    return (
        <SafeAreaConsumer>
            {insets => (
                <View style={[styles.container, { 
                    backgroundColor: apColors.appBg,
                    paddingTop: insets.top,
                    paddingLeft: insets.left,
                    paddingRight: insets.right
                }]}>
                    {/* Header */}
                    <View style={[styles.header, { backgroundColor: apColors.secondBg, borderBottomColor: apColors.separator }]}>
                        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                            <TextHeavy style={[styles.backButtonText, { color: apColors.appColor }]}>
                                {translate('cancel')}
                            </TextHeavy>
                        </TouchableOpacity>
                        
                        <TextHeavy style={[styles.headerTitle, { color: apColors.hText }]}>
                            {translate('edit_profile')}
                        </TextHeavy>
                        
                        <TouchableOpacity onPress={handleSubmit} style={styles.saveButton}>
                            <TextHeavy style={[styles.saveButtonText, { color: apColors.appColor }]}>
                                {translate('save')}
                            </TextHeavy>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.scrollView}>
                        {/* Avatar Section */}
                        <View style={[styles.avatarSection, { backgroundColor: apColors.secondBg }]}>
                            <View style={styles.avatarContainer}>
                                {customAvatar ? (
                                    <Image source={customAvatar} style={styles.avatar} />
                                ) : user.avatar ? (
                                    <Image source={{ uri: user.avatar }} style={styles.avatar} />
                                ) : (
                                    <View style={[styles.avatarPlaceholder, { backgroundColor: apColors.separator }]}>
                                        <PhotoSvg color={apColors.addressText} />
                                    </View>
                                )}
                            </View>
                            
                            <View style={styles.avatarActions}>
                                <TouchableOpacity 
                                    style={[styles.avatarButton, { borderColor: apColors.appColor }]}
                                    onPress={onShowImagePicker}
                                >
                                    <TextRegular style={[styles.avatarButtonText, { color: apColors.appColor }]}>
                                        {translate('choose_photo')}
                                    </TextRegular>
                                </TouchableOpacity>
                                
                                <TouchableOpacity 
                                    style={[styles.avatarButton, { borderColor: apColors.appColor }]}
                                    onPress={onShowCamera}
                                >
                                    <TextRegular style={[styles.avatarButtonText, { color: apColors.appColor }]}>
                                        {translate('take_photo')}
                                    </TextRegular>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Form Fields */}
                        <View style={styles.formSection}>
                            {/* First Name */}
                            <View style={styles.inputGroup}>
                                <TextRegular style={[styles.inputLabel, { color: apColors.pText }]}>
                                    {translate('first_name')}
                                </TextRegular>
                                <TextInput
                                    style={[
                                        styles.input,
                                        {
                                            borderColor: focus === 'first_name' ? apColors.appColor : apColors.separator,
                                            color: apColors.regularText,
                                            backgroundColor: apColors.secondBg
                                        }
                                    ]}
                                    value={first_name}
                                    onChangeText={onInputChange('first_name')}
                                    onFocus={() => onFocusInput('first_name')}
                                    placeholder={translate('enter_first_name')}
                                    placeholderTextColor={apColors.fieldLbl}
                                />
                            </View>

                            {/* Last Name */}
                            <View style={styles.inputGroup}>
                                <TextRegular style={[styles.inputLabel, { color: apColors.pText }]}>
                                    {translate('last_name')}
                                </TextRegular>
                                <TextInput
                                    style={[
                                        styles.input,
                                        {
                                            borderColor: focus === 'last_name' ? apColors.appColor : apColors.separator,
                                            color: apColors.regularText,
                                            backgroundColor: apColors.secondBg
                                        }
                                    ]}
                                    value={last_name}
                                    onChangeText={onInputChange('last_name')}
                                    onFocus={() => onFocusInput('last_name')}
                                    placeholder={translate('enter_last_name')}
                                    placeholderTextColor={apColors.fieldLbl}
                                />
                            </View>

                            {/* Display Name */}
                            <View style={styles.inputGroup}>
                                <TextRegular style={[styles.inputLabel, { color: apColors.pText }]}>
                                    {translate('display_name')}
                                </TextRegular>
                                <TextInput
                                    style={[
                                        styles.input,
                                        {
                                            borderColor: focus === 'display_name' ? apColors.appColor : apColors.separator,
                                            color: apColors.regularText,
                                            backgroundColor: apColors.secondBg
                                        }
                                    ]}
                                    value={display_name}
                                    onChangeText={onInputChange('display_name')}
                                    onFocus={() => onFocusInput('display_name')}
                                    placeholder={translate('enter_display_name')}
                                    placeholderTextColor={apColors.fieldLbl}
                                />
                            </View>

                            {/* Email */}
                            <View style={styles.inputGroup}>
                                <TextRegular style={[styles.inputLabel, { color: apColors.pText }]}>
                                    {translate('email')}
                                </TextRegular>
                                <TextInput
                                    style={[
                                        styles.input,
                                        {
                                            borderColor: focus === 'email' ? apColors.appColor : apColors.separator,
                                            color: apColors.regularText,
                                            backgroundColor: apColors.secondBg
                                        }
                                    ]}
                                    value={email}
                                    onChangeText={onInputChange('email')}
                                    onFocus={() => onFocusInput('email')}
                                    placeholder={translate('enter_email')}
                                    placeholderTextColor={apColors.fieldLbl}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>

                            {/* Phone */}
                            <View style={styles.inputGroup}>
                                <TextRegular style={[styles.inputLabel, { color: apColors.pText }]}>
                                    {translate('phone')}
                                </TextRegular>
                                <TextInput
                                    style={[
                                        styles.input,
                                        {
                                            borderColor: focus === 'phone' ? apColors.appColor : apColors.separator,
                                            color: apColors.regularText,
                                            backgroundColor: apColors.secondBg
                                        }
                                    ]}
                                    value={phone}
                                    onChangeText={onInputChange('phone')}
                                    onFocus={() => onFocusInput('phone')}
                                    placeholder={translate('enter_phone')}
                                    placeholderTextColor={apColors.fieldLbl}
                                    keyboardType="phone-pad"
                                />
                            </View>

                            {/* Website */}
                            <View style={styles.inputGroup}>
                                <TextRegular style={[styles.inputLabel, { color: apColors.pText }]}>
                                    {translate('website')}
                                </TextRegular>
                                <TextInput
                                    style={[
                                        styles.input,
                                        {
                                            borderColor: focus === 'website' ? apColors.appColor : apColors.separator,
                                            color: apColors.regularText,
                                            backgroundColor: apColors.secondBg
                                        }
                                    ]}
                                    value={website}
                                    onChangeText={onInputChange('website')}
                                    onFocus={() => onFocusInput('website')}
                                    placeholder={translate('enter_website')}
                                    placeholderTextColor={apColors.fieldLbl}
                                    keyboardType="url"
                                    autoCapitalize="none"
                                />
                            </View>

                            {/* Address */}
                            <View style={styles.inputGroup}>
                                <TextRegular style={[styles.inputLabel, { color: apColors.pText }]}>
                                    {translate('address')}
                                </TextRegular>
                                <TextInput
                                    style={[
                                        styles.input,
                                        {
                                            borderColor: focus === 'address' ? apColors.appColor : apColors.separator,
                                            color: apColors.regularText,
                                            backgroundColor: apColors.secondBg
                                        }
                                    ]}
                                    value={address}
                                    onChangeText={onInputChange('address')}
                                    onFocus={() => onFocusInput('address')}
                                    placeholder={translate('enter_address')}
                                    placeholderTextColor={apColors.fieldLbl}
                                />
                            </View>

                            {/* Company */}
                            <View style={styles.inputGroup}>
                                <TextRegular style={[styles.inputLabel, { color: apColors.pText }]}>
                                    {translate('company')}
                                </TextRegular>
                                <TextInput
                                    style={[
                                        styles.input,
                                        {
                                            borderColor: focus === 'company' ? apColors.appColor : apColors.separator,
                                            color: apColors.regularText,
                                            backgroundColor: apColors.secondBg
                                        }
                                    ]}
                                    value={company}
                                    onChangeText={onInputChange('company')}
                                    onFocus={() => onFocusInput('company')}
                                    placeholder={translate('enter_company')}
                                    placeholderTextColor={apColors.fieldLbl}
                                />
                            </View>

                            {/* Date of Birth */}
                            <View style={styles.inputGroup}>
                                <TextRegular style={[styles.inputLabel, { color: apColors.pText }]}>
                                    {translate('date_of_birth')}
                                </TextRegular>
                                <TouchableOpacity
                                    style={[
                                        styles.input,
                                        styles.dateInput,
                                        {
                                            borderColor: focus === 'date_of_birth' ? apColors.appColor : apColors.separator,
                                            backgroundColor: apColors.secondBg
                                        }
                                    ]}
                                    onPress={onShowDatePicker}
                                >
                                    <TextRegular style={[styles.dateText, { color: apColors.regularText }]}>
                                        {date_of_birth || translate('select_date')}
                                    </TextRegular>
                                </TouchableOpacity>
                            </View>

                            {/* Description */}
                            <View style={styles.inputGroup}>
                                <TextRegular style={[styles.inputLabel, { color: apColors.pText }]}>
                                    {translate('description')}
                                </TextRegular>
                                <TextInput
                                    style={[
                                        styles.textArea,
                                        {
                                            borderColor: focus === 'description' ? apColors.appColor : apColors.separator,
                                            color: apColors.regularText,
                                            backgroundColor: apColors.secondBg
                                        }
                                    ]}
                                    value={description}
                                    onChangeText={onInputChange('description')}
                                    onFocus={() => onFocusInput('description')}
                                    placeholder={translate('enter_description')}
                                    placeholderTextColor={apColors.fieldLbl}
                                    multiline
                                    numberOfLines={4}
                                />
                            </View>
                        </View>
                    </ScrollView>

                    {/* Date Picker Modal */}
                    {showDatePicker && (
                        <DateTimePicker
                            value={dfDate}
                            mode="date"
                            display="default"
                            onChange={onDateChange}
                        />
                    )}

                    {/* Loading Overlay */}
                    {loading && (
                        <View style={styles.loadingOverlay}>
                            <Loader />
                        </View>
                    )}

                    {/* Success Popup */}
                    {showSuccess && (
                        <SuccessPopup
                            title={translate('profile_updated')}
                            message={translate('profile_updated_successfully')}
                            onClose={handleCloseSuccess}
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
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderBottomWidth: 1,
    },
    backButton: {
        padding: 5,
    },
    backButtonText: {
        fontSize: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    saveButton: {
        padding: 5,
    },
    saveButtonText: {
        fontSize: 16,
    },
    scrollView: {
        flex: 1,
    },
    avatarSection: {
        alignItems: 'center',
        paddingVertical: 30,
        paddingHorizontal: 20,
    },
    avatarContainer: {
        marginBottom: 20,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarActions: {
        flexDirection: 'row',
        gap: 15,
    },
    avatarButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderWidth: 1,
        borderRadius: 20,
    },
    avatarButtonText: {
        fontSize: 14,
    },
    formSection: {
        padding: 20,
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
        fontFamily: boldFontFamily,
    },
    dateInput: {
        justifyContent: 'center',
    },
    dateText: {
        fontSize: 16,
        fontFamily: boldFontFamily,
    },
    textArea: {
        height: 100,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 10,
        fontSize: 16,
        fontFamily: boldFontFamily,
        textAlignVertical: 'top',
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

// Redux connection
const mapStateToProps = (state: any) => ({
    user: state.user,
    profile: state.profile,
});

export default connect(mapStateToProps)(EditProfile);