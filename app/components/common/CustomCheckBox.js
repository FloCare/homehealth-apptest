import React from 'react';
import {CheckBox} from 'react-native-elements';

const CustomCheckBox = (props) => (
    <CheckBox
        checked={props.checked}
        checkedColor="#45ceb1"
        uncheckedColor="#525252"
        containerStyle={[styles.checkBoxContainerStyle, props.checkBoxContainerStyle]}
        title={'Done'}
        iconRight
        textStyle={[styles.textStyle, props.textStyle]}
        size={24}
        onPress={props.onPress}
    />
);

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
