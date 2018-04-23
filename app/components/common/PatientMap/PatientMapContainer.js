import React, {Component} from 'react';
import MapView, {Marker} from 'react-native-maps';
import Polyline from '@mapbox/polyline';
import {MapMarker} from './MapMarker';

class PatientMapContainer extends Component {
    state = {
        patientAddress: '3556, Crowfield Street, Orlando, FL',
        patientLocation: {
            latitude: 37.78825,
            longitude: -122.4324
        },
        polylineCoordinates: []
    };
    // state = {patientAddress: props.patientAddress, patientLocation: props.patientLocation};

    componentDidMount() {
        this.getDirections('37.4, -122', `${this.state.patientLocation.latitude},${this.state.patientLocation.longitude}`);
    }

    async getDirections(startLoc, destinationLoc) {
        try {
            const resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}`);
            const respJson = await resp.json();
            const points = Polyline.decode(respJson.routes[0].overview_polyline.points);
            const coords = points.map((point) => ({
                    latitude: point[0],
                    longitude: point[1]
                }));
            this.setState({polylineCoordinates: coords});
            return coords;
        } catch (error) {
            return error;
        }
    }

    render() {
        return (
            <MapView
                initialRegion={Object.assign({latitudeDelta: 0.0922, longitudeDelta: 0.0421}, this.state.patientLocation)}
                showsUserLocation
                style={{flex: 1}}
            >
                <MapView.Polyline
                    coordinates={this.state.polylineCoordinates}
                    strokeWidth={3}
                    strokeColor="blue"
                />
                <Marker coordinate={this.state.patientLocation}>
                    <MapMarker text={this.state.patientAddress} />
                </Marker>
            </MapView>
        );
    }
}

export {PatientMapContainer};
