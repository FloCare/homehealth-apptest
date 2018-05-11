import React from 'react';
import {View, Image, Text} from 'react-native';
import {PrimaryColor} from '../../utils/constants';
import {Images} from '../../Images';

function MapMarker(props) {
    return (
        <View style={{flexDirection: 'row', elevation: 4}}>
            <Image
                source={props.type === 'patient' ? Images.patient : Images.pin}
            />
            <View
                style={{
                    height: 25,
                    width: 25,
                    borderRadius: 12.5,
                    borderColor: PrimaryColor,
                    borderWidth: 1.5,
                    backgroundColor: 'white',
                    marginLeft: 3,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Text>
                    {props.label}
                </Text>
            </View>
        </View>
    );
}

export {MapMarker};
