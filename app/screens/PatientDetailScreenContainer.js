import React, {Component} from 'react';
import {PatientDetailScreen} from '../components/PatientDetailScreen';
import {floDB, Patient} from '../utils/data/schema';
import {screenNames} from '../utils/constants';

class PatientDetailScreenContainer extends Component {
    static navigatorButtons = {
        rightButtons: [
            {
                icon: require('/Users/pymd/flo/mtp/resources/ic_location_on_black_24dp.png'), // for icon button, provide the local image asset name
                id: 'edit', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
            }
        ]
    };

    constructor(props) {
        super(props);
        this.state = {
            navigateToScreen: screenNames.addNote,
            patientDetail: {}
        };
        this.onPressAddNotes = this.onPressAddNotes.bind(this);
        this.onPressAddVisit = this.onPressAddVisit.bind(this);
        this.getPatientDetails = this.getPatientDetails.bind(this);
        // settings this up to listen on navigator events
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    componentDidMount() {
        this.getPatientDetails(this.props.patientId);
    }

    onPressAddVisit() {
        console.log('Add Visit Button is Pressed. Navigate to the add visit screen ...');
    }

    onPressAddNotes() {
        console.log('Add Notes Button is Pressed. Navigate to the add notes screen ...');
        this.props.navigator.push({
            screen: this.state.navigateToScreen,
            animated: true,
            animationType: 'fade',
            title: 'Add Notes',
            backbuttonHidden: true,
            passProps: {
                patientId: this.state.patientDetail.patientID,
                name: this.state.patientDetail.name
            }
        });
    }

    // this is the onPress handler for the navigation header 'Edit' button
    onNavigatorEvent(event) {
        if (event.type === 'NavBarButtonPress') { // this is the event type for button presses
            if (event.id === 'edit') {    // this is the same id field from the static navigatorButtons definition
                // Todo: Open the edit patient information screen here
                console.log('Edit Button is pressed ...');
            }
        }
    }

    getPatientDetails(patientId) {
        if (!patientId) {
            this.setState({patientDetail: {}});
        } else {
            const patientDetails = floDB.objects(Patient.schema.name).filtered('patientID = $0', patientId);
            if (patientDetails && patientDetails.length > 0) {
                this.setState({patientDetail: patientDetails[0]});
            }
        }
    }

    render() {
        return (
          <PatientDetailScreen
              patientDetail={this.state.patientDetail}
              onPressAddVisit={this.onPressAddVisit}
              onPressAddNotes={this.onPressAddNotes}
          />
        );
    }
}

export default PatientDetailScreenContainer;
