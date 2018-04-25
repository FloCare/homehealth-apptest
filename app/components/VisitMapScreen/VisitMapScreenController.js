import React, {Component} from 'react';
import SortableList from 'react-native-sortable-list';
import {View} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import Polyline from '@mapbox/polyline';
import {VisitRow} from './VisitRow';
import {floDB, Visit} from '../../utils/data/schema';

function ControlPanel(props) {
    return (
        <View>
            <SortableList
                data={props.rowData}
                renderRow={VisitRow}
                onChangeOrder={props.onChangeOrder}
                onReleaseRow={props.onReleaseRow}
            />
        </View>
    );
}

function MapPanel(props) {
    return (
        <MapView
            style={{flex: 1}}
            initialRegion={Object.assign({latitudeDelta: 0.0922, longitudeDelta: 0.0421}, {
                latitude: 37.4,
                longitude: -122
            })}
        >
            {props.markerCoordinates.map((markerCoordinate) => <Marker coordinate={markerCoordinate} />)}
            {props.polylines.map((polylineCoordinate) => {
                console.log('once');
                return (<MapView.Polyline
                    coordinates={polylineCoordinate}
                    strokeWidth={3}
                    strokeColor="blue"
                />);
            })}
        </MapView>
    );
}

class VisitMapScreenController extends Component {
    constructor(props) {
        super(props);
        this.visitResultObject = floDB.objects(Visit);
        // this.visitResultObject = props.visitResultObject;

        this.state = {
            polylines: []
        };
        this.onChangeOrder = this.onChangeOrder.bind(this);
    }

    async getAllPolylines() {
        const newPolylines = [];
        //TODO safety checks
        for (let i = 0; i < this.visitResultObject.length - 1; i++) {
            newPolylines.push(await this.getPolyBetweenTwoPoints(this.visitResultObject[i].getAddress().coordinates, this.visitResultObject[i + 1].getAddress().coordinates));
        }
        this.setState({polylines: newPolylines});
    }

    async getPolyBetweenTwoPoints(startLoc, destinationLoc) {
        try {
            const resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc.latitude},${startLoc.longitude}&destination=${destinationLoc.latitude},${destinationLoc.longitude}`);
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

    onChangeOrder(nextOrder) {
        //write to visits their order number
        for (const nextOrderElement of nextOrder) {
            console.log(`:::${nextOrderElement}`);
        }
        //forceupdate
        //asyn fetch all polylines and set state
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <MapPanel
                    style={{flex: 1}}
                    markerCoordinates={this.visitResultObject.map((visitObject) => {
                        const x = visitObject.getAddress().coordinates;
                        console.log(`r: ${x}, ${x.latitude}, ${x.longitude}`);
                        return x;
                    })}
                    polylines={this.state.polylines}
                />
                <ControlPanel
                    style={{flex: 1}}
                    rowData={[
                        {
                            key: 'hah4'
                        },
                        {
                            key: 'hah3'
                        },
                        {
                            key: 'hah2'
                        },
                        {
                            key: 'hah1'
                        },
                    ]}
                    onChangeOrder={this.onChangeOrder}
                />
            </View>
        );
    }
}

export {VisitMapScreenController};
