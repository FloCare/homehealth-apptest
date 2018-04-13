import React, {Component} from 'react';
import {PatientListScreen} from '../components/PatientListScreen';

class PatientListScreenContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            patientList: {}
        };
    }

    render() {
        return (
            <PatientListScreen
                patientList={this.state.patientList}
            />
        );
    }
}

export default PatientListScreenContainer;
