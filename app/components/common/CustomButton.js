import React from 'react';
import {Button} from "react-native-elements";

const CustomButton = ({ title, onPress }) => {
	return (
		<Button
			buttonStyle={styles.buttonStyle}
			title={title}
			onPress={onPress}
		/>
	);
};

const styles = {
    buttonStyle: {
        backgroundColor: '#45ceb1',
        marginLeft: 0,
        marginRight: 0
    }
};

export { CustomButton };
