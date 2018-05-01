import React, {Component} from 'react';
import update from 'immutability-helper';
import {PatientDetailScreen} from '../components/PatientDetailScreen';
import {floDB, Patient} from '../utils/data/schema';
import {screenNames} from '../utils/constants';

class PatientDetailScreenContainer extends Component {
    static navigatorButtons = {
        rightButtons: [
            {
                icon: require('../../resources/editButton.png'),
                id: 'edit', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                buttonColor: '#fffff'
            }
        ]
    };

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
    }

    componentDidMount() {
        this.getPatientDetails(this.props.patientId);
    }

    onPressAddVisit() {
        console.log('Add Visit Button is Pressed. Navigate to the add visit screen ...');
        this.props.navigator.push({
            screen: screenNames.addVisitScreen,
            navigatorStyle: {
                tabBarHidden: true
            }
        });
    }

    onPressAddNotes() {
        this.props.navigator.push({
            screen: screenNames.addNote,
            animated: true,
            animationType: 'fade',
            title: 'Add Notes',
            passProps: {
                patientId: this.state.patientDetail.patientID,
                name: this.state.patientDetail.name
            },
            navigatorStyle: {
                tabBarHidden: true
            }
        });
    }

    onPressEditInfo() {
        this.props.navigator.push({
            screen: screenNames.addPatient,
            animated: true,
            animationType: 'fade',
            title: 'Edit Patient Information',
            navigatorStyle: {
                tabBarHidden: true
            },
            passProps: {
                values: {
                    patientID: this.state.patientDetail.patientID,
                    name: this.state.patientDetail.name,
                    addressID: this.state.patientDetail.address.addressID,
                    streetAddress: this.state.patientDetail.address.streetAddress,
                    apartmentNo: this.state.patientDetail.address.apartmentNo,
                    zip: this.state.patientDetail.address.zipCode,
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
        if (event.type === 'NavBarButtonPress') { // this is the event type for button presses
            if (event.id === 'edit') {    // this is the same id field from the static navigatorButtons definition
                // Todo: Open the edit patient information screen here
                console.log('Edit Button is pressed ...');
                this.onPressEditInfo();
            }
        }
    }

    onRegionChangeComplete() {
        console.log('Calling callout on map');
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
            //     moment().utc().startOf('day').valueOf()).sorted('isDone');
            // const visits = episode.visits.sorted([['midnightEpochOfVisit', true], ['miles', false])

            const completedVisits = episode.visits.filtered('isDone = true').sorted('midnightEpochOfVisit');
            const newVisits = episode.visits.filtered('isDone = false').sorted('midnightEpochOfVisit', false);
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

    setMarkerRef(element) {
        this.marker = element;
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

            console.log('Fetched the lat long for this user: ', latitude, longitude);

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
            console.log(result.status);
            console.log(result.results[0].geometry.location);
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
