import React, { useState, useCallback, useMemo } from 'react';
import { ThemeColors, NavigationProp } from '../../types';
import { 
    View,
    TextInput,
    ScrollView, 
    StyleSheet,
    ViewStyle,
    TextStyle,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { SafeAreaConsumer } from 'react-native-safe-area-context';
import { connect } from 'react-redux';
import { formatNumber } from '../../helpers/currency';
import { translate } from "../../helpers/i18n";
import { validateEmail } from "../../helpers/helpers";
import { boldFontFamily } from "../../constants/Colors";
import BtnFull from '../../components/ui/BtnFull';
import BtnLarge from '../../components/ui/BtnLarge';
import TextRegular from '../../components/ui/TextRegular';
import TextBold from '../../components/ui/TextBold';
import Loader from '../../components/Loader';
import SuccessPopup from '../../components/SuccessPopup';
import { submitReview, reviewClosePopup } from '../../actions/listing';
import { AppState } from '../../types';

// Types
interface ReviewField {
    name: string;
    title: string;
    base: number;
    default: number;
}

interface ListingData {
    ID: number;
    reviewFields: ReviewField[];
    submitting: boolean;
    submitted: boolean;
    submitError: boolean;
}

interface UserData {
    isLoggedIn: boolean;
    display_name: string;
    registered_email: string;
    ID: number;
}

interface CommentsScreenProps {
    navigation: NavigationProp;
    apColors: ThemeColors;
    user: UserData;
    listing: ListingData;
    submitReview: (data: any) => void;
    reviewClosePopup: () => void;
}

interface CommentsState {
    name: string;
    email: string;
    comment: string;
    criteria: { [key: string]: number };
    validate: boolean;
    comSubmitted: boolean;
    popTitle: string;
    popMessage: string;
}

const CommentsScreen: React.FC<CommentsScreenProps> = ({
    navigation,
    apColors,
    user,
    listing,
    submitReview,
    reviewClosePopup
}) => {
    const { reviewFields } = listing;
    
    const initialCriteria = useMemo(() => {
        const criteria: { [key: string]: number } = {};
        if (reviewFields && Array.isArray(reviewFields) && reviewFields.length) {
            reviewFields.forEach(rfield => {
                criteria[rfield.name] = rfield.default;
            });
        }
        return criteria;
    }, [reviewFields]);

    const [state, setState] = useState<CommentsState>({
        name: '',
        email: '',
        comment: '',
        criteria: initialCriteria,
        validate: true,
        comSubmitted: false,
        popTitle: '',
        popMessage: '',
    });

    const setReviewCriteria = useCallback((name: string, val: number) => {
        setState(prevState => ({
            ...prevState,
            criteria: {
                ...prevState.criteria,
                [name]: val
            }
        }));
    }, []);

    const onInputChange = useCallback((name: keyof CommentsState) => (text: string) => {
        setState(prevState => ({
            ...prevState,
            [name]: text
        }));
    }, []);


    const onSubmit = useCallback(() => {
        const {
            name,
            email,
            comment,
            criteria,
        } = state;

        const { isLoggedIn, display_name, registered_email, ID } = user;
        let finalName = name;
        let finalEmail = email;

        if (isLoggedIn) {
            finalName = display_name;
            finalEmail = registered_email;
        }

        let popTitle = '';
        let popMessage = '';

        if (finalName.length < 3) {
            popTitle = translate('reviews', 'title_wrong', {});
            popMessage = translate('reviews', 'name_length', {});
            setState(prevState => ({ ...prevState, validate: false, popTitle, popMessage }));
            return;
        }

        if (finalEmail.length < 3) {
            popTitle = translate('reviews', 'title_wrong', {});
            popMessage = translate('reviews', 'email_length', {});
            setState(prevState => ({ ...prevState, validate: false, popTitle, popMessage }));
            return;
        }

        if (!validateEmail(finalEmail)) {
            popTitle = translate('reviews', 'title_wrong', {});
            popMessage = translate('reviews', 'email_wrong', {});
            setState(prevState => ({ ...prevState, validate: false, popTitle, popMessage }));
            return;
        }

        if (comment.length < 30) {
            popTitle = translate('reviews', 'title_wrong', {});
            popMessage = translate('reviews', 'review_length', {});
            setState(prevState => ({ ...prevState, validate: false, popTitle, popMessage }));
            return;
        }

        submitReview({
            comment_author: finalName,
            comment_author_email: finalEmail,
            comment_content: comment,
            user_id: ID,
            comment_post_ID: listing.ID,
            reviewCriteria: criteria,
        });

        setState(prevState => ({ ...prevState, comSubmitted: true, validate: true }));
    }, [state, user, listing.ID, submitReview]);

    const errorButton = useCallback(() => (
        <BtnLarge 
            disabled={false} 
            style={styles.errorButton} 
            onPress={() => setState(prevState => ({ ...prevState, validate: true }))}
        >
            {translate('reviews', 'try_again', {})}
        </BtnLarge>
    ), []);

    const successButton = useCallback(() => (
        <BtnLarge 
            disabled={false} 
            style={styles.successButton} 
            onPress={() => {
                reviewClosePopup();
                navigation.goBack();
            }}
        >
            {translate('reviews', 'done', {})}
        </BtnLarge>
    ), [reviewClosePopup, navigation]);

    const {
        name,
        email,
        comment,
        criteria,
        validate,
        popTitle,
        popMessage,
        comSubmitted
    } = state;

    const { isLoggedIn, display_name, registered_email } = user;
    const editable = !isLoggedIn;
    const finalName = isLoggedIn ? display_name : name;
    const finalEmail = isLoggedIn ? registered_email : email;

    const {
        submitting,
        submitted,
        submitError,
    } = listing;

    const submittedBtn = submitting ? { opacity: 0.2 } : {};

    const smpopTitle = submitError 
        ? translate('reviews', 'title_wrong', {})
        : translate('reviews', 'title_ok', {});
    
    const smpopMessage = submitError 
        ? translate('reviews', 'message_wrong', {})
        : translate('reviews', 'message_ok', {});

    const criteriaJsx = useMemo(() => {
        const jsx: React.ReactNode[] = [];
        let totalScore = 0;

        if (reviewFields && Array.isArray(reviewFields) && reviewFields.length) {
            reviewFields.forEach((dtbj, idx) => {
                jsx.push(
                    <View key={idx} style={styles.criteriaItem}>
                        <TextRegular style={[styles.criteriaLabel, { color: apColors.tText }]}>
                            {dtbj.title}
                        </TextRegular>
                        <Slider
                            value={criteria[dtbj.name]}
                            onValueChange={val => setReviewCriteria(dtbj.name, val)}
                            style={styles.slider}
                            step={1}
                            minimumValue={1}
                            maximumValue={dtbj.base}
                            minimumTrackTintColor={apColors.appColor}
                            maximumTrackTintColor="#EAECEF"
                        />
                    </View>
                );
                totalScore += criteria[dtbj.name];
            });
        }

        return { jsx, totalScore };
    }, [reviewFields, criteria, apColors.tText, apColors.appColor, setReviewCriteria]);

    const averageScore = criteriaJsx.jsx.length > 0 
        ? formatNumber(criteriaJsx.totalScore / criteriaJsx.jsx.length) 
        : '0';

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
                        title={smpopTitle} 
                        message={smpopMessage} 
                        buttons={successButton()} 
                    />

                    <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
                        <View style={styles.formWrap}>
                            <View style={styles.reviewsTop}>
                                <View style={styles.reviewsTopLeft}>
                                    <View style={[styles.reviewScore, { backgroundColor: apColors.appColor }]}>
                                        <TextBold style={styles.scoreText}>
                                            {averageScore}
                                        </TextBold>
                                    </View>
                                </View>
                                <View style={styles.reviewsTopRight}>
                                    {criteriaJsx.jsx}
                                </View>
                            </View>

                            <TextRegular style={[styles.fieldLabel, { color: apColors.fieldLbl }]}>
                                {translate('reviews', 'yname', {})}
                            </TextRegular>
                            <TextInput 
                                style={[styles.textInput, { borderColor: apColors.separator, color: apColors.pText }]}
                                onChangeText={onInputChange('name')}
                                returnKeyType="next"
                                underlineColorAndroid="transparent"
                                textContentType="name"
                                value={finalName}
                                editable={editable}
                            />

                            <TextRegular style={[styles.fieldLabel, { color: apColors.fieldLbl, marginTop: 40 }]}>
                                {translate('reviews', 'yemail', {})}
                            </TextRegular>
                            <TextInput 
                                style={[styles.textInput, { borderColor: apColors.separator, color: apColors.pText }]}
                                onChangeText={onInputChange('email')}
                                returnKeyType="next"
                                underlineColorAndroid="transparent"
                                keyboardType="email-address"
                                textContentType="emailAddress"
                                value={finalEmail}
                                editable={editable}
                            />

                            <TextRegular style={[styles.fieldLabel, { color: apColors.fieldLbl, marginTop: 40 }]}>
                                {translate('reviews', 'ycomment', {})}
                            </TextRegular>
                            <TextInput 
                                style={[styles.textInput, { borderColor: apColors.separator, color: apColors.pText, minHeight: 85 }]}
                                onChangeText={onInputChange('comment')}
                                autoCorrect={true}
                                underlineColorAndroid="transparent"
                                autoCapitalize="none"
                                autoComplete="off"
                                value={comment}
                                multiline={true}
                            />
                        </View>
                    </ScrollView>
                    
                    <View style={styles.submitWrap}>
                        <BtnFull 
                            disabled={submitting} 
                            style={submittedBtn} 
                            onPress={onSubmit}
                        >
                            {translate('reviews', 'send_comment', {})}
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
    reviewsTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    } as ViewStyle,
    reviewsTopLeft: {
        width: 85,
    } as ViewStyle,
    reviewsTopRight: {
        flex: 1,
    } as ViewStyle,
    reviewScore: {
        width: 70,
        height: 60,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center'
    } as ViewStyle,
    scoreText: {
        color: '#FFF',
        fontSize: 24,
    } as TextStyle,
    criteriaItem: {
        marginBottom: 15,
    } as ViewStyle,
    criteriaLabel: {
        marginBottom: 5,
        fontSize: 15,
    } as TextStyle,
    slider: {
        height: 40,
        width: '100%',
        flex: 1,
    } as ViewStyle,
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
    submitReview,
    reviewClosePopup
};

// Export the connected component
export default connect(mapStateToProps, mapDispatchToProps)(CommentsScreen);