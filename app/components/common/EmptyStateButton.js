import React from 'react';
import {Text, TouchableOpacity} from 'react-native';

const EmptyStateButton = ({onPress, children}) => {
	const {buttonStyle, textStyle} = styles;

	return (
		<TouchableOpacity style={buttonStyle} onPress={onPress}>
			<Text style={textStyle}>
				{ children }
			</Text>
		</TouchableOpacity>
	);
};

const styles = {
	buttonStyle: {
        backgroundColor: 'rgba(234, 234, 234, 1)',
        width: 200,
        height: 50,
		borderRadius: 5,
		borderWidth: 1,
		borderColor: 'black',
		marginTop: 10,
	},
	textStyle: {
		alignSelf: 'center',
		color: '#000000',
		fontSize: 16,
		fontWeight: '200',
		paddingTop: 10,
		paddingBottom: 10
	}
};

export default EmptyStateButton;
