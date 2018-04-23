import React from 'react';
import {View, Text} from 'react-native';

//TODO style this
function MapMarker(props) {
    return (
        <View style={{backgroundColor: '#FFFFFF'}}>
            <Text>{props.text}</Text>
        </View>
    );
}

export {MapMarker};
