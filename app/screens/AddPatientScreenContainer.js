import React, {Component} from 'react';
import {AddPatientScreen} from '../components/AddPatientScreen';

class AddPatientScreenContainer extends Component {
    /*
        Container Component - has states
     */
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(patientId) {
        if (this.props.edit) {
            this.props.navigator.pop();
        } else {
            this.props.navigator.pop();
            // Todo: If the user came from 'Add Visit', don't switch tabs
            // this.props.navigator.switchToTab({
            //     tabIndex: 1,
            //     title: 'Patients',
            //     passProps: {
            //         selectedPatient: patientId,
            //         patientCount: 50                    // Todo: Fix this
            //     }
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
