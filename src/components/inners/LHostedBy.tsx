import React, { useCallback } from 'react';
import { ThemeColors } from '../../types';
import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    ViewStyle,
    ImageStyle,
    TextStyle,
} from 'react-native';
import { translate } from "../../helpers/i18n";
import TextBold from '../ui/TextBold';
import TextRegular from '../ui/TextRegular';
import TextMedium from '../ui/TextMedium';

// Types
interface HostData {
    author_name: string;
    author_avatar: string;
    author_lcouts: string;
    author_desc: string;
    author_phone: string;
    author_address: string;
    author_email: string;
}

interface LHostedByProps {
    post: HostData;
    apColors: ThemeColors;
    sendMail?: (email: string) => void;
    callPhone?: (phone: string) => void;
    style?: ViewStyle;
}

const LHostedBy: React.FC<LHostedByProps> = ({ 
    post, 
    apColors, 
    sendMail, 
    callPhone, 
    style 
}) => {
    const { 
        author_name, 
        author_avatar, 
        author_lcouts, 
        author_desc, 
        author_phone, 
        author_address, 
        author_email 
    } = post;

    const handleEmailPress = useCallback(() => {
        if (sendMail && author_email) {
            sendMail(author_email);
        }
    }, [sendMail, author_email]);

    const handlePhonePress = useCallback(() => {
        if (callPhone && author_phone) {
            callPhone(author_phone);
        }
    }, [callPhone, author_phone]);

    return (
        <View style={[styles.cardWrap, style]}>
            <TextBold style={[styles.title, { color: apColors.tText }]}>
                {translate('slisting', 'hosted_by', {})}
            </TextBold>
            
            <View style={styles.commentHead}>
                {author_avatar && author_avatar !== '' && (
                    <Image
                        style={styles.avatar}
                        source={{ uri: author_avatar }}
                        resizeMode="cover"
                    />
                )}
                <View style={styles.userInfo}>
                    <TextBold style={[styles.userName, { color: apColors.tText }]}>
                        {author_name}
                    </TextBold>
                    <TextRegular style={styles.userStats}>
                        {author_lcouts}
                    </TextRegular>
                </View>
            </View>

            <View style={styles.detailsWrap}>
                {author_email && author_email !== '' && (
                    <View style={styles.detailsItem}>
                        <TextMedium style={styles.detailTitle}>
                            {translate('slisting', 'hosted_by_email', {})}
                        </TextMedium>
                        <TouchableOpacity onPress={handleEmailPress} activeOpacity={0.7}>
                            <TextRegular style={styles.detailInfo}>
                                {author_email}
                            </TextRegular>
                        </TouchableOpacity>
                    </View>
                )}
                
                {author_phone && author_phone !== '' && (
                    <View style={styles.detailsItem}>
                        <TextMedium style={styles.detailTitle}>
                            {translate('slisting', 'hosted_by_phone', {})}
                        </TextMedium>
                        <TouchableOpacity onPress={handlePhonePress} activeOpacity={0.7}>
                            <TextRegular style={styles.detailInfo}>
                                {author_phone}
                            </TextRegular>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    cardWrap: {
        // Container styles
    } as ViewStyle,
    title: {
        fontSize: 15,
        marginTop: 15,
    } as TextStyle,
    commentHead: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 15,
    } as ViewStyle,
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        overflow: 'hidden',
        marginRight: 15,
    } as ImageStyle,
    userInfo: {
        flex: 1,
    } as ViewStyle,
    userName: {
        fontSize: 15,
        lineHeight: 20,
    } as TextStyle,
    userStats: {
        color: '#878C9F',
        fontSize: 12,
        marginTop: 10,
    } as TextStyle,
    detailsWrap: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
    } as ViewStyle,
    detailsItem: {
        marginTop: 15,
        width: '48%',
    } as ViewStyle,
    detailTitle: {
        fontSize: 14,
        marginBottom: 5,
    } as TextStyle,
    detailInfo: {
        marginTop: 10,
        fontSize: 14,
        color: '#007AFF',
    } as TextStyle,
});

export default LHostedBy;