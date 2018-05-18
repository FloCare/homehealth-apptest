import React, {Component} from 'react';
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
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    onNavigatorEvent(event) {
        if(event.id === 'didAppear') {
            this.timeout = setTimeout(() => {
                this.props.navigator.showModal({
                    screen: screenNames.passcodeVerificationScreen,
                    backButtonHidden: true,
                    passProps: {
                        inactivity: true
                    }
                });
            }, 30000);
        }
        if(event.id === 'didDisappear') {
            clearTimeout(this.timeout);
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

            // console.log('Switching the TAB');
            // this.props.navigator.switchToTab({
            //     tabIndex: 1,
            // });
            // console.log('Resetting screen navigation');
            // this.props.navigator.resetTo({
            //     screen: this.state.nextScreen,
            //     title: 'Patients',
            //     passProps: {
            //         selectedPatient: patientId
            //     },
            // });
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
                    name={values.name}
                    streetAddress={values.streetAddress}
                    apartmentNo={values.apartmentNo}
                    zip={values.zip}
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
