import React from 'react';
import {TouchableOpacity} from 'react-native';
import StyledText from './StyledText';

const EmptyStateButton = ({onPress, children}) => {
	const {buttonStyle, textStyle} = styles;

	return (
		<TouchableOpacity style={buttonStyle} onPress={onPress}>
			<StyledText style={textStyle}>
				{ children }
			</StyledText>
		</TouchableOpacity>
	);
};

const styles = {
	buttonStyle: {
        backgroundColor: 'rgba(234, 234, 234, 1)',
        width: 200,
        height: 50,
		borderRadius: 5,
		borderWidth: 0,
		borderColor: 'black',
		marginTop: 10,
		justifyContent: 'center'
	},
	textStyle: {
		alignSelf: 'center',
		fontSize: 16,
		fontWeight: '300',
		paddingTop: 10,
		paddingBottom: 10,
		color: '#888888'
	}
};

export default EmptyStateButton;
