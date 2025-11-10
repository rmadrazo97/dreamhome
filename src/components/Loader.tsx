import React from 'react';
import {
	StyleSheet,
	View,
	Modal,
	ActivityIndicator,
	useColorScheme,
} from 'react-native';
import getThemedColors from '../helpers/Theme';

interface LoaderProps {
	loading: boolean;
	style?: any;
}

const Loader: React.FC<LoaderProps> = ({ loading, style }) => {
	const colors = getThemedColors(useColorScheme());
	
	return (
    	<Modal
		transparent={true}
		animationType={'fade'}
		visible={loading}
		onRequestClose={() => {console.log('close modal')}}>
		<View style={[styles.modalBackground, {backgroundColor: colors?.modalBg || 'rgba(0,0,0,0.5)'}, style]}>
			<View style={[styles.activityIndicatorWrapper, {backgroundColor: colors?.secondBg || '#FFFFFF'}]}>
				<ActivityIndicator animating={loading} />
			</View>
		</View>
	</Modal>
  	);
};

const styles = StyleSheet.create({
	modalBackground: {
	    flex: 1,
	    alignItems: 'center',
	    flexDirection: 'column',
	    justifyContent: 'space-around',
	    
  	},
  	activityIndicatorWrapper: {
	    
	    height: 50,
	    width: 50,
	    borderRadius: 5,
	    display: 'flex',
	    alignItems: 'center',
	    justifyContent: 'space-around'
  	}
});
export default Loader;