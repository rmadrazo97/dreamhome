import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ThemeColors, NavigationProp } from '../types';
import {
    Image,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    View,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaConsumer } from 'react-native-safe-area-context';

import HTML from 'react-native-render-html';
import moment from 'moment';

import BackButton from '../components/inners/BackButton';
import { translate } from "../helpers/i18n";
import { regularFontFamily } from '../constants/Colors';
import NavTitle from '../components/ui/NavTitle';
import TextHeavy from '../components/ui/TextHeavy';
import TextRegular from '../components/ui/TextRegular';

// for redux
import { getContacts } from '../actions/chat';
import { connect } from 'react-redux';

// Types
interface Contact {
    cid: string;
    crid: string;
    display_name: string;
    touid: string;
    user_one: string;
    avatar_url?: string;
    reply?: string;
    crtime: number;
}

interface ChatState {
    data: Contact[];
}

interface ChatScreenProps {
    navigation: NavigationProp;
    apColors: ThemeColors;
    user: {
        ID: string;
    };
    chat: {
        contacts: Contact[];
        loading: boolean;
        loaded: boolean;
    };
    getContacts: (userId: string) => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ 
    navigation, 
    apColors, 
    user, 
    chat, 
    getContacts 
}) => {
    const [state, setState] = useState<ChatState>({
        data: []
    });

    useEffect(() => {
        const { loaded } = chat;
        if (!loaded) {
            getContacts(user.ID);
        }
    }, [chat.loaded, getContacts, user.ID]);

    const onGoBack = useCallback(() => {
        const backRoute = navigation.getParam?.('backRoute') || 'Home';
        navigation.navigate(backRoute);
    }, [navigation]);

    const renderHeader = useCallback((cstyle = {}) => {
        return (
            <View style={[
                styles.navBar,
                { backgroundColor: apColors.appBg },
                apColors.headerNavStyle,
                cstyle
            ]}>
                <BackButton 
                    color={apColors.backBtn} 
                    style={styles.backButton} 
                    onPress={onGoBack} 
                />
                <NavTitle title={translate('chat', 'hTitle')} />
                <TextHeavy style={[styles.headerTitle, apColors.headerTitleStyle]}>
                    {translate('chat', 'hTitle')}
                </TextHeavy>
                <View style={styles.headerSpacer} />
            </View>
        );
    }, [apColors, onGoBack]);

    const onSelect = useCallback((reply: Contact) => {
        const { cid, crid, display_name, touid, user_one } = reply;
        navigation.navigate('ReplyNew', { 
            cid, 
            crid, 
            display_name, 
            touid, 
            fuid: user_one 
        });
    }, [navigation]);

    const onRefresh = useCallback(() => {
        getContacts(user.ID);
    }, [getContacts, user.ID]);

    const { contacts, loading } = chat;

    const renderContact = useCallback(({ item }: { item: Contact }) => (
        <ContactItem
            id={item.cid}
            contact={item}
            onSelect={() => onSelect(item)}
            apColors={apColors}
        />
    ), [onSelect, apColors]);

    const renderEmptyComponent = useCallback(() => (
        <View style={styles.listEmpty}>
            <TextRegular style={[
                styles.emptyText,
                { color: apColors.lMoreText }
            ]}>
                {translate('chat', 'no_contacts')}
            </TextRegular>
        </View>
    ), [apColors.lMoreText]);

    const refreshControl = useMemo(() => (
        <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            colors={[apColors.appColor]}
            tintColor={apColors.appColor}
        />
    ), [loading, onRefresh, apColors.appColor]);

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
                    {renderHeader()}
                    <FlatList
                        data={contacts}
                        renderItem={renderContact}
                        keyExtractor={item => item.cid}
                        refreshControl={refreshControl}
                        style={styles.flatList}
                        ListEmptyComponent={renderEmptyComponent}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            )}
        </SafeAreaConsumer>
    );
};

// Redux connection
const mapStateToProps = (state: any) => ({
    user: state.user,
    chat: state.chat,
});

const mapDispatchToProps = {
    getContacts
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatScreen);

interface ContactItemProps {
    id: string;
    contact: Contact;
    onSelect: () => void;
    apColors: ThemeColors;
}

const ContactItem: React.FC<ContactItemProps> = ({ 
    id, 
    contact, 
    onSelect, 
    apColors 
}) => {
    const replyText = useMemo(() => {
        let text = contact.reply || '';
        if (text.indexOf('LCARD') === 0) {
            text = '';
        }
        return text;
    }, [contact.reply]);

    return (
        <TouchableOpacity
            onPress={onSelect}
            style={[
                styles.contactItem,
                { borderBottomColor: apColors.separator }
            ]}
        >  
            <View style={styles.contactInner}>
                {contact.avatar_url && contact.avatar_url !== '' && (
                    <Image
                        style={styles.avatar}
                        source={{ uri: contact.avatar_url }}
                        resizeMode="cover"
                    />
                )}

                <View style={styles.contactDetails}>
                    <TextHeavy style={[
                        styles.contactName,
                        { color: apColors.tText }
                    ]}>
                        {contact.display_name}
                    </TextHeavy>
                    
                    {replyText !== '' && (
                        <HTML 
                            source={{ html: replyText }}
                            baseFontStyle={{
                                fontFamily: regularFontFamily,
                                fontSize: 15, 
                                color: apColors.pText
                            }}
                            contentWidth={300}
                        />
                    )}
                    
                    <TextRegular style={[
                        styles.lastReplyDate,
                        { color: apColors.addressText }
                    ]}>
                        {moment.unix(contact.crtime).fromNow()}
                    </TextRegular>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    flatList: {
        flex: 1,
    },
    navBar: {
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 50,
        paddingTop: 8,
        paddingBottom: 7,
        borderBottomColor: 'rgba(0,0,0,0.2)',
        borderBottomWidth: 0.5,
    },
    backButton: {
        width: 50,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    headerSpacer: {
        width: 50,
    },
    contactItem: {
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
    },
    contactInner: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    contactDetails: {
        flex: 1,
        position: 'relative',
    },
    contactName: {
        fontSize: 17,
        lineHeight: 22,
        marginBottom: 7,
        fontWeight: 'bold',
    },
    lastReplyDate: {
        fontSize: 13,
        lineHeight: 18,
        position: 'absolute',
        right: 0,
        top: 0,
    },
    listEmpty: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
    },
    emptyText: {
        fontSize: 15,
        textAlign: 'center',
    },
});
