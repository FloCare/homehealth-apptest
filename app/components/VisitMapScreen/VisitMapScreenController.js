import React, {Component} from 'react';
import {Image, Text, View} from 'react-native';
import firebase from 'react-native-firebase';
import {connect} from 'react-redux';
import * as MapUtils from '../../utils/MapUtils';
import {Images} from '../../Images';
import {MapPanel} from './MapPanel';
import {ControlPanel} from './ControlPanel';
import {screenNames, eventNames, parameterValues} from '../../utils/constants';
import {VisitService} from '../../data_services/VisitServices/VisitService';
import {ScreenWithCalendarComponent} from '../common/screenWithCalendarComponent';

//TODO refactor this code: rate limiting, efficiency, setting correct viewport, mapmarker component design

class VisitMapScreenContainer extends Component {
    static getViewportFromVisitCoordinates(visitList) {
        const coordinatesList = [];
        for (const visit of visitList) {
            const coordinates = visit.coordinates;
            if (!coordinates) {
                //TODO what to do in this case?
                console.log(visit);
                console.error(`visit:${visit} doesn't have an associated address or address coordinates`);
            }
            coordinatesList.push([coordinates.latitude, coordinates.longitude]);
        }
        return MapUtils.getViewPortFromBounds(coordinatesList);
    }

    constructor(props) {
        super(props);
        this.state = {
            viewport: this.getCurrentViewport(props.filteredVisits),
            polylines: [],
        };
        this.onOrderChange = this.onOrderChange.bind(this);
        this.getCurrentViewport = this.getCurrentViewport.bind(this);
        this.getAllPolylines = this.getAllPolylines.bind(this);

        this.getAllPolylines(props.filteredVisits.map(visit => visit.coordinates));
    }

    componentWillReceiveProps(nextProps) {
        console.log('VisitMapScreenContainer received props');

        this.getAllPolylines(nextProps.filteredVisits.map(visit => visit.coordinates));
    }

    getCurrentViewport(visitList) {
        if (visitList.length === 0) { return this.props.defaultViewport; }
        return VisitMapScreenContainer.getViewportFromVisitCoordinates(visitList);
    }

    async getAllPolylines(coordinatesList) {
        console.log('attempting polyline fetch');
        if (coordinatesList.length < 2) { return; }

        const newPolylines = [];
        const boundsCoordinates = [];
        let totalDistance;
        let noErrorFlag = true;
        //TODO safety checks

        try {
            const geoDataObject = await MapUtils.getProcessedDataForOrderedList(coordinatesList);

            newPolylines.push(geoDataObject.polyline);
            boundsCoordinates.push([geoDataObject.bounds.southwest.lat, geoDataObject.bounds.southwest.lng]);
            boundsCoordinates.push([geoDataObject.bounds.northeast.lat, geoDataObject.bounds.northeast.lng]);

            totalDistance = geoDataObject.totalDistance;
        } catch (error) {
            console.log('caught an error in VisitMapScreenController get polyLines');
            console.log(error);
            noErrorFlag = false;
            throw (error);
        }
        if (noErrorFlag) {
            //note that this total distance is not currently being used since it doesnt incorporate the value of distance to next visit
            this.setState({polylines: newPolylines, viewport: MapUtils.getViewPortFromBounds(boundsCoordinates), totalDistance});
        }
    }

    onOrderChange(nextOrder) {
        firebase.analytics().logEvent(eventNames.VISIT_ACTIONS, {
            type: parameterValues.DND
        });

        const mutableNextOrder = Array.from(nextOrder);
        this.props.orderedVisitID.forEach(visitID => {
            if (!nextOrder.includes(visitID)) mutableNextOrder.push(visitID);
        });
        //TODO clear out the currently displayed stale value then
        VisitService.getInstance().setVisitOrderForDate(mutableNextOrder, this.props.date);
    }

    render() {
        console.log(`show completed ${this.props.showCompleted}`);
        return (
            <View style={{flex: 1}}>
                <MapPanel
                    viewport={this.state.viewport}
                    markerData={this.props.filteredVisits.map((visit, index) =>
                        ({
                            coordinates: visit.coordinates,
                            name: visit.name,
                            type: visit.isPatientVisit ? 'patient' : 'place',
                            label: `${String.fromCharCode('A'.charCodeAt(0) + index)}`
                        })
                    )}
                    polylines={this.state.polylines}
                    totalDistance={this.props.remainingDistance}
                />
                <ControlPanel
                    onOrderChange={this.onOrderChange}
                    orderedVisitID={this.props.filteredVisits.map(visit => visit.visitID)}
                />
            </View>
        );
    }
}

function mapStateToProps(state) {
    const todaysVisits = getVisitsWithAddressFromReduxState(state);
    const defaultViewport = VisitMapScreenContainer.getViewportFromVisitCoordinates(todaysVisits);

    let remainingDistance = 0;

    todaysVisits.forEach(miniVisit => {
        const visit = state.visits[miniVisit.visitID];
        remainingDistance += visit.visitMiles.computedMiles && !visit.isDone ? visit.visitMiles.computedMiles : 0;
    });

    return {
        date: state.date,
        orderedVisitID: state.visitOrder,
        filteredVisits: todaysVisits.filter(visit => !visit.isDone),
        remainingDistance: remainingDistance ? remainingDistance.toFixed(2) + ' mi' : undefined,
        defaultViewport
    };
}

export function getVisitsWithAddressFromReduxState(state) {
    return state.visitOrder.map(visitID => {
        const visit = state.visits[visitID];
        let visitSubject;
        if (visit.isPatientVisit) {
            const patientID = visit.patientID;
            visitSubject = state.patients[patientID];
        } else {
            const placeID = visit.placeID;
            visitSubject = state.places[placeID];
        }
        const address = state.addresses[visitSubject.addressID];
        const coordinates = address.latitude && address.latitude ? {
            latitude: address.latitude,
            longitude: address.longitude,
        } : undefined;

        return {
            visitID: visit.visitID,
            name: visitSubject.name,
            coordinates,
            plannedStartTime: visit.plannedStartTime,
            isDone: visit.isDone,
            isPatientVisit: visit.isPatientVisit
        };
    });
}

export default connect(mapStateToProps)(ScreenWithCalendarComponent(VisitMapScreenContainer));
