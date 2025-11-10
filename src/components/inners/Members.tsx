import React, { useState, useMemo, useCallback } from 'react';
import {
    StyleSheet,
    View,
    Image,
    ScrollView,
    Dimensions,
    useColorScheme,
    ViewStyle,
    ImageStyle,
    TextStyle,
} from 'react-native';
import HTML from 'react-native-render-html';
import getThemedColors from '../../helpers/Theme';
import { regularFontFamily } from '../../constants/Colors';
import { translate } from "../../helpers/i18n";
import TextBold from '../../components/ui/TextBold';
import TextRegular from '../../components/ui/TextRegular';
import { Host } from '../../types';

// Types
interface MembersProps {
    data: Host[];
    style?: ViewStyle;
}

interface MemberProps {
    data: Host;
    index: number;
    style?: ViewStyle;
    imageStyle?: ImageStyle;
}

const Member: React.FC<MemberProps> = ({ data, index, style, imageStyle }) => {
    const colors = getThemedColors(useColorScheme());
    const { avatar, name, job, desc } = data;

    const htmlContent = useMemo(() => ({
        html: desc || ''
    }), [desc]);

    const baseFontStyle = useMemo(() => ({
        fontFamily: regularFontFamily,
        fontSize: 15,
        color: colors.pText
    }), [colors.pText]);

    return (
        <View style={[styles.itemWrap, style]}>
            <View style={styles.itemInner}>
                {avatar && avatar !== '' && (
                    <Image 
                        source={{ uri: avatar }} 
                        style={[styles.memberImage, imageStyle]} 
                        resizeMode="contain"
                        onError={() => {
                            // Handle image loading errors gracefully
                            console.warn('Failed to load member image:', avatar);
                        }}
                    />
                )}
                <View style={styles.itemLeft}>
                    <TextBold style={styles.itemTitle}>{name}</TextBold>
                </View>
                <TextRegular style={[styles.itemSubTitle, { color: colors.appColor }]}>
                    {job}
                </TextRegular>
                <View style={styles.itemRight}>
                    {desc && desc !== '' && (
                        <HTML 
                            source={htmlContent}
                            containerStyle={{ marginTop: 0, paddingTop: 0 }}
                            baseFontStyle={baseFontStyle}
                            contentWidth={Dimensions.get('window').width - 60}
                        />
                    )}
                </View>
            </View>
        </View>
    );
};

const Members: React.FC<MembersProps> = ({ data, style }) => {
    const windowWidth = Dimensions.get('window').width;
    const itemWidth = windowWidth - 30;

    const memberItems = useMemo(() => {
        return data.map((member, index) => {
            const imageStyle: ImageStyle = {
                width: itemWidth,
                height: 260
            };

            // Calculate proper image height based on aspect ratio
            if (member.avatar && member.avatar !== '') {
                Image.getSize(
                    member.avatar,
                    (width, height) => {
                        // This will be handled asynchronously
                        // For now, we'll use the default height
                    },
                    (error) => {
                        console.warn('Failed to get image size:', error);
                    }
                );
            }

            return (
                <Member
                    key={member.id || index}
                    data={member}
                    index={index}
                    style={{ width: itemWidth }}
                    imageStyle={imageStyle}
                />
            );
        });
    }, [data, itemWidth]);

    return (
        <View style={[styles.container, style]}>
            <ScrollView 
                horizontal={true} 
                showsHorizontalScrollIndicator={false} 
                style={styles.scrollView}
                pagingEnabled={true}
                decelerationRate="fast"
                snapToInterval={itemWidth}
                snapToAlignment="start"
            >
                {memberItems}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    } as ViewStyle,
    scrollView: {
        flex: 1,
    } as ViewStyle,
    itemWrap: {
        marginBottom: 15,
        paddingHorizontal: 15,
    } as ViewStyle,
    itemInner: {
        flex: 1,
    } as ViewStyle,
    memberImage: {
        borderRadius: 8,
        flex: 1,
        minHeight: 260,
        marginBottom: 10,
        overflow: 'hidden',
        backgroundColor: '#f0f0f0',
    } as ImageStyle,
    itemLeft: {
        marginBottom: 5,
    } as ViewStyle,
    itemRight: {
        marginTop: 10,
    } as ViewStyle,
    itemTitle: {
        fontSize: 18,
        lineHeight: 24,
        marginBottom: 5,
    } as TextStyle,
    itemSubTitle: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 10,
    } as TextStyle,
});

export default Members;