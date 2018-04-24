import React from 'react';
import SortableList from 'react-native-sortable-list';
import {View} from 'react-native';
import {MapView, Marker} from 'react-native-maps';

function ControlPanel(props) {
    return (
        <View>
            <SortableList
                data={props.rowData}
                renderRow={props.renderRow}
                onChangeOrder={props.onChangeOrder}
            />
        </View>
    );
}

function MapPanel(props) {
    return (
        <MapView>
            {props.markerCoordinates.map((markerCoordinate) => <Marker coordinate={markerCoordinate} />)}
            {props.polylineCoordinates.map((polylineCoordinate) => <MapView.Polyline
                coordinates={polylineCoordinate}
                strokeWidth={3}
                strokeColor="blue"
            />)}
        </MapView>
    );
}

class VisitMapScreenController extends Component {
    constructor(props) {
        super(props);
        this.visitResultObject = props.visitResultObject;

        this.onChangeOrder = this.onChangeOrder.bind(this);
    }

    async getAllPoly() {

    }

    async getPolyBetweenTwoPoints(startLoc, destinationLoc) {
        try {
            const resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}`);
            const respJson = await resp.json();
            const points = Polyline.decode(respJson.routes[0].overview_polyline.points);
            return points.map((point) => ({
                    latitude: point[0],
                    longitude: point[1]
                }));
        } catch (error) {
            return error;
        }
    }

    getAllPolylines() {

    }

    onChangeOrder(nextOrder){
        for (const nextOrderElement of nextOrder) {
            console.log(":::"+nextOrderElement)
        }
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <MapPanel
                    markerCoordinates={...}
                    polylineCoordinates={...}
                />
                <ControlPanel
                    data={...}
                    renderRow={...}
                    onChangeOrder={this.onChangeOrder}
                />
            </View>
        );
    }
}