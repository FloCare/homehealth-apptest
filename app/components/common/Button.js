import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

const Button = ({ onPress, children }) => {
	const { buttonStyle, textStyle } = styles;

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
		flex: 1,	// expand horizontally to cover as much content as it can
		alignSelf: 'stretch', // stretch to fill limits of the container
		backgroundColor: '#fff',
		borderRadius: 5,
		borderWidth: 1,
		borderColor: '#007aff',
		marginLeft: 5,
		marginRight: 5
	},
	textStyle: {
		alignSelf: 'center',
		color: '#007aff',
		fontSize: 16,
		fontWeight: '600',
		paddingTop: 10,
		paddingBottom: 10
	}
};

export { Button };
