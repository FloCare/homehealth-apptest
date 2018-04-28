import React from 'react';
import {Button} from "react-native-elements";

const CustomButton = ({ ...props }) => {
	return (
		<Button
			buttonStyle={styles.buttonStyle}
            {...props}
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
