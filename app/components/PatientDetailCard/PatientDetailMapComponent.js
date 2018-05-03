import React from 'react';
import MapView, {Marker} from 'react-native-maps';
import {MapMarker} from '../common/PatientMap/MapMarker';

export function PatientDetailMapComponent(props) {
    return (
        <MapView
            initialRegion={Object.assign({latitudeDelta: 0.0421, longitudeDelta: 0.0922}, props.patientCoordinates)}
            style={{
                width: '100%',
                height: '25%'
            }}
            onRegionChangeComplete={props.onRegionChangeComplete}
        >
            <Marker
                coordinate={props.patientCoordinates}
                title={props.patientAddress}
                ref={props.setMarkerRef}
            >
                <MapMarker />
            </Marker>
        </MapView>);
}
