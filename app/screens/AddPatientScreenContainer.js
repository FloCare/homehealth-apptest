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
            navigateToScreen: screenNames.patientList,
        };
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(patientId) {
        // Todo: navigate away based on state (either to AddVisits, PatientList or PatientDetail)
        // Todo: Pass data accordingly
        this.props.navigator.push({
            screen: this.state.navigateToScreen,
            animated: true,
            animationType: 'fade',
            title: 'Patients',
            backbuttonHidden: true,
            passProps: {
                selectedPatient: patientId,      // add the selected patient Object for hightlighting
                patientCount: 50                 // add the patient Count for displaying in header
            }
        });
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
