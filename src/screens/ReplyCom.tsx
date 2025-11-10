import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ThemeColors, NavigationProp } from '../types';
import {
    Image,
    FlatList,
    StyleSheet,
    TextInput, 
    TouchableOpacity,
    View,
    Keyboard,
    Platform,
    StatusBar,
    Dimensions,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
    ImageStyle,
} from 'react-native';
import { SafeAreaConsumer } from 'react-native-safe-area-context';
import HTML from 'react-native-render-html';
import moment from 'moment';
import { mediumFontFamily } from '../constants/Colors';
import { translate } from "../helpers/i18n";
import { fomartCurrOut } from '../helpers/currency';
import BtnLink from '../components/ui/BtnLink';
import TextMedium from '../components/ui/TextMedium';
import TextRegular from '../components/ui/TextRegular';
import { SendHozSvg } from '../components/icons/ButtonSvgIcons';

// Types
interface ReplyComProps {
    navigation: NavigationProp;
    apColors: ThemeColors;
    user: {
        ID: number;
        [key: string]: any;
    };
    chat: {
        active: string | number;
        replies: ReplyItem[];
        topLoading: boolean;
        firstRemain: boolean;
        repLoading: boolean;
        lastRID: string | number | null;
        firstRID: string | number | null;
        noReplyNum: number;
    };
    route: {
        params?: {
            cid?: string | number;
            touid?: string | number;
            lobject?: any;
        };
    };
    getReplies: (ctid: string | number, lastRID?: string | number | null) => void;
    postReply: (data: any) => void;
    getMoreTopReplies: (ctid: string | number, firstRID?: string | number | null) => void;
    clearReplies: () => void;
}

interface ReplyItem {
    crid: string | number;
    uid: number;
    user_one: number;
    reply: string;
    avatar_url: string;
    crtime: number;
}

interface ReplyComState {
    keyboardHeight: number;
    reply: string;
    initCID: string | number;
    cardSent: boolean;
}

interface ReplyProps {
    id: string | number;
    reply: ReplyItem;
    cUID: number;
    apColors: ThemeColors;
}

