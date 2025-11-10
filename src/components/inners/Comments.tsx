import React, { useState, useCallback } from 'react';
import {
    StyleSheet,
    View,
    Image,
    ViewStyle,
    TextStyle,
    ImageStyle
} from 'react-native';
import NavigationService from '../../helpers/NavigationService';
import { translate } from "../../helpers/i18n";
import { getLoggedInID } from "../../helpers/user";
import moment from 'moment';
import BtnLink from '../../components/ui/BtnLink';
import Btn from '../../components/ui/Btn';
import TextBold from '../../components/ui/TextBold';
import TextRegular from '../../components/ui/TextRegular';
import Reviews from '../Reviews';
import { ThemeColors, Comment as CommentType, RatingField } from '../../types';

// Types
interface CommentsState {
    allReviews: boolean;
}

interface CommentsProps {
    rating: number;
    ratingFields: RatingField[];
    comments: CommentType[];
    apColors: ThemeColors;
    comment_reglogin?: boolean;
}

interface CriteriaProps {
    data: RatingField;
    apColors: ThemeColors;
}

interface CommentProps {
    data: CommentType;
    apColors: ThemeColors;
}

const Criteria: React.FC<CriteriaProps> = ({ data, apColors }) => {
    return (
        <View style={styles.criteriaContainer}>
            <View style={styles.criteriaHeader}>
                <TextRegular style={[styles.criteriaLabel, { color: apColors.regularText }]}>
                    {data.label}
                </TextRegular>
                <TextBold style={[styles.criteriaValue, { color: apColors.hText }]}>
                    {data.value}
                </TextBold>
            </View>
            <View style={[styles.criteriaBar, { backgroundColor: apColors.separator }]}>
                <View 
                    style={[
                        styles.criteriaFill, 
                        { 
                            backgroundColor: apColors.appColor,
                            width: `${(data.value / 5) * 100}%`
                        }
                    ]} 
                />
            </View>
        </View>
    );
};

const Comment: React.FC<CommentProps> = ({ data, apColors }) => {
    return (
        <View style={[styles.commentContainer, { borderBottomColor: apColors.separator }]}>
            <View style={styles.commentHeader}>
                <View style={styles.commentUser}>
                    {data.user_avatar ? (
                        <Image
                            source={{ uri: data.user_avatar }}
                            style={styles.commentAvatar}
                            resizeMode="cover"
                        />
                    ) : (
                        <View style={[styles.commentAvatarPlaceholder, { backgroundColor: apColors.separator }]}>
                            <TextBold style={[styles.commentAvatarText, { color: apColors.regularText }]}>
                                {data.user_name ? data.user_name.charAt(0).toUpperCase() : 'U'}
                            </TextBold>
                        </View>
                    )}
                    
                    <View style={styles.commentUserInfo}>
                        <TextBold style={[styles.commentUserName, { color: apColors.hText }]}>
                            {data.user_name || translate('anonymous')}
                        </TextBold>
                        <TextRegular style={[styles.commentDate, { color: apColors.addressText }]}>
                            {moment(data.created_at).format('MMM DD, YYYY')}
                        </TextRegular>
                    </View>
                </View>
                
                {data.rating && (
                    <Reviews 
                        rating={data.rating} 
                        showNum={false} 
                        style={styles.commentRating}
                    />
                )}
            </View>
            
            <View style={styles.commentContent}>
                <TextRegular style={[styles.commentText, { color: apColors.regularText }]}>
                    {data.comment}
                </TextRegular>
            </View>
        </View>
    );
};

