import React from 'react';
import {CheckBox} from 'react-native-elements';
import {PrimaryColor} from '../../utils/constants';

const CustomCheckBox = (props) => {
    const checkBoxContainerStyle = {...styles.checkBoxContainerStyle};
    let onPress = props.onPress;
    if (props.disabled) {
        checkBoxContainerStyle.opacity = 0.3;
        onPress = null;
    }
    return (
        <CheckBox
            checked={props.checked}
            checkedColor={PrimaryColor}
            uncheckedColor='#525252'
            containerStyle={{...checkBoxContainerStyle, ...props.checkBoxContainerStyle}}
            title={'Done'}
            iconRight
            textStyle={[styles.textStyle, props.textStyle]}
            size={24}
            onPress={onPress}
        />
    );
};


const styles = {
    textStyle: {
        fontSize: 12,
        fontWeight: 'normal',
        color: '#999999'
    },
    checkBoxContainerStyle: {
        padding: 0,
        margin: 0,
        backgroundColor: 'transparent',
        borderColor: 'transparent'
    },
};

export {CustomCheckBox};
