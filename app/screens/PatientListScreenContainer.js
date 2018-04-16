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
        this.onSearch = this.onSearch.bind(this);
    }

    componentDidMount() {
        this.getSectionData(null);
    }

    onSearch(query) {
        this.getSectionData(query);
    }

    getSectionData(query) {
        if (!query) {
            const patientList = MyRealm.objects(Patient.schema.name);
            const sortedPatientList = patientList.sorted('name');
            const sectionedPatientList = this.createSectionListFromPatientListData(sortedPatientList);
            this.setState({patientList: sectionedPatientList});
        } else {
            // Todo: Can improve querying Logic:
            // Todo: use higher weight for BEGINSWITH and lower for CONTAINS
            // Todo: Search on other fields ???
            const queryStr = `name CONTAINS "${query.toString()}"`;
            const patientList = MyRealm.objects(Patient.schema.name).filtered(queryStr);
            const sortedPatientList = patientList.sorted('name');
            const sectionedPatientList = this.createSectionListFromPatientListData(sortedPatientList);
            this.setState({patientList: sectionedPatientList});
        }
    }

    createSectionListFromPatientListData(patientList) {
        // Fix List Sectioning Logic
        console.log(patientList);
        const sectionedPatientList = patientList.map((item) => {
            return {title: item.name[0], data: [item]};
        });
        console.log(sectionedPatientList);
        return sectionedPatientList;
    }

    render() {
        return (
            <PatientListScreen
                patientList={this.state.patientList}
                onSearch={this.onSearch}
            />
        );
    }
}

export default PatientListScreenContainer;
