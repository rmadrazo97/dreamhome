import React from 'react';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { Platform } from 'react-native';
import MainStack from './MainStack';
import NearStack from './NearStack';
import BookmarksStack from './BookmarksStack';
import ChatStack from './ChatStack';
import ProfileStack from './ProfileStack';
import { translate } from "../helpers/i18n";
import { ExploreSvg, BookmarksSvg, ProfileSvg, SearchSvg, ChatSvg } from '../components/icons/TabbarSvgIcons';
import { themedColors } from '../constants/Colors';
import store from '../store/index';

const Tab = createBottomTabNavigator();

// Define icon component outside of render
const TabIcon = ({ IconComponent, color }: { IconComponent: any; color: string }) => (
    <IconComponent color={color} />
);

// Define icon renderers outside of component
const NearMeIcon = ({ color }: { color: string }) => <TabIcon IconComponent={ExploreSvg} color={color} />;
const ExploreIcon = ({ color }: { color: string }) => <TabIcon IconComponent={SearchSvg} color={color} />;
const BookmarksIcon = ({ color }: { color: string }) => <TabIcon IconComponent={BookmarksSvg} color={color} />;
const ChatIcon = ({ color }: { color: string }) => <TabIcon IconComponent={ChatSvg} color={color} />;
const ProfileIcon = ({ color }: { color: string }) => <TabIcon IconComponent={ProfileSvg} color={color} />;

