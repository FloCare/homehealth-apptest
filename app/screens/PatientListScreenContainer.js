import React, {Component} from 'react';
import {PatientListScreen} from '../components/PatientListScreen';
import {floDB, Patient} from '../utils/data/schema';
import {screenNames} from '../utils/constants';
import {createSectionedListFromRealmObject} from '../utils/collectionUtils';

class PatientListScreenContainer extends Component {
    static navigatorButtons = {
        rightButtons: [
            {
                icon: require('../../resources/addButton.png'), // for icon button, provide the local image asset name
                id: 'add', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                buttonColor: 'white'
            }
        ]
    };

    constructor(props) {
        super(props);
        this.state = {
            patientList: [],
        };
        this.getSectionData = this.getSectionData.bind(this);
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
                    'Add Patient'
                );
            }
        }
    }

    getSectionData(query) {
        if (!query) {
            const patientList = floDB.objects(Patient.schema.name);
            const sortedPatientList = patientList.sorted('name');
            const sectionedPatientList = createSectionedListFromRealmObject(sortedPatientList);
            this.setState({patientList: sectionedPatientList});
        } else {
            // Todo: Can improve querying Logic:
            // Todo: use higher weight for BEGINSWITH and lower for CONTAINS
            // Todo: Search on other fields ???
            const queryStr = `name CONTAINS[c] "${query.toString()}"`;
            const patientList = floDB.objects(Patient.schema.name).filtered(queryStr);
            const sortedPatientList = patientList.sorted('name');
            const sectionedPatientList = createSectionedListFromRealmObject(sortedPatientList);
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

    render() {
        return (
            <PatientListScreen
                patientList={this.state.patientList}
                onSearch={this.onSearch}
                selectedPatient={this.props.selectedPatient}
                onItemPressed={this.onItemPressed}
            />
        );
    }
}

export default PatientListScreenContainer;
