import React from 'react';
import MapView, {Marker} from 'react-native-maps';
import {Linking} from 'react-native';
import {MapMarker} from '../common/PatientMap/MapMarker';

export function PatientDetailMapComponent(props) {
    return (
        <MapView
            provider={'google'}
            scrollEnabled={false}
            rotateEnabled={false}
            zoomEnabled={false}
            loadingEnabled
            minZoomLevel={15}
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
                onCalloutPress={() => { Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${props.patientCoordinates.latitude},${props.patientCoordinates.longitude}`).catch(err => console.error('An error occurred', err)); }}
                onPress={() => {
                    Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${props.patientCoordinates.latitude},${props.patientCoordinates.longitude}`).catch(err => console.error('An error occurred', err));
                }}
            >
                <MapMarker />
            </Marker>
        </MapView>);
}
