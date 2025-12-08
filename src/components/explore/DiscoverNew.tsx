import React, { useState, useCallback, useRef } from 'react';
import { ThemeColors, Listing } from '../../types';
import {
    View,
    Image,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    ViewStyle,
    ImageStyle,
    TextStyle
} from 'react-native';
import NavigationService from '../../helpers/NavigationService';
import SectionTitle from './SectionTitle';
import TextRegular from '../ui/TextRegular';
import TextHeavy from '../ui/TextHeavy';
import Reviews from '../Reviews';
import { filterReset } from "../../helpers/store";

interface DiscoverNewProps {
    apColors: ThemeColors;
    eleObj: {
        title: string;
        data: Listing[];
        show_view_all: boolean;
        viewall_text: string;
    };
    goToListing: (item: Listing) => void;
    navigation: any;
}

interface CardProps {
    cIndex: number;
    viewableItems: number[];
    post: Listing;
    onPress: () => void;
    apColors: ThemeColors;
}

const Card: React.FC<CardProps> = ({ cIndex, viewableItems, post, onPress, apColors }) => {
    const [loaded, setLoaded] = useState(false);

    React.useEffect(() => {
        if (!loaded && viewableItems.includes(cIndex)) {
            setLoaded(true);
        }
    }, [loaded, cIndex, viewableItems]);

    const { thumbnail, title, address, rating } = post;
    console.log("hello post is here   ", post.thumbnail);
    console.log("hello post is here   ", loaded && thumbnail && thumbnail !== '');
    return (
        <View style={styles.card}>
            <TouchableOpacity onPress={onPress} style={styles.cardTouchable}>
                <View style={styles.cardThumbnail}>
                    {thumbnail && thumbnail !== '' && (
                        <Image source={{ uri: thumbnail }} style={styles.cardImage} />
                    )}
                </View>
                <View style={styles.cardDetails}>
                    <TextHeavy style={[styles.cardTitle, { color: apColors.tText }]}>
                        {title}
                    </TextHeavy>
                    {address && address !== '' && (
                        <TextRegular style={[styles.lAddress, { color: apColors.addressText }]}>
                            {address}
                        </TextRegular>
                    )}
                    {React.createElement(Reviews as any, {
                        rating,
                        showNum: false,
                        showCount: true,
                        style: { marginTop: 5 }
                    })}
                </View>
            </TouchableOpacity>
        </View>
    );
};

const DiscoverNew: React.FC<DiscoverNewProps> = ({ apColors, eleObj, goToListing, navigation }) => {
    const [viewableItems, setViewableItems] = useState<number[]>([]);
    const viewabilityConfig = useRef({
        waitForInteraction: true,
        itemVisiblePercentThreshold: 15,
    });

    const onViewableItemsChanged = useCallback((info: any) => {
        const { viewableItems: items } = info;
        if (items && Array.isArray(items) && items.length > 0) {
            const viewableIndexes = items.map((item: any) => item.index);
            setViewableItems(viewableIndexes);
        }
    }, []);

    const handleViewAll = useCallback(() => {
        filterReset();
        navigation.navigate('Archive', {});
    }, []);

    const { title, data, show_view_all, viewall_text } = eleObj;

    return (
        <View style={styles.container}>
            {React.createElement(SectionTitle as any, {
                title,
                showAll: show_view_all,
                allText: viewall_text,
                onViewAllPress: handleViewAll,
                style: { marginRight: 15 },
                apColors: apColors
            })}
            <FlatList
                data={data}
                renderItem={({ item, index }) => (
                    <Card 
                        cIndex={index} 
                        viewableItems={viewableItems} 
                        post={item} 
                        onPress={() => goToListing(item)} 
                        apColors={apColors}
                    />
                )}
                keyExtractor={item => String(item.id)}
                numColumns={2}
                columnWrapperStyle={styles.row}
                showsVerticalScrollIndicator={false}
                viewabilityConfig={viewabilityConfig.current}
                onViewableItemsChanged={onViewableItemsChanged}
                contentContainerStyle={styles.listContent}
                scrollEnabled={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        minHeight: 150,
        paddingTop: 10,
        paddingHorizontal: 15,
        marginTop: 20,
    } as ViewStyle,
    listContent: {
        paddingBottom: 20,
    } as ViewStyle,
    row: {
        justifyContent: 'space-between',
        marginBottom: 20,
    } as ViewStyle,
    card: {
        width: '48%',
    } as ViewStyle,
    cardTouchable: {
        flex: 1,
    } as ViewStyle,
    cardThumbnail: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 12,
        backgroundColor: '#FFF',
    } as ViewStyle,
    cardImage: {
        width: '100%',
        height: '100%',
    } as ImageStyle,
    cardDetails: {
        // Empty for now
    } as ViewStyle,
    cardTitle: {
        fontSize: 16,
        textAlign: 'left',
        lineHeight: 20,
    } as TextStyle,
    lAddress: {
        fontSize: 13,
        lineHeight: 18,
        marginTop: 4,
    } as TextStyle,
});

export default DiscoverNew;