import React from 'react';
import {
	StyleSheet,
	View,
	Modal,
	useColorScheme,
} from 'react-native';
import getThemedColors from '../helpers/Theme';

interface ResultPopupProps {
	loading: boolean;
	children?: React.ReactNode;
}

const ResultPopup: React.FC<ResultPopupProps> = ({ loading, children }) => {
	const colors = getThemedColors(useColorScheme());
	
	return (
    	<Modal
		transparent={true}
		animationType={'slide'}
		visible={loading}
		onRequestClose={() => {console.log('close modal')}}>
		<View style={[styles.modalBackground, {backgroundColor: colors?.modalBg || 'rgba(0,0,0,0.5)'}]}>
			<View style={[styles.activityIndicatorWrapper, {backgroundColor: colors?.modalInner || '#FFFFFF'}]}>
				{children}
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
	    
	    // flex: 1,
	    borderRadius: 15,
	    marginHorizontal: 30,
	    padding: 30,
	    display: 'flex',
	    alignItems: 'center',
	    justifyContent: 'space-around'
  	}
});
export default ResultPopup;