import React, {Component} from 'react';
import {Image, Text, View} from 'react-native';
import firebase from 'react-native-firebase';
import MapView, {Marker} from 'react-native-maps';
import * as MapUtils from '../../utils/MapUtils';
import {VisitRow} from './VisitRow';
import {floDB, VisitOrder} from '../../utils/data/schema';
import {MapMarker} from './MapMarker';
import {SortedVisitListContainer} from '../common/SortedVisitListContainer';
import {PrimaryColor, eventNames, parameterValues} from '../../utils/constants';
import {RenderIf} from '../../utils/data/syntacticHelpers';
import {Images} from "../../Images";

//TODO refactor this code: rate limiting, efficiency, setting correct viewport, mapmarker component design

class VisitMapScreenController extends Component {
    static navigatorButtons = {
        rightButtons: [
            {
                icon: Images.listView,
                id: 'list-view', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                buttonColor: '#fffff'
            },
            {
                id: 'calendar-picker',
                icon: Images.calendarSelected
            }
        ]
    };

    constructor(props) {
        super(props);
        this.visitOrderObject = floDB.objectForPrimaryKey(VisitOrder, props.date.valueOf());
        const visitOrderList = VisitMapScreenController.getUpdateOrderedVisitList(this.visitOrderObject.visitList, props.showCompleted);
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
                console.log(address);
                console.error(`visit:${visit} doesn't have an associated address or address coordinates`);
            }
            coordinates.push([address.latitude, address.longitude]);
        }
        return MapUtils.getViewPortFromBounds(coordinates);
    }

    async getAllPolylines() {
        console.log(`attempting polyline fetch${this.state.visitOrderList.length}`);

        if (this.state.visitOrderList.length < 2) { return; }
        const newPolylines = [];
        const boundsCoordinates = [];
        let totalDistance;
        let noErrorFlag = true;
        //TODO safety checks

        try {
            const geoDataObject = await MapUtils.getProcessedDataForOrderedList(this.state.visitOrderList.map(visit => visit.getAddress().coordinates));

            newPolylines.push(geoDataObject.polyline);
            boundsCoordinates.push([geoDataObject.bounds.southwest.lat, geoDataObject.bounds.southwest.lng]);
            boundsCoordinates.push([geoDataObject.bounds.northeast.lat, geoDataObject.bounds.northeast.lng]);

            totalDistance = geoDataObject.distance;
        } catch (error) {
            console.log(error);
            noErrorFlag = false;
            throw (error);
        }
        if (noErrorFlag) {
            this.setState({polylines: newPolylines, viewport: MapUtils.getViewPortFromBounds(boundsCoordinates), totalDistance});
        }
    }

    static getUpdateOrderedVisitList(visitList, showCompleted) {
        const updatedList = [];
        for (let i = 0; i < visitList.length; i++) {
            if (visitList[i].getAddress().coordinates && (!visitList[i].isDone || showCompleted)) updatedList.push(visitList[i]);
        }
        console.log(`${updatedList.length},${showCompleted}`);
        return updatedList;
    }

    onChangeOrder(nextOrder) {
        firebase.analytics().logEvent(eventNames.VISIT_ACTIONS, {
            'type': parameterValues.DND
        });
        this.setState({visitOrderList: VisitMapScreenController.getUpdateOrderedVisitList(nextOrder, this.props.showCompleted)}, this.getAllPolylines);
        this.props.onOrderChange(nextOrder);
    }

    render() {
        console.log(`show completed ${this.props.showCompleted}`);
        return (
            <View style={{flex: 1}}>
                <MapPanel
                    viewport={this.state.viewport}
                    markerData={this.state.visitOrderList.map((visit, index) =>
                        ({
                            coordinates: visit.getAddress().coordinates,
                            name: visit.getAssociatedName(),
                            type: visit.getPatient() ? 'patient' : 'place',
                            label: `${String.fromCharCode('A'.charCodeAt(0) + index)}`
                        })
                    )}
                    polylines={this.state.polylines}
                    totalDistance={this.state.totalDistance}
                />
                <ControlPanel
                    date={this.state.date}
                    onChangeOrder={this.onChangeOrder}
                    showCompleted={this.props.showCompleted}
                />
            </View>
        );
    }
}

function ControlPanel(props) {
    return (
        <View style={{backgroundColor: PrimaryColor, paddingTop: 10, paddingBottom: 10}}>
            <SortedVisitListContainer
                date={props.date}
                hideIncompleteAddress
                renderWithCallback={VisitRow}
                isCompletedHidden={!props.showCompleted}
                onOrderChange={props.onChangeOrder}
            />
        </View>
    );
}

function MapPanel(props) {
    return (
        <View style={{flex: 1}}>
            <MapView
                provider={'google'}
                style={{flex: 1}}
                region={props.viewport}
                loadingEnabled
            >
                {props.markerData.map((markerData) =>
                    <Marker coordinate={markerData.coordinates} anchor={{x: 0.25, y: 1}}>
                        <MapMarker type={markerData.type} label={markerData.label} />
                    </Marker>)}
                {props.polylines.map((polylineCoordinate) =>
                    // console.log('once');
                    // console.log(polylineCoordinate);
                    (<MapView.Polyline
                        coordinates={polylineCoordinate}
                        strokeWidth={3}
                        strokeColor={PrimaryColor}
                    />))}
            </MapView>
            {RenderIf(
                <View
                    style={{
                        height: 29,
                        backgroundColor: '#50a391',
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingLeft: 25
                    }}
                >
                    <Image
                        source={Images.time}
                    />
                    <Text style={{paddingLeft: 20, color: 'white'}}>
                        {props.totalDistance}
                    </Text>
                </View>,
                props.totalDistance
            )}
        </View>
    );
}

export {VisitMapScreenController};
