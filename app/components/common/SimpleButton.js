import React from 'react';
import {Platform, TouchableOpacity} from 'react-native';
import {PrimaryColor} from '../../utils/constants';
import StyledText from './StyledText';

const SimpleButton = (props) => (
    <TouchableOpacity
        disabled={props.disabled}
        style={{...styles.buttonStyle, ...props.style}}
        onPress={props.onPress}
        underlayColor={'transparent'}
    >
        <StyledText
            style={{...styles.textStyle, ...props.textStyle}}
        >
            {props.title}
        </StyledText>
    </TouchableOpacity>
);

export const ButtonTextStyles = {
    textStyle: {
        color: 'white',
        fontSize: 18,
        fontFamily: Platform.select({ios: 'SFProDisplay-Regular', android: 'SF-Pro-Display-Regular'}),
    }
};

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
