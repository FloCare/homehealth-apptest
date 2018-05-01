import React, {Component} from 'react';
import {View} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import Polyline from '@mapbox/polyline';
import {VisitRow} from './VisitRow';
import {floDB, Visit, VisitOrder} from '../../utils/data/schema';
import {DragDropList} from '../common/DragDropList';
import {MapMarker} from '../common/PatientMap/MapMarker';
import {arrayToMap} from '../../utils/collectionUtils';
import {VisitCard} from '../common/visitCard';
import {SortedVisitListContainer} from '../common/SortedVisitListContainer';

//TODO refactor this code: rate limiting, efficiency, setting correct viewport, mapmarker component design

class VisitMapScreenController extends Component {
    constructor(props) {
        super(props);
        this.visitOrderObject = floDB.objectForPrimaryKey(VisitOrder, props.date.valueOf());
        this.state = {
            date: props.date,
            visitOrderList: this.getUpdateOrderedVisitList(this.visitOrderObject.visitList),
            polylines: [],
    };
        this.onChangeOrder = this.onChangeOrder.bind(this);
        this.getAllPolylines = this.getAllPolylines.bind(this);

        this.getAllPolylines();
    }

    async getAllPolylines() {
        const newPolylines = [];
        //TODO safety checks
        // console.log(`attempting polyline fetch${this.state.orderedVisitIDListObject.length}`);

        const visitOrderList = this.state.visitOrderList;
        for (let i = 0; i < visitOrderList.length - 1; i++) {
            console.log('attempting polyline fetch');
            try {
                const polyLineResponse = await this.getPolyBetweenTwoPoints(visitOrderList[i].getAddress().coordinates,
                                                                                visitOrderList[i + 1].getAddress().coordinates);
                newPolylines.push(polyLineResponse);
            } catch (error) {
                console.log(error);
            }
        }
        console.log('all done');

        this.setState({polylines: newPolylines});
    }



    async getDirectionsDataBetweenPoints(startLoc, destinationLoc) {
        try {
            const resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc.latitude},${startLoc.longitude}&destination=${destinationLoc.latitude},${destinationLoc.longitude}`);
            return await resp.json();
        } catch (error) {
            console.log('directions api call threw error');
            console.log(error);
            throw error;
        }
    }

    async extractInformationFromDirectionApiResponse(respJson) {
        const points = Polyline.decode(respJson.routes[0].overview_polyline.points);
        const geoData = {};
        geoData.polyline = points.map((point) => ({
            latitude: point[0],
            longitude: point[1]
        }));
        geoData.bounds = respJson.routes[0].bounds;
        return geoData;
    }

    async getProcessedGeoDataBetweenTwoPoints(startLoc, destinationLoc) {
        try {
            const respJson = this.getDirectionsDataBetweenPoints(startLoc, destinationLoc);
            return await this.extractInformationFromDirectionApiResponse(respJson);
        } catch (error) {
            console.log('error log: getProcessedGeoDataBetweenTwoPoints');
            throw error;
        }
    }

    getUpdateOrderedVisitList(visitList) {
        for (let i = 0; i < visitList.length; i++) {
            if (visitList[i].isDone) {
                return visitList.slice(0, i);
            }
        }
        return visitList;
    }

    onChangeOrder(nextOrder) {
        this.setState({visitOrderList: this.getUpdateOrderedVisitList(nextOrder)});
        this.getAllPolylines();
        this.props.onOrderChange(nextOrder);
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <MapPanel
                    markerData={this.state.visitOrderList.map((visit) =>
                         ({
                            coordinates: visit.getAddress().coordinates,
                            name: visit.getAssociatedName()
                        })
                    )}
                    polylines={this.state.polylines}
                />
                <ControlPanel
                    date={this.state.date}
                    onChangeOrder={this.onChangeOrder}
                />
            </View>
        );
    }
}

function ControlPanel(props) {
    return (
        <View style={{backgroundColor: '#45ceb1', paddingTop: 10, paddingBottom: 10}}>
            <SortedVisitListContainer
                date={props.date}
                renderWithCallback={VisitRow}
                isCompletedHidden
                onOrderChange={props.onChangeOrder}
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
