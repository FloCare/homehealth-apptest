import React from 'react';
import MapView, {Marker, Callout} from 'react-native-maps';
import firebase from 'react-native-firebase';
import {MapMarker} from '../common/PatientMap/MapMarker';
import {CustomCallout} from '../common/PatientMap/CustomCallout';
import {eventNames, parameterValues} from '../../utils/constants';
import {navigateTo} from '../../utils/MapUtils';

const onPress = (coordinates, address) => {
    firebase.analytics().logEvent(eventNames.PATIENT_ACTIONS, {
        type: parameterValues.NAVIGATION
    });
    navigateTo(coordinates.latitude, coordinates.longitude, address);
};

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
                ref={props.setMarkerRef}
                // onPress={() => onPress(props.patientCoordinates, props.patientAddress)}
                // Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${props.patientCoordinates.latitude},${props.patientCoordinates.longitude}`).catch(err => console.error('An error occurred', err));
            >
                <MapMarker />
                <Callout onPress={() => onPress(props.patientCoordinates, props.navigationAddress)} style={{marginTop: 10}}>
                    <CustomCallout address={props.displayAddress} />
                </Callout>
            </Marker>
        </MapView>);
}
