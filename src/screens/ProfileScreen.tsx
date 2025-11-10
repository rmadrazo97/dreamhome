import React, { useState, useCallback } from 'react';
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
    TextStyle,
    ImageStyle
} from 'react-native';
import { SafeAreaConsumer } from 'react-native-safe-area-context';
import { connect } from 'react-redux';

import { translate } from "../helpers/i18n";
import SignInScreen from './profile/SignIn';
import BtnLarge from '../components/ui/BtnLarge';
import TextBold from '../components/ui/TextBold';
import TextMedium from '../components/ui/TextMedium';
import TextRegular from '../components/ui/TextRegular';
import {
    GoDetailsSvg,
    ArrowDetailsSvg,
    NotificationsSvg,
    CardsSvg,
    LanguageSvg,
    CurrencySvg,
    TermsSvg,
    PrivacySvg,
    HelpCenterSvg,
    AboutUsSvg,
    ChatProfileSvg,
} from '../components/icons/ButtonSvgIcons';
import { logOut } from '../helpers/user';
import { ThemeColors, User, SiteData, NavigationProp } from '../types';

// Types
interface ProfileScreenState {
    data: any[];
}

interface ProfileScreenProps {
    navigation: NavigationProp;
    apColors: ThemeColors;
    user: User;
    site: SiteData;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation, apColors, user, site }) => {
    const [state, setState] = useState<ProfileScreenState>({
        data: []
    });

    const handleLogOut = useCallback(() => {
        logOut();
        navigation.navigate('Home');
    }, [navigation]);

    const handleEditProfile = useCallback(() => {
        navigation.navigate('EditProfile');
    }, [navigation]);

    const handleNotifications = useCallback(() => {
        navigation.navigate('Notifications');
    }, [navigation]);

    const handleBookings = useCallback(() => {
        navigation.navigate('Bookings');
    }, [navigation]);

    const handleBookmarks = useCallback(() => {
        navigation.navigate('Bookmarks');
    }, [navigation]);

    const handleLanguage = useCallback(() => {
        navigation.navigate('Language');
    }, [navigation]);

    const handleCurrency = useCallback(() => {
        navigation.navigate('Currency');
    }, [navigation]);

    const handleTerms = useCallback(() => {
        // Handle terms navigation
        console.log('Navigate to terms');
    }, []);

    const handlePrivacy = useCallback(() => {
        // Handle privacy navigation
        console.log('Navigate to privacy');
    }, []);

    const handleHelp = useCallback(() => {
        // Handle help navigation
        console.log('Navigate to help');
    }, []);

    const handleAbout = useCallback(() => {
        // Handle about navigation
        console.log('Navigate to about');
    }, []);

    const handleChat = useCallback(() => {
        const rootNavigation = navigation.getParent()?.getParent();
        if (rootNavigation) {
            rootNavigation.navigate('ChatStack', { screen: 'Chat' });
        } else {
            navigation.navigate('ChatStack' as any, { screen: 'Chat' } as any);
        }
    }, [navigation]);

    const { isLoggedIn, avatar, display_name, role_name } = user;
    const { terms_page, policy_page, help_page, about_page } = site;

    if (!isLoggedIn) {
        return <SignInScreen navigation={navigation} apColors={apColors} />;
    }

    return (
        <SafeAreaConsumer>
            {insets => (
                <View style={[styles.container, {
                    backgroundColor: apColors.secondBg,
                    paddingTop: insets.top,
                    paddingLeft: insets.left,
                    paddingRight: insets.right
                }]}>
                    <ScrollView
                        style={{ flex: 1 }}
                        contentContainerStyle={{ backgroundColor: apColors.appBg }}
                    >
                        {/* Profile Header */}
                        <TouchableOpacity 
                            style={[styles.headerSection, {
                                backgroundColor: apColors.secondBg,
                                borderBottomColor: apColors.separator,
                            }]} 
                            onPress={handleEditProfile}
                        >
                            {avatar && (
                                <Image
                                    source={{ uri: avatar }}
                                    style={styles.avatar}
                                    resizeMode="cover"
                                />
                            )}
                            <View style={styles.detailsWrap}>
                                <View style={styles.authorWrap}>
                                    <TextBold style={[styles.authorName, { color: apColors.hText }]}>
                                        {display_name}
                                    </TextBold>
                                    <GoDetailsSvg style={{ marginLeft: 10, marginBottom: 4 }} />
                                </View>
                                <View style={[styles.authorRole, { backgroundColor: apColors.appColor }]}>
                                    <TextMedium style={styles.authorRoleText}>
                                        {role_name}
                                    </TextMedium>
                                </View>
                            </View>
                        </TouchableOpacity>

                        {/* Menu Items */}
                        <View style={styles.menusWrap}>
                            {/* Notifications */}
                            <TouchableOpacity 
                                style={[styles.menuItem, { borderBottomColor: apColors.separator }]}
                                onPress={handleNotifications}
                            >
                                <View style={styles.menuLeft}>
                                    <NotificationsSvg color={apColors.regularText} />
                                    <TextRegular style={[styles.menuText, { color: apColors.regularText }]}>
                                        {translate('notifications')}
                                    </TextRegular>
                                </View>
                                <ArrowDetailsSvg color={apColors.addressText} />
                            </TouchableOpacity>

                            {/* Bookings */}
                            <TouchableOpacity 
                                style={[styles.menuItem, { borderBottomColor: apColors.separator }]}
                                onPress={handleBookings}
                            >
                                <View style={styles.menuLeft}>
                                    <CardsSvg color={apColors.regularText} />
                                    <TextRegular style={[styles.menuText, { color: apColors.regularText }]}>
                                        {translate('my_bookings')}
                                    </TextRegular>
                                </View>
                                <ArrowDetailsSvg color={apColors.addressText} />
                            </TouchableOpacity>

                            {/* Bookmarks */}
                            <TouchableOpacity 
                                style={[styles.menuItem, { borderBottomColor: apColors.separator }]}
                                onPress={handleBookmarks}
                            >
                                <View style={styles.menuLeft}>
                                    <CardsSvg color={apColors.regularText} />
                                    <TextRegular style={[styles.menuText, { color: apColors.regularText }]}>
                                        {translate('bookmarks')}
                                    </TextRegular>
                                </View>
                                <ArrowDetailsSvg color={apColors.addressText} />
                            </TouchableOpacity>

                            {/* Language */}
                            <TouchableOpacity 
                                style={[styles.menuItem, { borderBottomColor: apColors.separator }]}
                                onPress={handleLanguage}
                            >
                                <View style={styles.menuLeft}>
                                    <LanguageSvg color={apColors.regularText} />
                                    <TextRegular style={[styles.menuText, { color: apColors.regularText }]}>
                                        {translate('language')}
                                    </TextRegular>
                                </View>
                                <ArrowDetailsSvg color={apColors.addressText} />
                            </TouchableOpacity>

                            {/* Currency */}
                            <TouchableOpacity 
                                style={[styles.menuItem, { borderBottomColor: apColors.separator }]}
                                onPress={handleCurrency}
                            >
                                <View style={styles.menuLeft}>
                                    <CurrencySvg color={apColors.regularText} />
                                    <TextRegular style={[styles.menuText, { color: apColors.regularText }]}>
                                        {translate('currency')}
                                    </TextRegular>
                                </View>
                                <ArrowDetailsSvg color={apColors.addressText} />
                            </TouchableOpacity>

                            {/* Chat */}
                            <TouchableOpacity 
                                style={[styles.menuItem, { borderBottomColor: apColors.separator }]}
                                onPress={handleChat}
                            >
                                <View style={styles.menuLeft}>
                                    <ChatProfileSvg color={apColors.regularText} />
                                    <TextRegular style={[styles.menuText, { color: apColors.regularText }]}>
                                        {translate('chat')}
                                    </TextRegular>
                                </View>
                                <ArrowDetailsSvg color={apColors.addressText} />
                            </TouchableOpacity>
                        </View>

                        {/* Legal Section */}
                        <View style={styles.legalWrap}>
                            <TextRegular style={[styles.legalTitle, { color: apColors.addressText }]}>
                                {translate('legal')}
                            </TextRegular>

                            {/* Terms */}
                            {terms_page && (
                                <TouchableOpacity 
                                    style={[styles.legalItem, { borderBottomColor: apColors.separator }]}
                                    onPress={handleTerms}
                                >
                                    <View style={styles.menuLeft}>
                                        <TermsSvg color={apColors.regularText} />
                                        <TextRegular style={[styles.menuText, { color: apColors.regularText }]}>
                                            {translate('terms_conditions')}
                                        </TextRegular>
                                    </View>
                                    <ArrowDetailsSvg color={apColors.addressText} />
                                </TouchableOpacity>
                            )}

                            {/* Privacy */}
                            {policy_page && (
                                <TouchableOpacity 
                                    style={[styles.legalItem, { borderBottomColor: apColors.separator }]}
                                    onPress={handlePrivacy}
                                >
                                    <View style={styles.menuLeft}>
                                        <PrivacySvg color={apColors.regularText} />
                                        <TextRegular style={[styles.menuText, { color: apColors.regularText }]}>
                                            {translate('privacy_policy')}
                                        </TextRegular>
                                    </View>
                                    <ArrowDetailsSvg color={apColors.addressText} />
                                </TouchableOpacity>
                            )}

                            {/* Help */}
                            {help_page && (
                                <TouchableOpacity 
                                    style={[styles.legalItem, { borderBottomColor: apColors.separator }]}
                                    onPress={handleHelp}
                                >
                                    <View style={styles.menuLeft}>
                                        <HelpCenterSvg color={apColors.regularText} />
                                        <TextRegular style={[styles.menuText, { color: apColors.regularText }]}>
                                            {translate('help_center')}
                                        </TextRegular>
                                    </View>
                                    <ArrowDetailsSvg color={apColors.addressText} />
                                </TouchableOpacity>
                            )}

                            {/* About */}
                            {about_page && (
                                <TouchableOpacity 
                                    style={[styles.legalItem, { borderBottomColor: apColors.separator }]}
                                    onPress={handleAbout}
                                >
                                    <View style={styles.menuLeft}>
                                        <AboutUsSvg color={apColors.regularText} />
                                        <TextRegular style={[styles.menuText, { color: apColors.regularText }]}>
                                            {translate('about_us')}
                                        </TextRegular>
                                    </View>
                                    <ArrowDetailsSvg color={apColors.addressText} />
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* Logout Button */}
                        <View style={styles.logoutWrap}>
                            <BtnLarge 
                                bordered 
                                disabled={false} 
                                style={styles.logoutButton} 
                                onPress={handleLogOut}
                            >
                                {translate('logout')}
                            </BtnLarge>
                        </View>
                    </ScrollView>
                </View>
            )}
        </SafeAreaConsumer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    } as ViewStyle,
    headerSection: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderBottomWidth: 1,
    } as ViewStyle,
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 15,
    } as ImageStyle,
    detailsWrap: {
        flex: 1,
    } as ViewStyle,
    authorWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    } as ViewStyle,
    authorName: {
        fontSize: 20,
    } as TextStyle,
    authorRole: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
    } as ViewStyle,
    authorRoleText: {
        color: '#FFF',
        fontSize: 12,
    } as TextStyle,
    menusWrap: {
        marginTop: 20,
    } as ViewStyle,
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
    } as ViewStyle,
    menuLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    } as ViewStyle,
    menuText: {
        fontSize: 16,
        marginLeft: 15,
    } as TextStyle,
    legalWrap: {
        marginTop: 30,
        paddingHorizontal: 20,
    } as ViewStyle,
    legalTitle: {
        fontSize: 14,
        marginBottom: 15,
        textTransform: 'uppercase',
    } as TextStyle,
    legalItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        borderBottomWidth: 1,
    } as ViewStyle,
    logoutWrap: {
        paddingHorizontal: 20,
        paddingVertical: 30,
    } as ViewStyle,
    logoutButton: {
        alignSelf: 'center',
    } as ViewStyle,
});

// Redux connection
const mapStateToProps = (state: any) => ({
    user: state.user,
    site: state.site,
});

export default connect(mapStateToProps)(ProfileScreen);
