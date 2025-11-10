import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { View, StyleSheet, Alert } from 'react-native';

import { translate } from "../helpers/i18n";
import ReplyCom from './ReplyCom';
import { ThemeColors } from '../types';

// for redux
import { getReplies, postReply, getMoreTopReplies, clearReplies } from '../actions/chat';
import { connect } from 'react-redux';
import { AppState, AppDispatch } from '../types';

// Types
interface ReplySingleProps {
    user: {
        ID: string;
        display_name: string;
    };
    chat: {
        replies: any[];
        loading: boolean;
        loaded: boolean;
        hasMore: boolean;
        currentPage: number;
    };
    apColors: ThemeColors;
    getReplies: (commentId: number) => void;
    postReply: (data: any) => void;
    getMoreTopReplies: (commentId: number, page: number) => void;
    clearReplies: () => void;
    navigation: NavigationProp<any>;
    route: RouteProp<any, 'ReplySingle'>;
}

const ReplySingle: React.FC<ReplySingleProps> = ({
    user,
    chat,
    apColors,
    getReplies,
    postReply,
    getMoreTopReplies,
    clearReplies,
    navigation,
    route
}) => {
    const [state, setState] = useState({
        commentId: route.params?.commentId || 0,
        displayName: route.params?.display_name || translate('reply', 'new_chat'),
        loading: false,
        error: null as string | null,
    });

    // Navigation options
    React.useLayoutEffect(() => {
        navigation.setOptions({
            title: state.displayName,
            headerBackTitle: translate('back'),
        });
    }, [navigation, state.displayName]);

    // Load replies on mount
    useEffect(() => {
        if (state.commentId > 0) {
            getReplies(state.commentId);
        }
    }, [state.commentId, getReplies]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            clearReplies();
        };
    }, [clearReplies]);

    const handlePostReply = useCallback(async (replyData: any) => {
        try {
            setState(prevState => ({ ...prevState, loading: true, error: null }));
            await postReply({
                ...replyData,
                commentId: state.commentId,
                userId: user.ID,
            });
            // Refresh replies after posting
            if (state.commentId > 0) {
                getReplies(state.commentId);
            }
        } catch (error) {
            console.error('Error posting reply:', error);
            setState(prevState => ({ 
                ...prevState, 
                error: translate('error', 'post_reply_failed'),
                loading: false 
            }));
            Alert.alert(
                translate('error'),
                translate('error', 'post_reply_failed'),
                [{ text: translate('ok') }]
            );
        } finally {
            setState(prevState => ({ ...prevState, loading: false }));
        }
    }, [state.commentId, user.ID, postReply, getReplies]);

    const handleLoadMore = useCallback(() => {
        if (chat.hasMore && !chat.loading) {
            getMoreTopReplies(state.commentId, chat.currentPage + 1);
        }
    }, [chat.hasMore, chat.loading, chat.currentPage, state.commentId, getMoreTopReplies]);

    const handleRefresh = useCallback(() => {
        if (state.commentId > 0) {
            getReplies(state.commentId);
        }
    }, [state.commentId, getReplies]);

    // Add null check for apColors
    if (!apColors) {
        return null;
    }

    // Memoized props for ReplyCom
    const replyComProps = useMemo(() => ({
        user,
        chat,
        apColors,
        onPostReply: handlePostReply,
        onLoadMore: handleLoadMore,
        onRefresh: handleRefresh,
        loading: state.loading,
        error: state.error,
    }), [user, chat, apColors, handlePostReply, handleLoadMore, handleRefresh, state.loading, state.error]);

    return (
        <View style={[styles.container, { backgroundColor: apColors?.appBg || '#FFFFFF' }]}>
            <ReplyCom {...replyComProps} />
        </View>
    );
};

// Redux connection
const mapStateToProps = (state: AppState) => ({
    user: state.user,
    chat: state.chat,
    apColors: state.apColors,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
    getReplies: (commentId: number) => dispatch(getReplies(commentId)),
    postReply: (data: any) => dispatch(postReply(data)),
    getMoreTopReplies: (commentId: number, page: number) => dispatch(getMoreTopReplies(commentId, page)),
    clearReplies: () => dispatch(clearReplies()),
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(ReplySingle);
