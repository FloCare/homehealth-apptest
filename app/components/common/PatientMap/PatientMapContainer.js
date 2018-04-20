import React, {Component} from 'react';
import MapView, {Marker} from 'react-native-maps';
import {MapMarker} from './MapMarker';

class PatientMapContainer extends Component {
    state = {
        patientAddress: '3556, Crowfield Street, Orlando, FL',
        patientLocation: {
            latitude: 37.78825,
            longitude: -122.4324
        }
    };
    // state = {patientAddress: props.patientAddress, patientLocation: props.patientLocation};

    render() {
        return (
            <MapView
                initialRegion={Object.assign({latitudeDelta: 0.0922, longitudeDelta: 0.0421}, this.state.patientLocation)}
                showsUserLocation
                style={{flex: 1}}
            >
                <Marker coordinate={this.state.patientLocation}>
                    <MapMarker text={this.state.patientAddress} />
                </Marker>
            </MapView>
        );
    }
}

export {PatientMapContainer};
