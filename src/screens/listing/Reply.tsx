import React from 'react';
import { 
    TouchableOpacity,
    StyleSheet,
    ViewStyle,
    TextStyle,
} from 'react-native';
import { translate } from "../../helpers/i18n";
import ReplyCom from '../ReplyCom';
import TextMedium from '../../components/ui/TextMedium';
import { getReplies, postReply, getMoreTopReplies, clearReplies } from '../../actions/chat';
import { connect } from 'react-redux';
import { AppState } from '../../types';

// Types
interface ReplyProps {
    navigation: any;
    route: any;
    user: any;
    chat: any;
    getReplies: (ctid: string | number, lastRID?: string | number | null) => void;
    postReply: (data: any) => void;
    getMoreTopReplies: (ctid: string | number, firstRID?: string | number | null) => void;
    clearReplies: () => void;
}

class ReplyNew extends ReplyCom {
    static navigationOptions = ({ navigation, route }: any) => {
        return {
            title: route.params?.display_name ?? translate('reply', 'new_chat', {}),
            headerRight: () => {
                return (
                    <TouchableOpacity 
                        onPress={() => {
                            navigation.navigate('ProfileStack', {
                                screen: 'Reply', 
                                params: { fromListing: true }
                            });
                        }} 
                        style={styles.contactsBtn}
                    >
                        <TextMedium style={styles.contactsText}>
                            {translate('reply', 'contacts', {})}
                        </TextMedium>
                    </TouchableOpacity>
                );
            },
        };
    };
}

// Map the redux state to your props
const mapStateToProps = (state: AppState) => ({
    user: state.user,
    chat: state.chat,
});

// Map your action creators to your props
const mapDispatchToProps = {
    getReplies,
    postReply,
    getMoreTopReplies,
    clearReplies
};

// Export the connected component
export default connect(mapStateToProps, mapDispatchToProps)(ReplyNew);

const styles = StyleSheet.create({
    contactsBtn: {
        marginRight: 15, 
        height: 28, 
        justifyContent: 'center',
    } as ViewStyle,
    contactsText: {
        fontSize: 17,
        textAlign: 'right',
    } as TextStyle,
});