import React, { Component } from 'react';
import { PatientDetailScreen } from '../components/PatientDetailScreen';

class PatientDetailScreenContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            patientDetail: {}
        };
    }

    render() {
        return (
          <PatientDetailScreen
              patientDetail={this.state.patientDetail}
          />
        );
    }
}

export default PatientDetailScreenContainer;
