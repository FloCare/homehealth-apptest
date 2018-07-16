import React, {Component} from 'react';
import {Image, Text, View} from 'react-native';
import firebase from 'react-native-firebase';
import {connect} from 'react-redux';
import * as MapUtils from '../../utils/MapUtils';
import {Images} from '../../Images';
import {MapPanel} from './MapPanel';
import {ControlPanel} from './ControlPanel';
import {screenNames, eventNames, parameterValues} from '../../utils/constants';
import {visitDataService} from '../../data_services/VisitServices/VisitDataService';
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

    onOrderChange(nextOrder) {
        firebase.analytics().logEvent(eventNames.VISIT_ACTIONS, {
            type: parameterValues.DND
        });

        const mutableNextOrder = Array.from(nextOrder);
        this.props.orderedVisitID.forEach(visitID => {
            if (!nextOrder.includes(visitID)) mutableNextOrder.push(visitID);
        });
        visitDataService.setVisitOrderForDate(mutableNextOrder, this.props.date);
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
                    totalDistance={this.state.totalDistance}
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
    const todaysVisits = state.visitOrder.map(visitID => {
        const visit = state.visits[visitID];
        let visitOwner;
        if (visit.isPatientVisit) {
            const patientID = visit.patientID;
            visitOwner = state.patients[patientID];
        } else {
            const placeID = visit.placeID;
            visitOwner = state.places[placeID];
        }
        const address = state.addresses[visitOwner.addressID];
        const coordinates = address.latitude && address.latitude ? {
            latitude: address.latitude,
            longitude: address.longitude,
        } : undefined;

        return {
            visitID: visit.visitID,
            name: visitOwner.name,
            coordinates,
            isDone: visit.isDone,
            isPatientVisit: visit.isPatientVisit
        };
    });
    const defaultViewport = VisitMapScreenContainer.getViewportFromVisitCoordinates(todaysVisits);

    return {
        date: state.date,
        orderedVisitID: state.visitOrder,
        filteredVisits: todaysVisits.filter(visit => !visit.isDone),
        defaultViewport
    };
}

export default connect(mapStateToProps)(ScreenWithCalendarComponent(VisitMapScreenContainer));
