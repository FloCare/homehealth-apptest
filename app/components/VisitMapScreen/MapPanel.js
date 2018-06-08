import React from 'react';
import {View, Image, Text} from 'react-native';
import MapView, {Marker} from 'react-native-maps';

import {Images} from '../../Images';
import {RenderIf} from '../../utils/data/syntacticHelpers';
import {PrimaryColor} from '../../utils/constants';
import {MapMarker} from './MapMarker';

export function MapPanel(props) {
    return (
        <View style={{flex: 1}}>
            <MapView
                provider={'google'}
                style={{flex: 1}}
                region={props.viewport}
                loadingEnabled
            >
                {props.markerData.map((markerData) =>
                    <Marker coordinate={markerData.coordinates} anchor={{x: 0.25, y: 1}}>
                        <MapMarker type={markerData.type} label={markerData.label} />
                    </Marker>)}
                {props.polylines.map((polylineCoordinate) =>
                    (<MapView.Polyline
                        coordinates={polylineCoordinate}
                        strokeWidth={3}
                        strokeColor={PrimaryColor}
                    />))}
            </MapView>
            {RenderIf(
                <View
                    style={{
                        height: 29,
                        backgroundColor: '#50a391',
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingLeft: 25
                    }}
                >
                    <Image
                        source={Images.time}
                    />
                    <Text style={{paddingLeft: 20, color: 'white'}}>
                        {props.totalDistance}
                    </Text>
                </View>,
                props.totalDistance
            )}
        </View>
    );
}
