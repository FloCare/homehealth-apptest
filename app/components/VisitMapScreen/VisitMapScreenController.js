import React, {Component} from 'react';
import {View} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import Polyline from '@mapbox/polyline';
import geoJsonBounds from 'geojson-bounds';
import {VisitRow} from './VisitRow';
import {floDB, VisitOrder} from '../../utils/data/schema';
import {MapMarker} from '../common/PatientMap/MapMarker';
import {SortedVisitListContainer} from '../common/SortedVisitListContainer';

//TODO refactor this code: rate limiting, efficiency, setting correct viewport, mapmarker component design

class VisitMapScreenController extends Component {
    static navigatorButtons = {
        rightButtons: [
            {
                icon: require('../../../resources/listView.png'),
                id: 'list-view', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                buttonColor: '#fffff'
            },
            {
                id: 'calendar-picker',
                icon: require('../../../resources/calendar.png'),
            }
        ]
    };

    constructor(props) {
        super(props);
        this.visitOrderObject = floDB.objectForPrimaryKey(VisitOrder, props.date.valueOf());
        const visitOrderList = this.getUpdateOrderedVisitList(this.visitOrderObject.visitList);
        this.state = {
            date: props.date,
            visitOrderList,
            viewport: this.getInitialViewport(visitOrderList),
            polylines: [],
        };
        this.onChangeOrder = this.onChangeOrder.bind(this);
        this.getAllPolylines = this.getAllPolylines.bind(this);

        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

        this.getAllPolylines();
    }

    onNavigatorEvent(event) {
        if (this.props.onNavigatorEvent) {
            this.props.onNavigatorEvent(event);
        }
    }

    componentWillReceiveProps(nextProps) {
        console.log('component received props');
        const orderedVisits = floDB.objectForPrimaryKey(VisitOrder, nextProps.date.valueOf());
        if (!orderedVisits || orderedVisits.visitList.length === 0) {
            console.log('component did 0');
            this.props.navigator.pop();
        } else this.setState({date: nextProps.date});
    }

    getInitialViewport(visitOrderList) {
        const coordinates = [];
        for (const visit of visitOrderList) {
            const address = visit.getAddress();
            if (!address || !address.latitude || !address.latitude) {
                //TODO what to do in this case?
                console.log(visit);
                console.error(`visit:${visit} doesn't have an associated address or address coordinates`);
            }
            coordinates.push([address.latitude, address.longitude]);
        }
        return this.getViewPortFromBounds(coordinates);
    }

    async getAllPolylines() {
        const newPolylines = [];
        const boundsCoordinates = [];

        let noErrorFlag = true;
        //TODO safety checks
        // console.log(`attempting polyline fetch${this.state.orderedVisitIDListObject.length}`);

        const visitOrderList = this.state.visitOrderList;
        for (let i = 0; i < visitOrderList.length - 1; i++) {
            try {
                const geoDataObject = await this.getProcessedGeoDataBetweenTwoPoints(visitOrderList[i].getAddress().coordinates,
                    visitOrderList[i + 1].getAddress().coordinates);

                newPolylines.push(geoDataObject.polyline);
                boundsCoordinates.push([geoDataObject.bounds.southwest.lat, geoDataObject.bounds.southwest.lng]);
                boundsCoordinates.push([geoDataObject.bounds.northeast.lat, geoDataObject.bounds.northeast.lng]);
            } catch (error) {
                console.log(error);
                noErrorFlag = false;
                throw (error);
            }
        }
        if (noErrorFlag) {
            this.setState({polylines: newPolylines, viewport: this.getViewPortFromBounds(boundsCoordinates)});
        }
    }

    getViewPortFromBounds(boundsCoordinates) {
        console.log(boundsCoordinates);
        const multipoint = {
            type: 'MultiPoint',
            coordinates: boundsCoordinates
        };

        const [west, south, east, north] = geoJsonBounds.extent(multipoint);
        const viewport = {};

        //TODO wut?
        viewport.longitude = (south + north) / 2;
        viewport.latitude = (east + west) / 2;
        viewport.longitudeDelta = (east - west) * 1.5;
        viewport.latitudeDelta = (north - south) * 1.5;

        return viewport;
    }

    async getDirectionsDataBetweenPoints(startLoc, destinationLoc) {
        try {
            const resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc.latitude},${startLoc.longitude}&destination=${destinationLoc.latitude},${destinationLoc.longitude}`);
            const respJson = await resp.json();
            return respJson;
        } catch (error) {
            console.log('directions api call threw error');
            console.log(error);
            throw error;
        }
    }

    extractInformationFromDirectionApiResponse(respJson) {
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
            const respJson = await this.getDirectionsDataBetweenPoints(startLoc, destinationLoc);
            return this.extractInformationFromDirectionApiResponse(respJson);
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
                    viewport={this.state.viewport}
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
            initialRegion={props.viewport}
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
