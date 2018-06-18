import React, {Component} from 'react';
import {Linking, Alert, Platform} from 'react-native';
import firebase from 'react-native-firebase';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import RNSecureKeyStore from 'react-native-secure-key-store';
import {PatientListScreen} from '../components/PatientListScreen';
import {floDB, Patient} from '../utils/data/schema';
import {screenNames, eventNames, parameterValues} from '../utils/constants';
import {createSectionedListFromRealmObject} from '../utils/collectionUtils';
import {styles} from '../components/common/styles';
import {Images} from '../Images';
import {patientDataService} from '../data_services/PatientDataService';

class PatientListScreenContainer extends Component {
    static navigatorButtons = {
        rightButtons: [
            Platform.select({
                android: {
                    icon: Images.addButton, // for icon button, provide the local image asset name
                    id: 'add', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                },
                ios: {
                    id: 'add',
                    systemItem: 'add'
                }
            })

        ]
    };

    static NavigatorStyle = styles.navigatorStyle;

    constructor(props) {
        super(props);
        this.state = {
            searchText: null,
            patientList: [],
            patientCount: 0,      // not always a count of patientList
            selectedPatient: props.selectedPatient,
            refreshing: false,
            isTeamVersion: undefined
        };
        RNSecureKeyStore.get('accessToken').then(() => this.setState({isTeamVersion: true}), () => this.setState({isTeamVersion: false}));
        this.patientMoreMenu = [
            {id: 'Notes', title: 'Add Notes'},
            {id: 'Call', title: 'Call'},
            {id: 'Maps', title: 'Show on maps'},
            {id: 'Visits', title: 'Add Visit'},
            {id: 'DeletePatient', title: 'Remove Patient', localOnly: true},
        ];
        this.getSectionData = this.getSectionData.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.onItemPressed = this.onItemPressed.bind(this);
        this.onPatientAdded = this.onPatientAdded.bind(this);
        this.navigateTo = this.navigateTo.bind(this);
        this.navigateToAddPatient = this.navigateToAddPatient.bind(this);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
        this.handleListUpdate = this.handleListUpdate.bind(this);
        this.onPressPopupButton = this.onPressPopupButton.bind(this);
    }

    componentDidMount() {
        this.getSectionData(null);
        floDB.addListener('change', this.handleListUpdate);
    }

    onSearch(query) {
        this.setState({searchText: query});
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
            const title = `Patients (${this.state.patientCount})`;
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
        // STOP GAP solution. Will be removed when redux is used
        if (event.id === 'didAppear') {
            firebase.analytics().setCurrentScreen(screenNames.patientList, screenNames.patientList);
        }
    }

    onPatientAdded(patientId) {
        this.setState({selectedPatient: patientId});
    }

