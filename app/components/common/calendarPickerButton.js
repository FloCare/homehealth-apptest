import React from 'react';
import {Text} from 'react-native-elements';

function CalendarPickerButton(props) {
    return (
        <Text> {props.currentDate} </Text>
    );
}

export {CalendarPickerButton};
