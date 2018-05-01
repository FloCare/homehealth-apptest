import React from 'react';
import {View, Text} from 'react-native';

//TODO style this
function MapMarker(props) {
    return (
        <View style={{
            backgroundColor: 'blue',
            height: 12,
            width: 12,
            borderRadius: 25,
            borderWidth: 2,
            borderColor: 'white'
        }}/>
    );
}

export {MapMarker};
