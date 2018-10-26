import React, {Component} from 'react';
import firebase from 'react-native-firebase';
import {connect} from 'react-redux';
import {VisitListScreen} from './visitListScreen';
import {floDB, Visit, Patient, Episode, VisitOrder} from '../../utils/data/schema';
import {screenNames, eventNames, parameterValues} from '../../utils/constants';
import {ScreenWithCalendarComponent} from '../common/screenWithCalendarComponent';
import * as MapUtils from '../../utils/MapUtils';
import {VisitService} from '../../data_services/VisitServices/VisitService';
import {getVisitsWithAddressFromReduxState} from '../VisitMapScreen/VisitMapScreenController';

class VisitListScreenContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: props.date,
            totalDistance: null,
            // showCalendar: false
        };

        this.navigateToAddVisitsScreen = this.navigateToAddVisitsScreen.bind(this);
        this.onOrderChange = this.onOrderChange.bind(this);
        // this.computeVisitDistance(this.props.orderedVisitID);
    }

    componentWillReceiveProps(nextProps) {
        console.log('component received props');
        const orderedVisits = floDB.objectForPrimaryKey(VisitOrder, nextProps.date.valueOf());
        if (!orderedVisits || orderedVisits.visitList.length === 0) {
            console.log('component did 0');
            this.props.navigator.pop();
        } else this.setState({date: nextProps.date});
    }

    // componentDidUpdate(prevProps) {
    //     if (this.needsDistanceRecompute(this.props.visits, prevProps.visits)) {
    //         this.computeVisitDistance(this.props.orderedVisitID);
    //     }
    // }
    //
    // needsDistanceRecompute(newVisits, oldVisits) {
    //     if (Object.keys(newVisits).length !== Object.keys(oldVisits).length) return true;
    //     return this.isVisitStatusChanged(newVisits, oldVisits);
    // }
    //
    // isVisitStatusChanged(newVisits, oldVisits) {
    //     for (const visitID in oldVisits) {
    //         const newVisit = newVisits[visitID];
    //         if (!newVisit || oldVisits[visitID].isDone !== newVisit.isDone) {
    //             return true;
    //         }
    //     }
    //     return false;
    // }

    navigateToAddVisitsScreen() {
        this.props.navigator.push({
            screen: screenNames.addVisitScreen,
            passProps: {
                date: this.state.date,
                // onDone: this.onOrderChange
            },
            navigatorStyle: {
                tabBarHidden: true
            }
        });
    }

    onOrderChange(newOrder) {
        firebase.analytics().logEvent(eventNames.VISIT_ACTIONS, {
            type: parameterValues.DND
        });
        VisitService.getInstance().setVisitOrderForDate(newOrder, this.props.date);
        // this.computeVisitDistance(newOrder);
    }

    showErrorMessage() {
        let lastNonNullTime = null;
        let showError = false;
        for (const visitID in this.props.orderedVisitID) {
            const currentVisitID = this.props.orderedVisitID[visitID];
            const currentVisit = this.props.visits[currentVisitID];
            if (!currentVisit.isDone) {
                if (lastNonNullTime && currentVisit.plannedStartTime) {
                    if (lastNonNullTime > currentVisit.plannedStartTime) {
                        showError = true;
                        break;
                    } else {
                        lastNonNullTime = currentVisit.plannedStartTime;
                    }
                } else {
                    lastNonNullTime = lastNonNullTime || currentVisit.plannedStartTime;
                }
            }
        }
        return showError;
    }

    // async computeVisitDistance(visitOrder) {
    //     const pendingVisits = visitOrder.filter((visitID) => this.props.visits[visitID] && !this.props.visits[visitID].isDone);
    //     const coordinatesList = pendingVisits.map((visitID) => this.props.visits[visitID].coordinates);
    //     let totalDistance = null;
    //     if (coordinatesList.length > 1) {
    //         this.setState({totalDistance});
    //         const geoDataObject = await MapUtils.getProcessedDataForOrderedList(coordinatesList);
    //         totalDistance = geoDataObject.totalDistance;
    //     }
    //     this.setState({totalDistance});
    // }

    render() {
        return (
            <VisitListScreen
                navigator={this.props.navigator}
                showError={this.showErrorMessage()}
                remainingDistance={this.props.remainingDistance}
                orderedVisitID={this.props.orderedVisitID}
                onAddVisitPress={this.navigateToAddVisitsScreen}
                onOrderChange={this.onOrderChange}
            />
        );
    }
}

function mapStateToProps(state) {
    const visitsWithCoordinates = getVisitsWithAddressFromReduxState(state);
    const getVisitCoordinates = (visitList, visitID) => (
        visitList.find((visit) => visit.visitID === visitID).coordinates
    );

    const visits = {};
    let remainingDistance = 0;

    for (const index in state.visitOrder) {
        const visitID = state.visitOrder[index];
        const visit = state.visits[visitID];
        visits[visitID] = {
            isDone: visit.isDone,
            plannedStartTime: visit.plannedStartTime,
            coordinates: getVisitCoordinates(visitsWithCoordinates, visitID)
        };
        remainingDistance += visit.visitMiles.computedMiles && !visit.isDone ? visit.visitMiles.computedMiles : 0;
    }
    return {
        date: state.date,
        orderedVisitID: state.visitOrder,
        remainingDistance: remainingDistance ? remainingDistance.toFixed(2) + ' mi' : undefined,
        visits
    };
}

export default connect(mapStateToProps)(ScreenWithCalendarComponent(VisitListScreenContainer));