const ReplyCom: React.FC<ReplyComProps> = ({
    apColors,
    user,
    chat,
    route,
    getReplies,
    postReply,
    getMoreTopReplies,
}) => {
    const cid = route.params?.cid ?? 0;
    let initCID = cid;
    let initialReply = '';
    
    // Handle special case for new conversations
    if (cid === 'New') {
        initCID = 'New';
    }

    const [state, setState] = useState<ReplyComState>({
        keyboardHeight: 0,
        reply: initialReply,
        initCID,
        cardSent: false
    });

    // Update initCID when chat.active changes
    useEffect(() => {
        if (chat.active && chat.active !== state.initCID) {
            setState(prevState => ({ ...prevState, initCID: chat.active }));
        }
    }, [chat.active, state.initCID]);

    // Initialize replies and set up keyboard listeners
    useEffect(() => {
        if (cid !== 'New') {
            getReplies(cid);
            getRepliesTimeoutFunction();
        }

        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            _keyboardDidShow
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            _keyboardDidHide
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, [cid, getReplies, getRepliesTimeoutFunction]);

    const _keyboardDidShow = useCallback((e: any) => {
        const keyboardHeight = e.endCoordinates.height;
        setState(prevState => ({ ...prevState, keyboardHeight }));
    }, []);

    const _keyboardDidHide = useCallback(() => {
        setState(prevState => ({ ...prevState, keyboardHeight: 0 }));
    }, []);

    const getRepliesTimeoutFunction = useCallback(() => {
        let currentCid = cid;
        if (currentCid === 'New' && state.initCID !== 0) {
            currentCid = state.initCID;
        }
        
        const { lastRID, noReplyNum } = chat;
        getReplies(currentCid, lastRID);
        
        let nextRequest = 60000;
        if (noReplyNum > 3) {
            nextRequest *= 5;
        }
        if (noReplyNum > 10) {
            nextRequest *= 10;
        }
        if (noReplyNum > 20) {
            nextRequest *= 20;
        }
        
        setTimeout(() => {
            getRepliesTimeoutFunction();
        }, nextRequest);
    }, [cid, state.initCID, chat, getReplies]);

    const onInputChange = useCallback((text: string) => {
        setState(prevState => ({ ...prevState, reply: text }));
    }, []);

    const handlePostReply = useCallback(() => {
        const { reply, initCID: currentInitCID } = state;
        if (reply.length > 0) {
            let currentCid = cid;
            const touid = route.params?.touid ?? 0;
            const user_id = user.ID;

            if (currentCid === 'New' && currentInitCID !== 0) {
                currentCid = currentInitCID;
            }
            
            postReply({ 
                reply_text: reply, 
                user_id, 
                touid, 
                cid: currentCid 
            });
            
            setState(prevState => ({ ...prevState, reply: '' }));
            getRepliesTimeoutFunction();
        }
    }, [state, cid, route.params?.touid, user.ID, postReply, getRepliesTimeoutFunction]);

    const sendListingCard = useCallback(() => {
        const { cardSent } = state;
        let currentCid = cid;
        
        if (currentCid === 'New' && cardSent === false) {
            const lobject = route.params?.lobject ?? {};
            const reply = 'LCARD' + encodeURIComponent(JSON.stringify(lobject));
            const touid = route.params?.touid ?? 0;
            const user_id = user.ID;

            postReply({ 
                reply_text: reply, 
                user_id, 
                touid, 
                cid: currentCid 
            });
            
            setState(prevState => ({ ...prevState, reply: '', cardSent: true }));
            getRepliesTimeoutFunction();
        }
    }, [state, cid, route.params, user.ID, postReply, getRepliesTimeoutFunction]);

    const onEndReached = useCallback((_info: any) => {
        const { firstRemain, firstRID, topLoading } = chat;
        if (!topLoading && firstRemain) {
            let currentCid = cid;
            if (currentCid === 'New' && state.initCID !== 0) {
                currentCid = state.initCID;
            }
            getMoreTopReplies(currentCid, firstRID);
        }
    }, [chat, cid, state.initCID, getMoreTopReplies]);

    const { keyboardHeight, reply, cardSent } = state;
    const { replies, topLoading, firstRemain } = chat;
    const { ID } = user;
    
    const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight || 0;
    const innerHeight = Dimensions.get('window').height - keyboardHeight - 50 - STATUSBAR_HEIGHT;
    
    const listDatas = useMemo(() => [...replies].reverse(), [replies]);

    const hasCard = useMemo(() => {
        return cid === 'New' && cardSent === false;
    }, [cid, cardSent]);

    const cardObj = useMemo(() => {
        return route.params?.lobject ?? {};
    }, [route.params?.lobject]);

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
                    <View style={[styles.innerView, { height: innerHeight - insets.bottom }]}>
                        <FlatList
                            data={listDatas}
                            renderItem={({ item }) => (
                                <ReplyComponent
                                    reply={item}
                                    cUID={ID}
                                    apColors={apColors}
                                />
                            )}
                            keyExtractor={item => String(item.crid)}
                            onEndReached={onEndReached}
                            onEndReachedThreshold={0.1}
                            numColumns={1}
                            style={[styles.flatList, { backgroundColor: apColors.secondBg }]}
                            ListFooterComponent={() => (
                                <View style={styles.listFooter}>
                                    {topLoading && <ActivityIndicator animating={true} />}
                                    {replies.length > 0 && !firstRemain && (
                                        <TextRegular style={[styles.noMoreText, { color: apColors.lMoreText }]}>
                                            {translate('reply', 'no_more', {})}
                                        </TextRegular>
                                    )}
                                </View>
                            )}
                            inverted={true}
                            keyboardShouldPersistTaps="handled"
                        />
                        
                        {hasCard && cardObj.title && (
                            <View style={[styles.cardInner, { backgroundColor: apColors.appBg }]}>
                                {cardObj.thumbnail && (
                                    <Image source={{ uri: cardObj.thumbnail }} style={styles.cardImage} />
                                )}
                                <View style={styles.cardDetails}>
                                    <TextMedium style={styles.cardTitle}>{cardObj.title}</TextMedium>
                                    <TextRegular style={[styles.cardPrice, { color: apColors.appColor }]}>
                                        {fomartCurrOut(cardObj.price)}
                                    </TextRegular>
                                    <BtnLink 
                                        size={13} 
                                        style={styles.sendListingBtn} 
                                        onPress={sendListingCard}
                                    >
                                        {translate('reply', 'send_listing', {})}
                                    </BtnLink>
                                </View>
                            </View>
                        )}
                        
                        <View style={[styles.inputWrap, { 
                            backgroundColor: apColors.appBg, 
                            borderTopColor: apColors.separator 
                        }]}>
                            <TextInput 
                                style={[styles.inputField, {
                                    backgroundColor: apColors.searchBg,
                                    borderColor: apColors.searchBg,
                                    color: apColors.pText
                                }]}
                                onChangeText={onInputChange}
                                autoCorrect={false}
                                underlineColorAndroid="transparent"
                                autoCapitalize="none"
                                autoComplete="off"
                                value={reply}
                                multiline={true}
                                placeholder={translate('reply', 'type_message', {})}
                            />
                            <TouchableOpacity 
                                onPress={handlePostReply}
                                style={styles.sendButton}
                            >
                                <SendHozSvg fill={apColors.appColor} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
        </SafeAreaConsumer>
    );
};

