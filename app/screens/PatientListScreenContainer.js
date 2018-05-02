import React, {Component} from 'react';
import {PatientListScreen} from '../components/PatientListScreen';
import {floDB, Patient} from '../utils/data/schema';
import {screenNames} from '../utils/constants';
import {createSectionedListFromRealmObject} from '../utils/collectionUtils';
import {styles} from '../components/common/styles';

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

    static NavigatorStyle = styles.navigatorStyle;

    constructor(props) {
        super(props);
        this.state = {
            patientList: [],
            patientCount: 0,      // not always a count of patientList
            selectedPatient: props.selectedPatient,
        };
        this.getSectionData = this.getSectionData.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.onItemPressed = this.onItemPressed.bind(this);
        this.onPatientAdded = this.onPatientAdded.bind(this);
        this.navigateTo = this.navigateTo.bind(this);
        this.navigateToAddPatient = this.navigateToAddPatient.bind(this);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
        this.handleListUpdate = this.handleListUpdate.bind(this);
    }

    componentDidMount() {
        this.getSectionData(null);
        floDB.addListener('change', this.handleListUpdate);
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
        if (event.id === 'willAppear') {
            let title = `Patients (${this.state.patientCount})`;
            this.props.navigator.setTitle({
                title 
            });
        }
        if (event.id === 'willDisappear') {
            this.setState({selectedPatient: null});
        }
        if (event.type === 'NavBarButtonPress') { // this is the event type for button presses
            if (event.id === 'add') {       // this is the same id field from the static navigatorButtons definition
                this.navigateToAddPatient();
            }
        }
    }

    onPatientAdded(patientId) {
        this.setState({selectedPatient: patientId});
    }

    getSectionData(query) {
        if (!query) {
            const patientList = floDB.objects(Patient.schema.name);
            const sortedPatientList = patientList.sorted('name');
            const patientCount = sortedPatientList.length;
            const sectionedPatientList = createSectionedListFromRealmObject(sortedPatientList);
            this.setState({
                patientList: sectionedPatientList,
                patientCount
            });
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

    componentWillUnMount() {
        floDB.removeListener('change', this.handleListUpdate);
    }

    handleListUpdate() {
        // Todo: Don't query again
        this.getSectionData(null);
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

    navigateToAddPatient() {
        const prop = {
                onPatientAdded: this.onPatientAdded,
        };
        const title = 'Add Patient';
        this.navigateTo(screenNames.addPatient, title, prop);
    }

    render() {
        return (
            <PatientListScreen
                patientList={this.state.patientList}
                patientCount={this.state.patientCount}
                onSearch={this.onSearch}
                selectedPatient={this.state.selectedPatient}
                onItemPressed={this.onItemPressed}
                onPressAddPatient={this.navigateToAddPatient}
            />
        );
    }
}

export default PatientListScreenContainer;
