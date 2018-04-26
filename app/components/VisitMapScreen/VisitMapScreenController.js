import React, {Component} from 'react';
import {View} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import Polyline from '@mapbox/polyline';
import {VisitRow} from './VisitRow';
import {floDB, Visit, VisitOrder} from '../../utils/data/schema';
import {DragDropList} from '../common/DragDropList';
import {MapMarker} from '../common/PatientMap/MapMarker';
import {arrayToMap} from '../../utils/collectionUtils';

//TODO refactor this code: rate limiting, efficiency, setting correct viewport, mapmarker component design

class VisitMapScreenController extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: props.date,
            polylines: [],
            visitResultObject: props.visitResultObject ?
                                        props.visitResultObject :
                                            floDB.objects(Visit).filtered('midnightEpochOfVisit==$0', props.date.valueOf()),

            orderedVisitIDListObject: props.orderedVisitIdListObject ?
                                        props.orderedVisitIdListObject :
                                            floDB.objectForPrimaryKey(VisitOrder, props.date.valueOf())

    };
        this.onChangeOrder = this.onChangeOrder.bind(this);
        this.getAllPolylines = this.getAllPolylines.bind(this);

        this.getAllPolylines();
    }

    async getAllPolylines() {
        const newPolylines = [];
        //TODO safety checks
        console.log(`attempting polyline fetch${this.state.orderedVisitIDListObject.length}`);

        const visitByID = arrayToMap(this.state.visitResultObject, 'visitID');
        const orderedVisitIds = this.state.orderedVisitIDListObject.visitIDList;

        for (let i = 0; i < orderedVisitIds.length - 1; i++) {
            console.log('attempting polyline fetch');
            try {
                const polyLineResponse = await this.getPolyBetweenTwoPoints(visitByID.get(orderedVisitIds[i]).getAddress().coordinates,
                                                                            visitByID.get(orderedVisitIds[i + 1]).getAddress().coordinates);
                newPolylines.push(polyLineResponse);
            } catch (error) {
                console.log(error);
            }
        }
        console.log('all done');

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
            throw error;
        }
    }

    onChangeOrder(nextOrder) {
        console.log(this.state.orderedVisitIDListObject);
        floDB.write(() => {
            this.state.orderedVisitIDListObject.visitIDList = nextOrder.map((index) => this.state.orderedVisitIDListObject.visitIDList[index]);
        });
        console.log(this.state.orderedVisitIDListObject);
        this.getAllPolylines();
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <MapPanel
                    markerData={this.state.visitResultObject.map((visitObject) =>
                         ({
                            coordinates: visitObject.getAddress().coordinates,
                            name: visitObject.getAssociatedName()
                        })
                    )}
                    polylines={this.state.polylines}
                />
                <ControlPanel
                    visitResultObject={this.state.visitResultObject}
                    orderedVisitIds={this.state.orderedVisitIDListObject.visitIDList}
                    onChangeOrder={this.onChangeOrder}
                />
            </View>
        );
    }
}

function ControlPanel(props) {
    return (
        <View>
            <DragDropList
                orderedItemIDList={props.orderedVisitIds}
                dataObjectList={props.visitResultObject}
                dataObjectKey={'visitID'}
                onChangeOrder={props.onChangeOrder}
                renderRow={VisitRow}
            />
        </View>
    );
}

function MapPanel(props) {
    return (
        <MapView
            style={{flex: 1}}
            initialRegion={Object.assign({latitudeDelta: 0.0922, longitudeDelta: 0.0421}, {
                latitude: 37.3,
                longitude: -122
            })}
        >
            {props.markerData.map((markerData) => <Marker coordinate={markerData.coordinates}><MapMarker text={markerData.name} /></Marker>)}
            {props.polylines.map((polylineCoordinate) =>
                // console.log('once');
                // console.log(polylineCoordinate);
                (<MapView.Polyline
                    coordinates={polylineCoordinate}
                    strokeWidth={3}
                    strokeColor="blue"
                />))}
        </MapView>
    );
}

export {VisitMapScreenController};