const AppNavigator: React.FC = () => {
    const apColors = useSelector((state: any) => state.apColors) || themedColors.default;
    
    // The reducer has initialState, so apColors should always exist
    // If it doesn't, fallback to prevent crash
    if (!apColors || !apColors.tabBarColors || !apColors.tabBarColors.activeTintColor) {
        // This should not happen as reducer has initialState
        // Return null to prevent crash, but log for debugging
        console.warn('AppNavigator: apColors not available, this should not happen');
        return null;
    }
	  
	return (
		<NavigationContainer>
			<Tab.Navigator 
				initialRouteName="NearStack"
				screenOptions={{ 
					headerShown: false,
					tabBarActiveTintColor: apColors.tabBarColors.activeTintColor,
					tabBarInactiveTintColor: apColors.tabBarColors.inactiveTintColor,
					tabBarStyle: [{...apColors.tabBarColors.style}, {paddingBottom: 20}],
					tabBarLabelStyle: {
						fontSize: 12,
						marginTop: Platform.OS === 'ios' ? 2 : 0,
					},
					tabBarIconStyle: {
						marginTop: Platform.OS === 'ios' ? 2 : 0,
					}
				}}
				id={undefined}
			>
				<Tab.Screen 
					name="NearStack" 
					component={NearStack} 
					options={{
						tabBarIcon: NearMeIcon,
						tabBarLabel: translate('nearme', '', {}),
					}}
					listeners={({ navigation, route: _route }) => ({
						tabPress: (e) => {
							// Check if this tab is already focused
							const state = navigation.getState();
							const currentRoute = state.routes[state.index];
							
							if (currentRoute.name === 'NearStack') {
								// Tab is already focused, reset to initial route
								e.preventDefault();
								navigation.dispatch(
									CommonActions.reset({
										index: 0,
										routes: [
											{
												name: 'NearStack',
												state: {
													routes: [{ name: 'Home' }],
													index: 0,
												},
											},
										],
									})
								);
							}
							// If not focused, let default behavior happen (switch to tab)
						},
					})}
				/>
				
				<Tab.Screen 
					name="MainStack" 
					component={MainStack} 
					options={{
						tabBarIcon: ExploreIcon,
						tabBarLabel: translate('explore', '', {}),
					}}
					listeners={({ navigation, route: _route }) => ({
						tabPress: (e) => {
							// Check if this tab is already focused
							const state = navigation.getState();
							const currentRoute = state.routes[state.index];
							
							if (currentRoute.name === 'MainStack') {
								// Tab is already focused, reset to initial route
								e.preventDefault();
								navigation.dispatch(
									CommonActions.reset({
										index: 0,
										routes: [
											{
												name: 'MainStack',
												state: {
													routes: [
														{
															name: 'HomeStack',
															state: {
																routes: [{ name: 'Home' }],
																index: 0,
															},
														},
													],
													index: 0,
												},
											},
										],
									})
								);
							}
							// If not focused, let default behavior happen (switch to tab)
						},
					})}
				/>
				
				<Tab.Screen 
					name="BookmarksStack" 
					component={BookmarksStack} 
					options={{
						tabBarIcon: BookmarksIcon,
						tabBarLabel: translate('bookmarksTab', '', {}),
					}}
					listeners={({ navigation, route: _route }) => ({
						tabPress: (e) => {
							// Check if this tab is already focused
							const state = navigation.getState();
							const currentRoute = state.routes[state.index];
							
							if (currentRoute.name === 'BookmarksStack') {
								// Tab is already focused, reset to initial route
								e.preventDefault();
								// Get user from Redux store to determine initial route
								const userState = store.getState().user;
								const isLoggedIn = userState?.isLoggedIn ?? false;
								const initialRoute = isLoggedIn ? 'Bookmarks' : 'SignIn';
								
								navigation.dispatch(
									CommonActions.reset({
										index: 0,
										routes: [
											{
												name: 'BookmarksStack',
												state: {
													routes: [{ name: initialRoute }],
													index: 0,
												},
											},
										],
									})
								);
							}
							// If not focused, let default behavior happen (switch to tab)
						},
					})}
				/>
				
				<Tab.Screen 
					name="ChatStack" 
					component={ChatStack} 
					options={{
						tabBarIcon: ChatIcon,
						tabBarLabel: "Chat",
					}}
					listeners={({ navigation, route: _route }) => ({
						tabPress: (e) => {
							// Check if this tab is already focused
							const state = navigation.getState();
							const currentRoute = state.routes[state.index];
							
							if (currentRoute.name === 'ChatStack') {
								// Tab is already focused, reset to initial route
								e.preventDefault();
								// Get user from Redux store to determine initial route
								const userState = store.getState().user;
								const isLoggedIn = userState?.isLoggedIn ?? false;
								const initialRoute = isLoggedIn ? 'Chat' : 'SignIn';
								
								navigation.dispatch(
									CommonActions.reset({
										index: 0,
										routes: [
											{
												name: 'ChatStack',
												state: {
													routes: [{ name: initialRoute }],
													index: 0,
												},
											},
										],
									})
								);
							}
							// If not focused, let default behavior happen (switch to tab)
						},
					})}
				/>
				
				<Tab.Screen 
					name="ProfileStack" 
					component={ProfileStack}
					options={{
						tabBarIcon: ProfileIcon,
						tabBarLabel: translate('profileMenu', '', {}),
					}}
					listeners={({ navigation, route: _route }) => ({
						tabPress: (e) => {
							// Check if this tab is already focused
							const state = navigation.getState();
							const currentRoute = state.routes[state.index];
							
							if (currentRoute.name === 'ProfileStack') {
								// Tab is already focused, reset to initial route
								e.preventDefault();
								// Get user from Redux store to determine initial route
								const userState = store.getState().user;
								const isLoggedIn = userState?.isLoggedIn ?? false;
								const initialRoute = isLoggedIn ? 'Profile' : 'SignIn';
								
								navigation.dispatch(
									CommonActions.reset({
										index: 0,
										routes: [
											{
												name: 'ProfileStack',
												state: {
													routes: [{ name: initialRoute }],
													index: 0,
												},
											},
										],
									})
								);
							}
							// If not focused, let default behavior happen (switch to tab)
						},
					})}
				/>
			</Tab.Navigator>
		</NavigationContainer>
	);
};

export default AppNavigator;