import React from 'react';
import MapView, {Marker} from 'react-native-maps';
import {MapMarker} from '../common/PatientMap/MapMarker';

export function PatientDetailMapComponent(props) {
    return (
        <MapView
            initialRegion={Object.assign({latitudeDelta: 0.0421, longitudeDelta: 0.0922}, props.patientCoordinates)}
            //this.state.patientLocation)}
            // showsUserLocation
            style={{flex: 1}}
        >
            <Marker coordinate={props.patientCoordinates}>
                <MapMarker text={props.patientAddress} />
            </Marker>
        </MapView>);
}
