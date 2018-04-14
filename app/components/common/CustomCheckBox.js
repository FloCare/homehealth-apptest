import React from 'react';
import {CheckBox} from "react-native-elements";

const CustomCheckBox = ({checked, onPress}) => {
    return (
        <CheckBox
            checked={checked}
            checkedColor="#45ceb1"
            uncheckedColor="#45ceb1"
            containerStyle={styles.checkBoxContainerStyle}
            textStyle={styles.checkBoxStyle}
            size={18}
            onPress={onPress}
        />
    );
};

const styles = {
    checkBoxStyle: {
        fontSize: 12,
        fontWeight: "normal",
        color: "#999999"
    },
    checkBoxContainerStyle: {
        padding: 0,
        margin: 0,
        width: 18,
        height: 18,
        backgroundColor: 'transparent',
        borderColor: 'transparent'
    },
};

export {CustomCheckBox};
