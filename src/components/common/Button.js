import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

const Button = (props) => {
	let buttonStyle = [styles.buttonStyle, props.buttonStyle ]
	let textStyle = [styles.textStyle, props.textStyle ]

	return (
		<TouchableOpacity style={buttonStyle} onPress={props.onPress}>
			<Text style={textStyle}>
				{ props.title }
			</Text>
		</TouchableOpacity>
	);
};

const styles = {
	buttonStyle: {
		flex: 1,	// expand horizontally to cover as much content as it can
		alignSelf: 'stretch', // stretch to fill limits of the container
		backgroundColor: '#fff',
	},
	textStyle: {
		alignSelf: 'center',
		color: '#fff',
		fontSize: 20,
		fontWeight: '600',
		paddingTop: 10,
		paddingBottom: 10
	}
};

export { Button };
