import React from 'react';
import {View} from 'react-native';

function MapMarker() {
    return (
        <View
            style={{
                backgroundColor: 'rgb(52, 118, 202)',
                height: 12,
                width: 12,
                borderRadius: 25,
                borderWidth: 2,
                borderColor: 'white'
            }}
        />
    );
}

export {MapMarker};
