import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {PrimaryColor} from '../../utils/constants';

const SimpleButton = (props) => (
    <TouchableOpacity
        style={[styles.buttonStyle, props.style]}
        onPress={props.onPress}
        underlayColor={'transparent'}
    >
        <Text
            style={[styles.textStyle, props.textStyle]}
        >
            {props.title}
        </Text>
    </TouchableOpacity>
);


const styles = {
    buttonStyle: {
        backgroundColor: PrimaryColor,
        marginLeft: 0,
        marginRight: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textStyle: {
        color: 'white',
        fontSize: 18
    }
};

export {SimpleButton};