const Comments: React.FC<CommentsProps> = ({ 
    rating, 
    ratingFields, 
    comments, 
    apColors, 
    comment_reglogin = false 
}) => {
    const [state, setState] = useState<CommentsState>({
        allReviews: false
    });

    const goToComments = useCallback(() => {
        NavigationService.navigate('Comments');
    }, []);

    const toggleAllReviews = useCallback(() => {
        setState(prevState => ({
            ...prevState,
            allReviews: !prevState.allReviews
        }));
    }, []);

    const { allReviews } = state;

    // Render rating criteria
    const renderCriteria = useCallback(() => {
        const jsx: React.ReactNode[] = [];
        if (Array.isArray(ratingFields) && ratingFields.length) {
            ratingFields.forEach((dtbj, idx) => {
                jsx.push(<Criteria key={idx} data={dtbj} apColors={apColors} />);
            });
        }
        return jsx;
    }, [ratingFields, apColors]);

    // Render comments
    const renderComments = useCallback(() => {
        const commentsJsx: React.ReactNode[] = [];
        let moreComments = false;
        
        if (Array.isArray(comments) && comments.length > 0) {
            if (comments.length > 1) moreComments = true;
            let showingReviews = comments.slice(0, 1);
            if (allReviews) showingReviews = comments;
            
            showingReviews.forEach((cmbj, idx) => {
                commentsJsx.push(<Comment key={idx} data={cmbj} apColors={apColors} />);
            });
        }
        
        return { commentsJsx, moreComments };
    }, [comments, allReviews, apColors]);

    const showCommentBtn = !comment_reglogin || getLoggedInID() !== 0;
    const { commentsJsx, moreComments } = renderComments();

    return (
        <View style={styles.container}>
            {/* Overall Rating */}
            <View style={styles.ratingSection}>
                <Reviews 
                    rating={rating} 
                    showNum={true} 
                    style={styles.overallRating}
                />
            </View>

            {/* Rating Criteria */}
            {renderCriteria().length > 0 && (
                <View style={styles.criteriaSection}>
                    {renderCriteria()}
                </View>
            )}

            {/* Comments */}
            {commentsJsx.length > 0 && (
                <View style={styles.commentsSection}>
                    <TextBold style={[styles.commentsTitle, { color: apColors.hText }]}>
                        {translate('reviews')} ({comments.length})
                    </TextBold>
                    
                    <View style={styles.commentsList}>
                        {commentsJsx}
                    </View>

                    {moreComments && (
                        <View style={styles.commentsActions}>
                            <BtnLink onPress={toggleAllReviews}>
                                {allReviews ? translate('show_less') : translate('show_all')}
                            </BtnLink>
                        </View>
                    )}
                </View>
            )}

            {/* Add Comment Button */}
            {showCommentBtn && (
                <View style={styles.addCommentSection}>
                    <Btn 
                        style={[styles.addCommentButton, { backgroundColor: apColors.appColor }]}
                        onPress={goToComments}
                    >
                        <TextBold style={styles.addCommentButtonText}>
                            {translate('add_review')}
                        </TextBold>
                    </Btn>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 15,
    } as ViewStyle,
    ratingSection: {
        alignItems: 'center',
        marginBottom: 20,
    } as ViewStyle,
    overallRating: {
        marginBottom: 10,
    } as ViewStyle,
    criteriaSection: {
        marginBottom: 20,
    } as ViewStyle,
    criteriaContainer: {
        marginBottom: 15,
    } as ViewStyle,
    criteriaHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    } as ViewStyle,
    criteriaLabel: {
        fontSize: 14,
    } as TextStyle,
    criteriaValue: {
        fontSize: 14,
    } as TextStyle,
    criteriaBar: {
        height: 4,
        borderRadius: 2,
        overflow: 'hidden',
    } as ViewStyle,
    criteriaFill: {
        height: '100%',
        borderRadius: 2,
    } as ViewStyle,
    commentsSection: {
        marginBottom: 20,
    } as ViewStyle,
    commentsTitle: {
        fontSize: 16,
        marginBottom: 15,
    } as TextStyle,
    commentsList: {
        marginBottom: 15,
    } as ViewStyle,
    commentContainer: {
        paddingBottom: 15,
        marginBottom: 15,
        borderBottomWidth: 1,
    } as ViewStyle,
    commentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
    } as ViewStyle,
    commentUser: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    } as ViewStyle,
    commentAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    } as ImageStyle,
    commentAvatarPlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
    } as ViewStyle,
    commentAvatarText: {
        fontSize: 16,
        color: '#FFF',
    } as TextStyle,
    commentUserInfo: {
        flex: 1,
    } as ViewStyle,
    commentUserName: {
        fontSize: 14,
        marginBottom: 2,
    } as TextStyle,
    commentDate: {
        fontSize: 12,
    } as TextStyle,
    commentRating: {
        marginLeft: 10,
    } as ViewStyle,
    commentContent: {
        marginTop: 5,
    } as ViewStyle,
    commentText: {
        fontSize: 14,
        lineHeight: 20,
    } as TextStyle,
    commentsActions: {
        alignItems: 'center',
    } as ViewStyle,
    addCommentSection: {
        alignItems: 'center',
    } as ViewStyle,
    addCommentButton: {
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 25,
    } as ViewStyle,
    addCommentButtonText: {
        color: '#FFF',
        fontSize: 14,
    } as TextStyle,
});

export default Comments;
