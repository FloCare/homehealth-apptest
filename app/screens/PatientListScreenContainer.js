import React, {Component} from 'react';
import {PatientListScreen} from '../components/PatientListScreen';
import {floDB, Patient} from '../utils/data/schema';
import {screenNames} from '../utils/constants';

class PatientListScreenContainer extends Component {
    static navigatorButtons = {
        rightButtons: [
            {
                icon: require('../../resources/ic_location_on_black_24dp.png'), // for icon button, provide the local image asset name
                id: 'add', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
            }
        ]
    };

    constructor(props) {
        super(props);
        this.state = {
            patientList: []
        };
        this.getSectionData = this.getSectionData.bind(this);
        this.createSectionListFromPatientListData =
            this.createSectionListFromPatientListData.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.onItemPressed = this.onItemPressed.bind(this);
        this.navigateTo = this.navigateTo.bind(this);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    componentDidMount() {
        this.getSectionData(null);
    }

    onSearch(query) {
        this.getSectionData(query);
    }

    onItemPressed(item) {
        this.navigateTo(
            screenNames.patientDetails,
            item.item.name, {
            patientId: item.item.patientID
        });
    }

    onNavigatorEvent(event) {
        if (event.type === 'NavBarButtonPress') { // this is the event type for button presses
            if (event.id === 'add') {       // this is the same id field from the static navigatorButtons definition
                // Todo: Navigate to the AddPatient Screen
                this.navigateTo(
                    screenNames.addPatient,
                    'New Patient'
                );
            }
        }
    }

    getSectionData(query) {
        if (!query) {
            const patientList = floDB.objects(Patient.schema.name);
            const sortedPatientList = patientList.sorted('name');
            const sectionedPatientList = this.createSectionListFromPatientListData(sortedPatientList);
            this.setState({patientList: sectionedPatientList});
        } else {
            // Todo: Can improve querying Logic:
            // Todo: use higher weight for BEGINSWITH and lower for CONTAINS
            // Todo: Search on other fields ???
            const queryStr = `name CONTAINS[c] "${query.toString()}"`;
            const patientList = floDB.objects(Patient.schema.name).filtered(queryStr);
            const sortedPatientList = patientList.sorted('name');
            const sectionedPatientList = this.createSectionListFromPatientListData(sortedPatientList);
            this.setState({patientList: sectionedPatientList});
        }
    }

    navigateTo(screen, title, props) {
        this.props.navigator.push({
            screen,
            animated: true,
            animationType: 'fade',
            title,
            backbuttonHidden: true,
            passProps: props,
            navigatorStyle: {
                tabBarHidden: true
            }
        });
    }

    createSectionListFromPatientListData(patientList) {
        const sections = [];
        const sectionTitles = {};
        // Todo: Don't use for..in syntax
        for (const index in patientList) {
            const patient = patientList[index];
            const key = sectionTitles[patient.name[0]];

            if (key !== undefined) {
                sections[key].data.push(patient);
            } else {
                const ind = sections.length;
                sectionTitles[patient.name[0]] = ind;
                sections.push({title: patient.name[0], data: [patient]});
            }
        }
        return sections;
    }

    render() {
        const {selectedPatient} = this.props;
        return (
            <PatientListScreen
                patientList={this.state.patientList}
                onSearch={this.onSearch}
                selectedPatient={selectedPatient}
                onItemPressed={this.onItemPressed}
            />
        );
    }
}

export default PatientListScreenContainer;
