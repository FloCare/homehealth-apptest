import React, {Component} from 'react';
import firebase from 'react-native-firebase';
import {AddPatientScreen} from '../components/AddPatientScreen';
import {screenNames} from '../utils/constants';

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
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }

    onNavigatorEvent(event) {
        // STOP GAP solution. Will be removed when redux is used
        if(event.id === 'didAppear') {
            firebase.analytics().setCurrentScreen(screenNames.addPatient, screenNames.addPatient);
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
                    emergencyContact={values.emergencyContact}
                    notes={values.notes}
                    lat={values.lat}
                    long={values.long}
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
}

export default AddPatientScreenContainer;
