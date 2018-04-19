import React, {Component} from 'react';
import {PatientDetailScreen} from '../components/PatientDetailScreen';
import {MyRealm, Patient} from '../utils/data/schema';

class PatientDetailScreenContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            patientDetail: {}
        };
    }

    componentDidMount() {
        this.getPatientDetails();
    }

    getPatientDetails() {
        // Todo: Remove this hard coded query - This screen always comes on top of another screen
        const patientDetails = MyRealm.objects(Patient.schema.name).filtered('name = "Joe Burns"');
        if (patientDetails && patientDetails.length > 0) {
            this.setState({patientDetail: patientDetails[0]});
        }
    }

    render() {
        return (
          <PatientDetailScreen
              patientDetail={this.props.patientDetail ? this.props.patientDetail : this.state.patientDetail}
          />
        );
    }
}

export default PatientDetailScreenContainer;
