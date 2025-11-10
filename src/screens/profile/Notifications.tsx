import React, { useState, useEffect, useCallback } from 'react';
import { ThemeColors, NavigationProp } from '../types';
import { 
    View,
    FlatList,
    TouchableOpacity, 
    StyleSheet,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import { SafeAreaConsumer } from 'react-native-safe-area-context';
import HTML from 'react-native-render-html';
import moment from 'moment';

import { translate } from "../../helpers/i18n";
import { regularFontFamily } from "../../constants/Colors";
import BackButton from '../../components/inners/BackButton';
import TextRegular from '../../components/ui/TextRegular';
import Loader from '../../components/Loader';

// for redux
import { getNotifications, refreshNotifications, loadMoreNotifications } from '../../actions/user';
import { connect } from 'react-redux';

interface NotificationItem {
    id: string;
    message: string;
    timestamp: number;
}

interface NotificationsState {
    selected: Map<string, boolean>;
    paged: number;
}

interface NotificationsProps {
    navigation: NavigationProp;
    apColors: ThemeColors;
    user: {
        ID: string;
        notifications: NotificationItem[];
        notipages: number;
        notisloading: boolean;
        notislmore: boolean;
    };
    loading: boolean;
    getNotifications: (userId: string) => void;
    refreshNotifications: (userId: string) => void;
    loadMoreNotifications: (userId: string, page: number) => void;
}

const Notifications: React.FC<NotificationsProps> = ({ 
    navigation, 
    apColors, 
    user, 
    loading, 
    getNotifications, 
    refreshNotifications, 
    loadMoreNotifications 
}) => {
    const [state, setState] = useState<NotificationsState>({
        selected: new Map(),
        paged: 1
    });

    useEffect(() => {
        getNotifications(user.ID);
    }, [getNotifications, user.ID]);

    const onSelect = useCallback((id: string) => {
        setState(prevState => {
            const newSelected = new Map(prevState.selected);
            newSelected.set(id, !newSelected.get(id));
            return { ...prevState, selected: newSelected };
        });
    }, []);

    const onRefresh = useCallback(() => {
        refreshNotifications(user.ID);
        setState(prevState => ({ ...prevState, paged: 1 }));
    }, [refreshNotifications, user.ID]);

    const onEndReached = useCallback(() => {
        const { notipages, notislmore } = user;
        if (notislmore === false && notipages > 0) {
            const newPaged = state.paged + 1;
            loadMoreNotifications(user.ID, newPaged);
            setState(prevState => ({ ...prevState, paged: newPaged }));
        }
    }, [user, state.paged, loadMoreNotifications]);

    const { selected } = state;
    const { notifications, notipages, notisloading, notislmore } = user;

    if (loading) {
        return <Loader loading={true} />;
    }

    return (
        <SafeAreaConsumer>
            {insets => (
                <View style={[
                    styles.container,
                    {
                        backgroundColor: apColors.appBg,
                        paddingLeft: insets.left,
                        paddingRight: insets.right,
                        paddingBottom: insets.bottom
                    }
                ]}>
                    <FlatList
                        data={notifications}
                        renderItem={({ item }) => (
                            <NotificationItem
                                id={item.id}
                                notiobj={item}
                                selected={!!selected.get(item.id)}
                                onSelect={onSelect}
                                apColors={apColors}
                            />
                        )}
                        keyExtractor={item => item.id}
                        refreshControl={
                            <RefreshControl
                                refreshing={notisloading}
                                onRefresh={onRefresh}
                                colors={[apColors.appColor]}
                                tintColor={apColors.appColor}
                            />
                        }
                        onEndReached={onEndReached}
                        onEndReachedThreshold={0.1}
                        ListEmptyComponent={() => (
                            <View style={styles.listEmpty}>
                                <TextRegular style={[
                                    styles.emptyText,
                                    { color: apColors.lMoreText }
                                ]}>
                                    {translate('notifications', 'no_result')}
                                </TextRegular>
                            </View>
                        )}
                        ListFooterComponent={() => (
                            <View style={styles.listFooter}>
                                {notislmore && (
                                    <ActivityIndicator 
                                        animating={true} 
                                        color={apColors.appColor}
                                    />
                                )}
                                {notifications.length > 0 && notipages === 0 && (
                                    <TextRegular style={[
                                        styles.noMoreText,
                                        { color: apColors.lMoreText }
                                    ]}>
                                        {translate('notifications', 'no_more')}
                                    </TextRegular>
                                )}
                            </View>
                        )}
                    />
                </View>
            )}
        </SafeAreaConsumer>
    );
};

// Redux connection
const mapStateToProps = (state: any) => ({
    user: state.user,
    loading: state.loading,
});

const mapDispatchToProps = {
    getNotifications,
    refreshNotifications,
    loadMoreNotifications
};

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);

interface NotificationItemProps {
    id: string;
    notiobj: NotificationItem;
    selected: boolean;
    onSelect: (id: string) => void;
    apColors: ThemeColors;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ 
    id, 
    notiobj, 
    selected, 
    onSelect, 
    apColors 
}) => {
    return (
        <TouchableOpacity
            onPress={() => onSelect(id)}
            style={[
                styles.notiItem,
                { 
                    borderBottomColor: apColors.separator,
                    backgroundColor: selected ? apColors.secondBg : 'transparent'
                },
            ]}
        >
            {notiobj.message && notiobj.message !== '' && (
                <HTML 
                    source={{ html: notiobj.message }}
                    baseFontStyle={{
                        fontFamily: regularFontFamily,
                        fontSize: 15, 
                        color: apColors.pText
                    }}
                    contentWidth={300}
                />
            )}
            <TextRegular style={[
                styles.notiDate,
                { color: apColors.addressText }
            ]}>
                {moment.unix(notiobj.timestamp).fromNow()}
            </TextRegular>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    notiItem: {
        paddingTop: 20,
        paddingBottom: 10,
        marginHorizontal: 15,
        borderBottomWidth: 1,
    },
    notiDate: {
        marginTop: 15,
        fontSize: 13,
    },
    listEmpty: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 15,
        textAlign: 'center',
    },
    listFooter: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    noMoreText: {
        fontSize: 15,
        textAlign: 'center',
    },
});
