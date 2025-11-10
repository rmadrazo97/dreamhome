import React, { useState, useCallback } from 'react';
import { ThemeColors, NavigationProp } from '../../types';
import { 
    View,
    TextInput,
    ScrollView, 
    StyleSheet,
    Keyboard,
    ViewStyle,
    TextStyle,
} from 'react-native';
import { SafeAreaConsumer } from 'react-native-safe-area-context';
import { translate } from "../../helpers/i18n";
import { boldFontFamily } from "../../constants/Colors";
import BtnFull from '../../components/ui/BtnFull';
import BtnLarge from '../../components/ui/BtnLarge';
import TextRegular from '../../components/ui/TextRegular';
import TextHeavy from '../../components/ui/TextHeavy';
import Loader from '../../components/Loader';
import SuccessPopup from '../../components/SuccessPopup';
import { submitClaim } from '../../actions/listing';
import { connect } from 'react-redux';
import { AppState } from '../../types';

// Types
interface ListingData {
    ID: number;
    title: string;
    submitting: boolean;
    submitted: boolean;
    submitError: boolean;
    submittedMsg: string;
}

interface UserData {
    ID: number;
    [key: string]: any;
}

interface ClaimScreenProps {
    navigation: NavigationProp;
    apColors: ThemeColors;
    user: UserData;
    listing: ListingData;
    submitClaim: (data: any) => void;
}

interface ClaimState {
    details: string;
    validate: boolean;
    comSubmitted: boolean;
    popTitle: string;
    popMessage: string;
}

const ClaimScreen: React.FC<ClaimScreenProps> = ({
    navigation,
    apColors,
    user,
    listing,
    submitClaim
}) => {
    const [state, setState] = useState<ClaimState>({
        details: '',
        validate: true,
        comSubmitted: false,
        popTitle: '',
        popMessage: '',
    });

    const onInputChange = useCallback((name: keyof ClaimState) => (text: string) => {
        setState(prevState => ({
            ...prevState,
            [name]: text
        }));
    }, []);

    const hideKeyboard = useCallback(() => {
        Keyboard.dismiss();
    }, []);

    const onSubmit = useCallback(() => {
        const { details } = state;
        
        let popTitle = '';
        let popMessage = '';
        
        if (details.length < 30) {
            popTitle = translate('claim', 'title_wrong', {});
            popMessage = translate('claim', 'details_length', {});
            setState(prevState => ({ ...prevState, validate: false, popTitle, popMessage }));
            return;
        }

        submitClaim({
            listing_id: listing.ID,
            claim_message: details,
            user_id: user.ID
        });
        
        setState(prevState => ({ ...prevState, comSubmitted: true, validate: true }));
    }, [state, listing.ID, user.ID, submitClaim]);

    const errorButton = useCallback(() => (
        <BtnLarge 
            disabled={false} 
            style={styles.errorButton} 
            onPress={() => setState(prevState => ({ ...prevState, validate: true }))}
        >
            {translate('claim', 'try_again', {})}
        </BtnLarge>
    ), []);

    const successButton = useCallback(() => (
        <BtnLarge 
            disabled={false} 
            style={styles.successButton} 
            onPress={() => navigation.goBack()}
        >
            {translate('claim', 'done', {})}
        </BtnLarge>
    ), [navigation]);

    const {
        details,
        validate,
        popTitle,
        popMessage,
        comSubmitted
    } = state;

    const { submitting, submitted, submitError, submittedMsg } = listing;
    const submittedBtn = submitting ? { opacity: 0.2 } : {};

    const finalPopTitle = submitted 
        ? (submitError ? translate('claim', 'title_wrong', {}) : translate('claim', 'title_ok', {}))
        : popTitle;
    
    const finalPopMessage = submitted ? submittedMsg : popMessage;

    return (
        <SafeAreaConsumer>
            {insets => (
                <View style={[
                    styles.container,
                    {
                        backgroundColor: apColors.appBg,
                        paddingBottom: insets.bottom,
                        paddingLeft: insets.left,
                        paddingRight: insets.right
                    }
                ]}>
                    {submitting && <Loader loading={true} />}

                    <SuccessPopup 
                        visible={!validate} 
                        title={popTitle} 
                        message={popMessage} 
                        buttons={errorButton()} 
                    />
                    <SuccessPopup 
                        visible={comSubmitted && submitted} 
                        title={finalPopTitle} 
                        message={finalPopMessage} 
                        buttons={successButton()} 
                    />

                    <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
                        <View style={styles.formWrap}>
                            <TextRegular style={[styles.claimIntro, { color: apColors.pText }]}>
                                {translate('claim', 'intro', {})}
                            </TextRegular>
                            
                            <TextRegular style={[styles.fieldLabel, { color: apColors.fieldLbl }]}>
                                {translate('claim', 'details', {})}
                            </TextRegular>
                            <TextInput 
                                style={[styles.textInput, { borderColor: apColors.separator, color: apColors.pText, minHeight: 85 }]}
                                onChangeText={onInputChange('details')}
                                autoCorrect={true}
                                underlineColorAndroid="transparent"
                                autoCapitalize="none"
                                autoComplete="off"
                                value={details}
                                multiline={true}
                            />

                            <View style={styles.listingDetails}>
                                <TextHeavy style={[styles.listingTitle, { color: apColors.tText }]}>
                                    {translate('claim', 'listing', { title: listing.title })}
                                </TextHeavy>
                            </View>
                        </View>
                    </ScrollView>
                    
                    <View style={styles.submitWrap}>
                        <BtnFull 
                            disabled={submitting} 
                            style={submittedBtn} 
                            onPress={onSubmit}
                        >
                            {translate('claim', 'send_claim', {})}
                        </BtnFull>
                    </View>
                </View>
            )}
        </SafeAreaConsumer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    } as ViewStyle,
    scrollView: {
        flex: 1,
    } as ViewStyle,
    contentContainer: {
        paddingVertical: 20,
        paddingHorizontal: 15,
    } as ViewStyle,
    formWrap: {
        // Form wrapper styles
    } as ViewStyle,
    claimIntro: {
        fontSize: 17,
        lineHeight: 22,
        marginTop: 20,
    } as TextStyle,
    fieldLabel: {
        fontSize: 17,
        lineHeight: 22,
        marginTop: 20,
    } as TextStyle,
    textInput: {
        height: 35,
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderStyle: 'solid',
        fontSize: 17,
        fontFamily: boldFontFamily,
    } as TextStyle,
    listingDetails: {
        marginTop: 35,
    } as ViewStyle,
    listingTitle: {
        fontSize: 17,
        lineHeight: 22,
    } as TextStyle,
    submitWrap: {
        height: 60,
        paddingTop: 5,
        paddingHorizontal: 30,
    } as ViewStyle,
    errorButton: {
        marginTop: 30,
    } as ViewStyle,
    successButton: {
        marginTop: 30,
    } as ViewStyle,
});

// Map the redux state to your props
const mapStateToProps = (state: AppState) => ({
    user: state.user,
    listing: state.listings || {} as any,
});

// Map your action creators to your props
const mapDispatchToProps = {
    submitClaim
};

// Export the connected component
export default connect(mapStateToProps, mapDispatchToProps)(ClaimScreen);