const ReplyComponent: React.FC<ReplyProps> = ({ reply, cUID, apColors }) => {
    const replyWStyle = useMemo(() => {
        let style = [styles.replyItem];
        if (reply.uid !== reply.user_one) {
            style.push(styles.replyReply);
        }
        if (reply.uid === cUID) {
            style.push(styles.yourReply);
        }
        return style;
    }, [reply.uid, reply.user_one, cUID]);

    const rInnerStyle = useMemo(() => {
        let style = [styles.replyInner];
        if (reply.uid !== reply.user_one) {
            style.push(styles.replyReplyInner);
        }
        return style;
    }, [reply.uid, reply.user_one]);

    const rDetailsStyle = useMemo(() => {
        let style = [styles.replyDetails, { backgroundColor: apColors.replyBg }];
        if (reply.uid !== reply.user_one) {
            style.push(styles.replyReplyDetails);
        }
        if (reply.uid === cUID) {
            style.push({ backgroundColor: apColors.appColor });
        }
        return style;
    }, [reply.uid, reply.user_one, cUID, apColors.replyBg, apColors.appColor]);

    const avatarStyle = useMemo(() => {
        let style = [styles.avatar];
        if (reply.uid !== reply.user_one) {
            style.push(styles.avatarReply);
        }
        return style;
    }, [reply.uid, reply.user_one]);

    const timeAddStyle = useMemo(() => {
        return reply.uid !== reply.user_one ? { justifyContent: 'flex-end' as const } : {};
    }, [reply.uid, reply.user_one]);

    const tColor = reply.uid === cUID ? '#FFF' : '#000';

    const { hasCard, cardObj, replyText } = useMemo(() => {
        let text = reply.reply || '';
        let isCard = false;
        let card = {};
        
        if (text.indexOf('LCARD') === 0) {
            isCard = true;
            text = decodeURIComponent(text.substr(5));
            try {
                card = JSON.parse(text);
            } catch (err) {
                console.log('Error parsing card object:', err);
            }
        }
        
        return { hasCard: isCard, cardObj: card, replyText: text };
    }, [reply.reply]);

    if (hasCard && (cardObj as any).title) {
        return (
            <View style={[styles.cardInner, { backgroundColor: apColors.appBg }]}>
                {(cardObj as any).thumbnail && (
                    <Image source={{ uri: (cardObj as any).thumbnail }} style={styles.cardImage} />
                )}
                <View style={styles.cardDetails}>
                    <TextMedium style={styles.cardTitle}>{(cardObj as any).title}</TextMedium>
                    <TextRegular style={[styles.cardPrice, { color: apColors.appColor }]}>
                        {fomartCurrOut((cardObj as any).price)}
                    </TextRegular>
                </View>
            </View>
        );
    }

    return (
        <View style={replyWStyle}>
            <View style={rInnerStyle}>
                {reply.avatar_url && (
                    <Image
                        style={avatarStyle}
                        source={{ uri: reply.avatar_url }}
                        resizeMode="cover"
                    />
                )}
                <View style={styles.replyDetailsWrap}>
                    <View style={[styles.timeWrap, timeAddStyle]}>
                        <TextRegular style={[styles.lastReplyDate, { color: apColors.addressText }]}>
                            {moment.unix(reply.crtime).fromNow()}
                        </TextRegular>
                    </View>
                    <View style={rDetailsStyle}>
                        {!hasCard && replyText !== '' && (
                            <HTML
                                source={{ html: replyText }}
                                baseStyle={{
                                    fontFamily: mediumFontFamily,
                                    fontSize: 15,
                                    lineHeight: 24,
                                    color: tColor
                                }}
                            />
                        )}
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    } as ViewStyle,
    innerView: {
        width: '100%',
    } as ViewStyle,
    flatList: {
        paddingHorizontal: 15,
        paddingTop: 20,
    } as ViewStyle,
    replyItem: {
        marginBottom: 25,
    } as ViewStyle,
    replyInner: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    } as ViewStyle,
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
        overflow: 'hidden',
        marginRight: 15,
    } as ImageStyle,
    replyDetailsWrap: {
        flex: 1,
    } as ViewStyle,
    replyDetails: {
        paddingVertical: 13,
        paddingHorizontal: 15,
        borderRadius: 10,
        borderTopLeftRadius: 0,
        alignSelf: 'flex-start',
    } as ViewStyle,
    lastReplyDate: {
        fontSize: 13,
        lineHeight: 18,
    } as TextStyle,
    replyReplyInner: {
        flexDirection: 'row-reverse',
    } as ViewStyle,
    avatarReply: {
        marginRight: 0,
        marginLeft: 15,
    } as ImageStyle,
    replyReplyDetails: {
        alignItems: 'flex-end',
        borderTopRightRadius: 0,
        borderTopLeftRadius: 10,
        alignSelf: 'flex-end',
    } as ViewStyle,
    timeWrap: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 2,
    } as ViewStyle,
    inputWrap: {
        paddingHorizontal: 15,
        borderTopWidth: 0.5,
        paddingTop: 5,
        paddingBottom: 10,
        flexDirection: 'row',
        alignItems: 'flex-end',
    } as ViewStyle,
    inputField: {
        flex: 1,
        minHeight: 40,
        borderWidth: 1,
        fontSize: 16,
        paddingHorizontal: 15,
        paddingVertical: 7,
        borderRadius: 8,
    } as TextStyle,
    sendButton: {
        height: 40,
        paddingHorizontal: 10,
        justifyContent: 'center',
        marginLeft: 15,
    } as ViewStyle,
    listFooter: {
        marginTop: 20,
        paddingVertical: 20,
    } as ViewStyle,
    noMoreText: {
        fontSize: 15,
        textAlign: 'center',
    } as TextStyle,
    cardInner: {
        flexDirection: 'row',
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderRadius: 10,
        marginBottom: 10,
    } as ViewStyle,
    cardImage: {
        width: 100,
        borderRadius: 4,
        overflow: 'hidden',
        marginRight: 15,
    } as ImageStyle,
    cardDetails: {
        flex: 1,
    } as ViewStyle,
    cardTitle: {
        fontSize: 17,
        lineHeight: 22,
    } as TextStyle,
    cardPrice: {
        fontSize: 15,
        lineHeight: 20,
        marginTop: 7,
    } as TextStyle,
    sendListingBtn: {
        paddingVertical: 0,
        paddingHorizontal: 0,
    } as ViewStyle,
    replyReply: {
        // Additional styles for reply replies
    } as ViewStyle,
    yourReply: {
        // Additional styles for user's own replies
    } as ViewStyle,
});

export default ReplyCom;