import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { connect } from 'react-redux';
import { Platform } from 'react-native';
import MainStack from './MainStack';
import NearStack from './NearStack';
import BookmarksStack from './BookmarksStack';
import ChatStack from './ChatStack';
import ProfileStack from './ProfileStack';
import { translate } from "../helpers/i18n";
import { ExploreSvg, BookmarksSvg, ProfileSvg, SearchSvg, ChatSvg } from '../components/icons/TabbarSvgIcons';
import { ThemeColors } from '../types';

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

interface AppNavigatorProps {
    apColors: ThemeColors;
}

const AppNavigator: React.FC<AppNavigatorProps> = ({ apColors }) => {
    // Add null check for apColors
    if (!apColors) {
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
				/>
				
				<Tab.Screen 
					name="MainStack" 
					component={MainStack} 
					options={{
						tabBarIcon: ExploreIcon,
						tabBarLabel: translate('explore', '', {}),
					}}
				/>
				
				<Tab.Screen 
					name="BookmarksStack" 
					component={BookmarksStack} 
					options={{
						tabBarIcon: BookmarksIcon,
						tabBarLabel: translate('bookmarksTab', '', {}),
					}}
				/>
				
				<Tab.Screen 
					name="ChatStack" 
					component={ChatStack} 
					options={{
						tabBarIcon: ChatIcon,
						tabBarLabel: "Chat",
					}}
				/>
				
				<Tab.Screen 
					name="ProfileStack" 
					component={ProfileStack} 
					options={{
						tabBarIcon: ProfileIcon,
						tabBarLabel: translate('profileMenu', '', {}),
					}}
				/>
			</Tab.Navigator>
		</NavigationContainer>
	);
};

const mapStateToProps = (state: any) => ({
    apColors: state.apColors,
});

export default connect(mapStateToProps)(AppNavigator);