    onPressPopupButton(buttonPressed, item) {
        switch (buttonPressed) {
            case 'Notes':
                firebase.analytics().logEvent(eventNames.PATIENT_ACTIONS, {
                    type: parameterValues.EDIT_NOTES
                });
                this.navigateTo(
                    screenNames.addNote,
                    'Add Notes',
                    {
                        patientId: item.patientID,
                        name: item.name
                    }
                );
                break;
            case 'Call':
                firebase.analytics().logEvent(eventNames.PATIENT_ACTIONS, {
                    type: parameterValues.CALL
                });
                if (item && item.primaryContact) {
                    if (Platform.OS === 'android') {
                        Linking.openURL(`tel: ${item.primaryContact}`);
                    } else {
                        RNImmediatePhoneCall.immediatePhoneCall(item.primaryContact);
                    }
                } else {
                    Alert.alert('Warning', 'Please add a valid mobile number as the patient primary contact');
                }
                break;
            case 'Maps':
                // Todo: Move boilerplate like this to a schema helper method
                firebase.analytics().logEvent(eventNames.PATIENT_ACTIONS, {
                    VALUE: 1
                });
                if (
                    item &&
                    item.address &&
                    item.address.coordinates &&
                    (item.address.coordinates.latitude && item.address.coordinates.longitude)
                ) {
                    Linking.openURL(
                        `https://www.google.com/maps/dir/?api=1&destination=${item.address.coordinates.latitude},${item.address.coordinates.longitude}`).catch(err => console.error('An error occurred', err)
                    );
                } else {
                    Alert.alert('Warning', 'Please enter a valid address for the patient');
                }
                break;
            case 'Visits':
                firebase.analytics().logEvent(eventNames.ADD_VISIT, {
                    VALUE: 1
                });
                this.props.navigator.showLightBox({
                    screen: screenNames.addVisitsForPatientScreen,
                    style: {
                        backgroundBlur: 'dark',
                        backgroundColor: '#00000070',
                        tapBackgroundToDismiss: true
                    },
                    passProps: {
                        patientId: item.patientID
                    },
                });
                break;
            case 'DeletePatient':
                const archivePatient = (id) => {
                    console.log('Archiving patient');
                    try {
                        patientDataService.archivePatient(id);
                        Alert.alert('Success', 'Patient deleted successfully');
                    } catch (err) {
                        console.log('ERROR while archiving patient:', err);
                        Alert.alert('Error', 'Unable to delete patient. Please try again later');
                    }
                };
                Alert.alert(
                    'Caution',
                    'All your patient related data will be deleted. Do you wish to continue?',
                    [
                        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                        {text: 'OK', onPress: () => archivePatient(item.patientID)},
                    ]
                );
                break;
            default:
                console.log('Invalid option pressed');
                break;
        }
    }

    getSectionData(query) {
        if (!query) {
            const patientList = floDB.objects(Patient.schema.name).filtered('archived = false');
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
            const patientList = floDB.objects(Patient.schema.name).filtered('archived = false').filtered(queryStr);
            const sortedPatientList = patientList.sorted('name');
            const sectionedPatientList = createSectionedListFromRealmObject(sortedPatientList);
            this.setState({patientList: sectionedPatientList});
        }
    }

    componentWillUnmount() {
        floDB.removeListener('change', this.handleListUpdate);
    }

    handleListUpdate() {
        this.props.navigator.setTitle({
            title: `Patients (${floDB.objects(Patient).filtered('archived = false').length})`
        });

        // Todo: Don't query again
        this.getSectionData(null);
    }

    navigateTo(screen, title, props) {
        this.props.navigator.push({
            screen,
            title,
            passProps: props,
            navigatorStyle: {
                tabBarHidden: true,
                largeTitle: false
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

    onRefresh() {
        patientDataService.updatePatientListFromServer()
            .then((result) => {
                this.setState({refreshing: false});

                const newPatientsCount = result.additions === 0 ? undefined : result.additions;
                const deletedPatientsCount = result.deletions === 0 ? undefined : result.deletions;

                let subtitle = (newPatientsCount ? `${newPatientsCount} new patients added` : '') + (deletedPatientsCount ? `${newPatientsCount ? ', and ' : ''}${deletedPatientsCount} existing patients removed` : '');
                if (!newPatientsCount && !deletedPatientsCount) {
                    subtitle = 'No new changes';
                }
                Alert.alert(
                    'Refresh Completed',
                    subtitle
                );
            })
            .catch(error => {
                this.setState({refreshing: false});
                console.log(error);
                Alert.alert(
                    'Refresh Failed',
                );
            });
        this.setState({refreshing: true});
    }

    render() {
        return (
            <PatientListScreen
                onRefresh={this.state.isTeamVersion ? this.onRefresh.bind(this) : undefined}
                refreshing={this.state.refreshing}
                patientList={this.state.patientList}
                patientCount={this.state.patientCount}
                searchText={this.state.searchText}
                onSearch={this.onSearch}
                selectedPatient={this.state.selectedPatient}
                onItemPressed={this.onItemPressed}
                onPressAddPatient={this.navigateToAddPatient}
                onPressPopupButton={this.onPressPopupButton}
                menu={this.patientMoreMenu}
            />
        );
    }
}

export default PatientListScreenContainer;
