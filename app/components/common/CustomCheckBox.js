import React from 'react';
import {Image} from 'react-native';
import {CheckBox} from 'react-native-elements';
import {Images} from '../../Images';

const checkedIcon = Images.tickMarkDone;
const uncheckedIcon = Images.tickMarkNotDone;

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
            checkedIcon={<Image source={checkedIcon} />}
            uncheckedIcon={<Image source={uncheckedIcon} />}
            containerStyle={{...checkBoxContainerStyle, ...props.checkBoxContainerStyle}}
            textStyle={{marginLeft: 0, marginRight: 0}}
            size={24}
            center
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
