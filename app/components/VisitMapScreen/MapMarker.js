import React from 'react';
import {View, Image, Text} from 'react-native';
import {PrimaryColor} from '../../utils/constants';

function MapMarker(props) {
    return (
        <View style={{flexDirection: 'row', elevation: 4}} >
            <Image
                source={props.type === 'patient' ? require('../../../resources/patient.png') : require('../../../resources/pin.png')}
            />
            <View style={{height: 25, width: 25, borderRadius: 12.5, borderColor: PrimaryColor, borderWidth: 1.5, backgroundColor: 'white', marginLeft: 3}} >
                <Text style={{alignSelf: 'center', justifySelf: 'center'}}>
                    {props.label}
                </Text>
            </View>
        </View>
    );
}

export {MapMarker};
