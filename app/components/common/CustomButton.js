import React from 'react';
import {Button} from 'react-native-elements';
import {PrimaryColor} from '../../utils/constants';

const CustomButton = ({...props}) => {
	return (
		<Button
			buttonStyle={styles.buttonStyle}
            {...props}
		/>
	);
};

const styles = {
    buttonStyle: {
        backgroundColor: PrimaryColor,
        marginLeft: 0,
        marginRight: 0
    }
};

export {CustomButton};
