import React from 'react';
import {Dimensions} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {MapMarker} from '../common/PatientMap/MapMarker';

export function PatientDetailMapComponent(props) {
    return (
        <MapView
            initialRegion={Object.assign({latitudeDelta: 0.0421, longitudeDelta: 0.0922}, props.patientCoordinates)}
            style={{
                width: props.mapWidth,
                height: props.mapHeight
            }}
            onRegionChangeComplete={props.onRegionChangeComplete}
        >
            <Marker
                coordinate={props.patientCoordinates}
                title='Address'
                description={props.patientAddress}
                ref={props.setMarkerRef}
            />
        </MapView>);
}
