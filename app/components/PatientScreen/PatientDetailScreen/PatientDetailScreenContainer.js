import React, {Component} from 'react';
import firebase from 'react-native-firebase';
import update from 'immutability-helper';
import moment from 'moment';
import {PatientDetailScreen} from './index';
import {floDB, Patient} from '../../../utils/data/schema';
import {
    screenNames,
    eventNames,
    parameterValues,
    visitSubjects,
} from '../../../utils/constants';
import {todayMomentInUTCMidnight} from '../../../utils/utils';
import {PatientDataService} from '../../../data_services/PatientDataService';
import {EpisodeDataService} from '../../../data_services/EpisodeDataService';

class PatientDetailScreenContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            patientDetail: {},
            lastVisit: null,
            nextVisit: null,
            selectedVisitsDate: this.props.selectedVisitsDate || todayMomentInUTCMidnight(),
            currentWeekVisitData: {}
        };
        this.onPressAddNotes = this.onPressAddNotes.bind(this);
        this.onPressAddVisit = this.onPressAddVisit.bind(this);
        this.getPatientDetails = this.getPatientDetails.bind(this);
        this.parseResponse = this.parseResponse.bind(this);
        this.setMarkerRef = this.setMarkerRef.bind(this);
        this.onRegionChangeComplete = this.onRegionChangeComplete.bind(this);
        this.handleDBUpdate = this.handleDBUpdate.bind(this);

        const patientDetails = floDB.objectForPrimaryKey(Patient, props.patientId);
        if (patientDetails && patientDetails.isLocallyOwned) {
            this.showEditNavButton();
        }
        this.visitDataSubscriber = null;
        this.episodeId = null;
    }

    componentDidMount() {
        // TODO Can we move this to constructor
        this.getPatientDetails(this.props.patientId);
        floDB.addListener('change', this.handleDBUpdate);
        const selectedVisitsDate = this.props.selectedVisitsDate || todayMomentInUTCMidnight();
        const weekStartDate = moment(selectedVisitsDate).startOf('isoWeek');
        const currentWeekVisitData = this.getVisitDataForWeek(weekStartDate.valueOf());
        const visitSectionData = this.getSelectedDateVisits(this.state.selectedVisitsDate, currentWeekVisitData);
        this.setState({
            currentWeekVisitData,
            visitSectionData
        });
    }

    onPressAddVisit() {
        firebase.analytics().logEvent(eventNames.ADD_VISIT, {
            VALUE: 1
        });
        this.props.navigator.showLightBox({
            screen: screenNames.addOrRescheduleVisitsLightBox,
            style: {
                backgroundBlur: 'dark',
                backgroundColor: '#00000070',
                tapBackgroundToDismiss: true
            },
            passProps: {
                patientId: this.state.patientDetail.patientID,
                visitSubject: visitSubjects.PATIENT
            },
        });
    }

    onPressAddNotes() {
        firebase.analytics().logEvent(eventNames.PATIENT_ACTIONS, {
            type: parameterValues.EDIT_NOTES
        });
        const {firstName, lastName} = this.state.patientDetail;
        this.props.navigator.push({
            screen: screenNames.addNote,
            animated: true,
            animationType: 'slide-horizontal',
            title: 'Notes',
            passProps: {
                patientId: this.state.patientDetail.patientID,
                name: PatientDataService.constructName(firstName, lastName)
            },
            navigatorStyle: {
                tabBarHidden: true
            }
        });
    }

    onRegionChangeComplete() {
        //console.log('Calling callout on map');
        this.marker.showCallout();
    }

    getPatientDetails(patientId) {
        if (!patientId) {
            this.setState({patientDetail: {}, lastVisit: null, nextVisit: null});
        } else {
            const patientDetails = floDB.objectForPrimaryKey(Patient, patientId);
            try {
                const newState = {patientDetail: patientDetails};
                this.episodeId = patientDetails.getFirstEpisode().episodeID;
                this.setState(newState);
            } catch (err) {
                console.log('Error while setting state: ', err);
            }

            if (patientDetails) {
                // If latLong not present, fire geocode API
                if (!(patientDetails.address.hasCoordinates())) {
                    console.log('LAT LONG DONT EXIST FOR THIS USER.... TRYING TO FETCH IT');

                    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${patientDetails.address.streetAddress}&key=AIzaSyDiWZ3198smjFepUa0ZAoHePSnSxuhTzRU`)
                        .then((response) => response.json())
                        .then((responseJson) =>
                            this.parseResponse(responseJson, patientId))
                        .catch((error) =>
                            console.log('Error while fetching Geocoded address: ', error));
                } else {
                    const latLong = patientDetails.address.coordinates;
                    console.log('LAT LONG EXISTS FOR THIS USER: ', latLong.latitude, latLong.longitude);
                }
            }
        }
    }

    setMarkerRef(element) {
        this.marker = element;
    }

    componentWillUnmount() {
        if (this.visitDataSubscriber) {
            this.visitDataSubscriber.unsubscribe();
        }
    }

    handleDBUpdate() {
        //console.log('inside handleDB update listener, patinet Id:', this.props.patientId);
        this.getPatientDetails(this.props.patientId);
    }

    visitTimeSorter = (visit1, visit2) => {
        if (!visit1.plannedStartTime && !visit2.plannedStartTime) return 0;
        if (!visit1.plannedStartTime) return 1;
        if (!visit2.plannedStartTime) return -1;
        return moment(visit1.plannedStartTime).valueOf() > moment(visit2.plannedStartTime).valueOf() ? 1 : -1;
    }

    onVisitDataChange = (newVisitData) => {
        const newVisitSectionData = newVisitData[this.state.selectedVisitsDate.valueOf()];
        if (newVisitSectionData) {
            newVisitSectionData.sort(this.visitTimeSorter);
        }
        this.setState({currentWeekVisitData: newVisitData, visitSectionData: newVisitSectionData});
    }

    getVisitDataForWeek = (date) => {
        const episodeID = this.episodeId;
        if (episodeID) {
            const startDate = date.valueOf();
            const endDate = moment(date).add(1, 'weeks').valueOf();
            if (this.visitDataSubscriber) {
                this.visitDataSubscriber.unsubscribe();
            }
            this.visitDataSubscriber = EpisodeDataService.getInstance()
            .subscribeToVisitsForDays(episodeID, startDate, endDate, this.onVisitDataChange);
            const currentWeekVisitData = this.visitDataSubscriber.currentData;
            return currentWeekVisitData;
        }
    }

    handleWeekChange = (date) => {
        const currentWeekVisitData = this.getVisitDataForWeek(date);
        this.setState({currentWeekVisitData});
    }

    getSelectedDateVisits = (date, currentWeekVisitData = this.state.currentWeekVisitData) => {
        const parsedDate = moment(date).valueOf();
        const selectedDateVisits = currentWeekVisitData[parsedDate] || [];
        console.log(selectedDateVisits);
        if (selectedDateVisits.length > 0) {
            selectedDateVisits.sort(this.visitTimeSorter);
        }
        return selectedDateVisits;
    }

    handleDateSelection = (date) => {
        if (!date.isSame(this.state.selectedVisitsDate, 'day')) {
            const visitSectionData = this.getSelectedDateVisits(date);
            this.setState({
                selectedVisitsDate: date,
                visitSectionData});
        }
    }

    parseResponse(result, patientId) {
        if (result.status === 'OK' &&
            result.results &&
            result.results.length > 0 &&
            result.results[0].geometry &&
            result.results[0].geometry.location
        ) {
            const loc = result.results[0].geometry.location;
            const latitude = loc.lat;
            const longitude = loc.lng;

            //console.log('Fetched the lat long for this user: ', latitude, longitude);

            // Todo: Revisit this
            // Write to DB first
            const patient = floDB.objectForPrimaryKey(Patient, patientId);
            try {
                floDB.write(() => {
                    patient.address.coordinates = {
                        latitude,
                        longitude
                    };
                });
            } catch (err) {
                // Todo Don't fail silently
                console.log('Error while writing to DB: ', err);
            }

            // Then Set State
            const newState = update(this.state.patientDetail, {
                address: {
                    $set: {
                        coordinates: {
                            latitude,
                            longitude
                        }
                    }
                }
            });
            this.setState({patientDetail: newState});
        } else {
            console.log('Failed to parse Geocode Response from Google APIs');
            //console.log(result.status);
            //console.log(result.results[0].geometry.location);
        }
    }

    render() {
        return (
            <PatientDetailScreen
                patientDetail={this.state.patientDetail}
                onPressAddVisit={this.onPressAddVisit}
                selectedVisitsDate={this.state.selectedVisitsDate}
                onSelectVisitsDate={this.handleDateSelection}
                visitSectionData={this.state.visitSectionData}
                currentWeekVisitData={this.state.currentWeekVisitData}
                onWeekChanged={this.handleWeekChange}
                onPressAddNotes={this.onPressAddNotes}
                showCallout={this.onRegionChangeComplete}
                setMarkerRef={this.setMarkerRef}
            />
        );
    }
}

export default PatientDetailScreenContainer;
