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

    onSubmit() {
        // Todo: navigate away based on state (either to AddVisits, PatientList or PatientDetail
        // Todo: Pass data accordingly
        this.props.navigator.push({
            screen: this.state.navigateToScreen,
            animated: true,
            animationType: 'fade',
            title: 'Patients',
            backbuttonHidden: true,
            passProps: {
                selectedPatient: 'Piyush',      // add the selected patient Object for hightlighting
                patientCount: 50                // add the patient Count for displaying in header
            }
        });
    }

    render() {
        return (
            // Add header (navigation module)
            <AddPatientScreen
                onSubmit={this.onSubmit}
            />
        );
    }
}

export default AddPatientScreenContainer;
