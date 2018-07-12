import React, {Component} from 'react';
import firebase from 'react-native-firebase';
import {AddPatientScreen} from '../components/AddPatientScreen';
import {screenNames} from '../utils/constants';
import {Images} from "../Images";
import {Alert, Platform} from 'react-native';
import {PatientDataService} from "../data_services/PatientDataService";

class AddPatientScreenContainer extends Component {
    /*
        Container Component - has states
     */

    constructor(props) {
        super(props);
        this.state = {
            nextScreen: props.nextScreen || null
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    archivePatientAndNavigateToRoot = (id) => {
        try {
            this.patientDataService().archivePatient(id);
            Alert.alert('Success',
                'Patient deleted successfully',
                [{text: 'OK', onPress: () => this.props.navigator.popToRoot()}],
                {cancelable: false}
            );
        } catch (err) {
            console.log('ERROR while archiving patient:', err);
            Alert.alert('Error', 'Unable to delete patient. Please try again later');
        }
    };

    confirmAndDeletePatient = () => {
        Alert.alert(
            'Caution',
            'All your patient related data will be deleted. Do you wish to continue?',
            [
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'OK', onPress: () => this.archivePatientAndNavigateToRoot(this.props.values.patientID)},
            ]
        );
    }

    onNavigatorEvent(event) {
        // STOP GAP solution. Will be removed when redux is used
        if(event.id === 'didAppear') {
            firebase.analytics().setCurrentScreen(screenNames.addPatientScreen, screenNames.addPatientScreen);
        }
        if (event.type === 'NavBarButtonPress') {
            if (event.id === 'deletePatient') {
                this.confirmAndDeletePatient();
            }
        }
    }

    onSubmit(patientId) {
        if (this.props.edit) {
            this.props.navigator.pop();
        } else if (this.state.nextScreen) {
            if (this.props.onPatientAdded) {
                this.props.onPatientAdded(patientId);
            }
            this.props.navigator.push({
                screen: this.state.nextScreen,
                passProps: {
                    selectedPatient: patientId,
                }
            });
        } else if (this.props.onPatientAdded) {
            this.props.onPatientAdded(patientId);
            this.props.navigator.pop();
        } else {
            this.props.navigator.pop();
        }
    }

    render() {
        const {edit, values} = this.props;
        if (values) {
            return (
                // Add header (navigation module)
                <AddPatientScreen
                    onSubmit={this.onSubmit}
                    edit={edit}
                    patientID={values.patientID}
                    addressID={values.addressID}
                    firstName={values.firstName}
                    lastName={values.lastName}
                    streetAddress={values.streetAddress}
                    apartmentNo={values.apartmentNo}
                    zipCode={values.zipCode}
                    city={values.city}
                    state={values.state}
                    country={null}
                    primaryContact={values.primaryContact}
                    notes={values.notes}
                    lat={values.lat}
                    long={values.long}
                    dateOfBirth={values.dateOfBirth}
                    emergencyContactInfo={values.emergencyContactInfo}
                />
            );
        } else {
            return (
                <AddPatientScreen
                    onSubmit={this.onSubmit}
                    edit={edit}
                />
            );
        }
    }

    // External Services
    patientDataService = () => {
        return PatientDataService.getInstance();
    };
}

export default AddPatientScreenContainer;
