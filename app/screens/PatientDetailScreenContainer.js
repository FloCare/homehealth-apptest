import React, {Component} from 'react';
import {Platform} from 'react-native';
import firebase from 'react-native-firebase';
import update from 'immutability-helper';
import {PatientDetailScreen} from '../components/PatientDetailScreen';
import {floDB, Patient} from '../utils/data/schema';
import {screenNames, eventNames, parameterValues} from '../utils/constants';
import {Images} from '../Images';
import {todayMomentInUTCMidnight} from '../utils/utils';
import {PatientDataService} from "../data_services/PatientDataService";

class PatientDetailScreenContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            patientDetail: {},
            lastVisit: null,
            nextVisit: null,
        };
        this.onPressAddNotes = this.onPressAddNotes.bind(this);
        this.onPressAddVisit = this.onPressAddVisit.bind(this);
        this.onPressEditInfo = this.onPressEditInfo.bind(this);
        this.getPatientDetails = this.getPatientDetails.bind(this);
        this.parseResponse = this.parseResponse.bind(this);
        // settings this up to listen on navigator events
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
        this.setMarkerRef = this.setMarkerRef.bind(this);
        this.onRegionChangeComplete = this.onRegionChangeComplete.bind(this);
        this.handleDBUpdate = this.handleDBUpdate.bind(this);

        const patientDetails = floDB.objectForPrimaryKey(Patient, props.patientId);
        if (patientDetails && patientDetails.isLocallyOwned) {
            this.showEditNavButton();
        }
    }

    componentDidMount() {
        this.getPatientDetails(this.props.patientId);
        floDB.addListener('change', this.handleDBUpdate);
    }

    onPressAddVisit() {
        firebase.analytics().logEvent(eventNames.ADD_VISIT, {
            VALUE: 1
        });
        this.props.navigator.showLightBox({
            screen: screenNames.addVisitsForPatientScreen,
            style: {
                backgroundBlur: 'dark',
                backgroundColor: '#00000070',
                tapBackgroundToDismiss: true
            },
            passProps: {
                patientId: this.state.patientDetail.patientID
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

    onPressEditInfo() {
        this.props.navigator.push({
            screen: screenNames.addPatient,
            title: 'Edit Patient Information',
            navigatorStyle: {
                tabBarHidden: true
            },
            passProps: {
                values: {
                    patientID: this.state.patientDetail.patientID,
                    firstName: this.state.patientDetail.firstName,
                    lastName: this.state.patientDetail.lastName,
                    addressID: this.state.patientDetail.address.addressID,
                    streetAddress: this.state.patientDetail.address.streetAddress,
                    apartmentNo: this.state.patientDetail.address.apartmentNo,
                    zipCode: this.state.patientDetail.address.zipCode,
                    city: this.state.patientDetail.address.city,
                    state: this.state.patientDetail.address.state,
                    primaryContact: this.state.patientDetail.primaryContact,
                    emergencyContact: this.state.patientDetail.emergencyContact,
                    //diagnosis: this.state.patientDetail.episodes[0].diagnosis,
                    notes: this.state.patientDetail.notes,
                    lat: this.state.patientDetail.address.lat,
                    long: this.state.patientDetail.address.long,
                },
                edit: true
            }
        });
    }

    // this is the onPress handler for the navigation header 'Edit' button
    onNavigatorEvent(event) {
        if (event.id === 'willAppear') {
            let {firstName, lastName} = this.state.patientDetail;
            const title = PatientDataService.constructName(firstName, lastName);
            this.props.navigator.setTitle({
                title
            });
        }
        if (event.type === 'NavBarButtonPress') {
            if (event.id === 'edit') {    // this is the same id field from the static navigatorButtons definition
                this.onPressEditInfo();
            }
        }
        // STOP GAP solution. Will be removed when redux is used
        if (event.id === 'didAppear') {
            firebase.analytics().setCurrentScreen(screenNames.patientDetails, screenNames.patientDetails);
        }
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
            this.setState({patientDetail: patientDetails});
            const episode = patientDetails.episodes[0];
            // const visits = episode.visits.filtered(
            //     'midnightEpochOfVisit==$0',
            //     todayMomentInUTCMidnight().valueOf()).sorted('isDone');
            // const visits = episode.visits.sorted([['midnightEpochOfVisit', true], ['miles', false])
            const today = todayMomentInUTCMidnight();
            const completedVisits = episode.visits.filtered(`midnightEpochOfVisit <= ${today}`).filtered('isDone = true').sorted('midnightEpochOfVisit');
            const newVisits = episode.visits.filtered(`midnightEpochOfVisit >= ${today}`).filtered('isDone = false').sorted('midnightEpochOfVisit', false);
            if (completedVisits.length > 0) {
                this.setState({lastVisit: completedVisits[0]});
            }
            if (newVisits && newVisits.length > 0) {
                this.setState({nextVisit: newVisits[0]});
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

    showEditNavButton() {
        this.props.navigator.setButtons(
            Platform.select({
                ios: {
                    rightButtons: [
                        {
                            id: 'edit', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                            buttonColor: '#fffff',
                            systemItem: 'edit' //iOS only
                        }
                    ]
                },
                android: {
                    rightButtons: [
                        {
                            icon: Images.editButton,
                            id: 'edit', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                            buttonColor: '#fffff',
                        }
                    ]
                }
            })
        );
    }

    setMarkerRef(element) {
        this.marker = element;
    }

    componentWillUnmount() {
        floDB.removeListener('change', this.handleDBUpdate);
    }

    handleDBUpdate() {
        //console.log('inside handleDB update listener, patinet Id:', this.props.patientId);
        this.getPatientDetails(this.props.patientId);
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
                nextVisit={this.state.nextVisit}
                lastVisit={this.state.lastVisit}
                onPressAddVisit={this.onPressAddVisit}
                onPressAddNotes={this.onPressAddNotes}
                showCallout={this.onRegionChangeComplete}
                setMarkerRef={this.setMarkerRef}
            />
        );
    }
}

export default PatientDetailScreenContainer;
