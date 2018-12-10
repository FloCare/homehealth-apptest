import React from 'react';
import CheckBox from 'react-native-checkbox';
import {Images} from '../../Images';

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
            label={''}
            checkboxStyle={props.checkBoxStyle}
            disabled={props.disabled}
            containerStyle={{...checkBoxContainerStyle, ...props.checkBoxContainerStyle}}
            checkedImage={Images.tickMarkDone}
            uncheckedImage={Images.tickMarkNotDone}
            onChange={onPress}
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
