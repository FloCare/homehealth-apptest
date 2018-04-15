import React, {Component} from 'react';
import {PatientListScreen} from '../components/PatientListScreen';
import {MyRealm, Patient} from '../utils/data/schema';

class PatientListScreenContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            patientList: []
        };
        this.getSectionData = this.getSectionData.bind(this);
        this.createSectionListFromPatientListData =
            this.createSectionListFromPatientListData.bind(this);
    }

    componentDidMount() {
        this.getSectionData();
    }

    getSectionData() {
        const patientList = MyRealm.objects(Patient.schema.name);
        const sortedPatientList = patientList.sorted('name');
        const sectionedPatientList = this.createSectionListFromPatientListData(sortedPatientList);
        this.setState({patientList: sectionedPatientList});
    }

    createSectionListFromPatientListData(patientList) {
        const sectionedPatientList = patientList.map((item) => {
            return {title: item.name[0], data: [item]};
        });
        return sectionedPatientList;
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
