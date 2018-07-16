import React from 'react';
import {Platform, Text, TouchableOpacity} from 'react-native';
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

export const ButtonTextStyles = {
    textStyle: {
        color: 'white',
        fontSize: 18,
        fontFamily: Platform.select({ios: 'SFProDisplay-Regular', android: 'SF-Pro-Display-Regular'}),
    }
}

const styles = {
    buttonStyle: {
        backgroundColor: PrimaryColor,
        marginLeft: 0,
        marginRight: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    ...ButtonTextStyles

};

export {SimpleButton};
