import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useColorScheme } from 'react-native';

import NearScreen from '../screens/NearScreen';
import CatsScreen from '../screens/CatsScreen';
import LocsScreen from '../screens/LocsScreen';
import ArchiveScreen from '../screens/ArchiveScreen';
import MapScreen from '../screens/MapScreen';
import ListingScreen from '../screens/ListingScreen';
import CommentsScreen from '../screens/listing/Comments';
import ClaimScreen from '../screens/listing/Claim';
import ReportScreen from '../screens/listing/Report';
import ReplyNewScreen from '../screens/listing/Reply';
import AvailabilityScreen from '../screens/AvailabilityScreen';
import BookingScreen from '../screens/BookingScreen';
import CheckoutScreen from '../screens/CheckoutScreen';

import { translate } from "../helpers/i18n";
import BackButton from '../components/inners/BackButton';
import getThemedColors from '../helpers/Theme';

const Stack = createStackNavigator();

// Define BackButton component outside of render
const BackButtonComponent = ({ color, onPress }: { color: string; onPress: () => void }) => (
    <BackButton 
        color={color} 
        onPress={onPress} 
        style={{ marginLeft: 10 }} 
    />
);

interface NearStackProps {
    navigation: any;
    route: any;
}

const NearStack: React.FC<NearStackProps> = ({ navigation: _navigation, route: _route }) => {
    const apTheme = useColorScheme();
    const colors = getThemedColors(apTheme);

    return (
        <Stack.Navigator
            initialRouteName="Home"
            screenOptions={({ navigation }) => ({
                gestureEnabled: false,
                headerShown: false,
                headerLeft: () => (
                    <BackButtonComponent 
                        color={colors.backBtn} 
                        onPress={navigation.goBack} 
                    />
                ),
                headerStyle: colors.headerNavStyle,
                headerTitleStyle: colors.headerTitleStyle,
                headerTitleAlign: 'center',
            })}
        >
            <Stack.Screen name="Home" options={{ headerShown: false }}>
                {props => <NearScreen {...props} />}
            </Stack.Screen>
            
            <Stack.Screen name="Locations" options={{ title: translate('loc_screen') }}>
                {props => <LocsScreen {...props} apColors={colors} />}
            </Stack.Screen>
            
            <Stack.Screen name="Categories" options={{ title: translate('cat_screen') }}>
                {props => <CatsScreen {...props} />}
            </Stack.Screen>
            
            <Stack.Screen 
                name="Archive" 
                options={{ title: translate('archive_screen') }}
                initialParams={{ appColor: colors.appColor }}
            >
                {props => <ArchiveScreen {...props} apColors={colors} />}
            </Stack.Screen>
            
            <Stack.Screen name="Map" options={{ headerShown: false }}>
                {props => <MapScreen {...props} apColors={colors} />}
            </Stack.Screen>
            
            <Stack.Screen name="Listing" options={{ headerShown: false }}>
                {props => <ListingScreen {...props} />}
            </Stack.Screen>
            
            <Stack.Screen name="Comments" options={{ title: translate('reviews_screen') }}>
                {props => <CommentsScreen {...props} apColors={colors} />}
            </Stack.Screen>
            
            <Stack.Screen name="Claim" options={{ title: translate('claim_screen') }}>
                {props => <ClaimScreen {...props} apColors={colors} />}
            </Stack.Screen>
            
            <Stack.Screen name="Report" options={{ title: translate('report_screen') }}>
                {props => <ReportScreen {...props} apColors={colors} />}
            </Stack.Screen>
            
            <Stack.Screen name="ReplyNew" options={{ title: translate('reply_screen') }}>
                {props => (ReplyNewScreen as any)(props)}
            </Stack.Screen>
            
            <Stack.Screen name="Availability" options={{ title: translate('dates_screen') }}>
                {props => <AvailabilityScreen {...props} apColors={colors} />}
            </Stack.Screen>
            
            <Stack.Screen name="Booking" options={{ title: translate('bk_screen') }}>
                {props => <BookingScreen {...props} apColors={colors} />}
            </Stack.Screen>
            
            <Stack.Screen name="Checkout" options={{ title: translate('ck_screen') }}>
                {props => <CheckoutScreen {...props} apColors={colors} />}
            </Stack.Screen>
        </Stack.Navigator>
    );
};

export default NearStack;
