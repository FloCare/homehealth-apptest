import React, {Component} from 'react';
import {Linking, Alert, Platform, NetInfo} from 'react-native';
import firebase from 'react-native-firebase';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import RNSecureKeyStore from 'react-native-secure-key-store';
import {PatientListScreen} from '../components/PatientListScreen';
import {floDB, Patient} from '../utils/data/schema';
import {
    screenNames,
    eventNames,
    parameterValues,
    visitSubjects,
} from '../utils/constants';
import {createSectionedListByField} from '../utils/collectionUtils';
import {styles} from '../components/common/styles';
import {Images} from '../Images';
import {PatientDataService} from '../data_services/PatientDataService';
import {addressDataService} from '../data_services/AddressDataService';
import {getAllPatientsBasicInfo} from '../utils/API/PatientAPI';

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
            selectedPatient: props.selectedPatient || null,
            allPatientsJson: undefined,
            searchingOnline: false,
        };
        NetInfo.addEventListener('connectionChange', this.onConnectionStatusChange.bind(this));
        NetInfo.isConnected.fetch().then(isConnected => {
            if (isConnected) this.setState({online: true});
            else this.setState({online: false});
        });

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
        if ((!this.state.searchText || this.state.searchText.length === 0) && query.length === 1) {
            this.setState({searchingOnline: true});
            getAllPatientsBasicInfo().then(respJson => {
                this.setState({allPatientsJson: respJson, searchingOnline: false}, () => {
                    this.getSectionData(this.state.searchText);
                });
            }).catch(error => {
                console.log('failed to fetch all patients');
                console.log(error);
                this.setState({allPatientsJson: null, searchingOnline: false});
            });
        }
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
            firebase.analytics().setCurrentScreen(screenNames.patientListScreen, screenNames.patientListScreen);
        }
    }

    onPatientAdded(patientId) {
        this.setState({selectedPatient: patientId});
    }

    //TODO the notion of item has changed from being a Realm object to being a plain JS object
    //TODO changed to this function pending.
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
                    type: parameterValues.CALL_PATIENT
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
                    screen: screenNames.addOrRescheduleVisitsLightBox,
                    style: {
                        backgroundBlur: 'dark',
                        backgroundColor: '#00000070',
                        tapBackgroundToDismiss: true
                    },
                    passProps: {
                        patientId: item.patientID,
                        visitSubject: visitSubjects.PATIENT
                    },
                });
                break;
            case 'DeletePatient':
                const archivePatient = (id) => {
                    console.log('Archiving patient');
                    try {
                        this.patientDataService().archivePatient(id);
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

    getFormattedPatientList = (patientList) => {
        const flatPatientList = PatientDataService.getFlatPatientList(patientList);
        flatPatientList.forEach(patient => {
            patient.address = {formattedAddress: addressDataService.getAddressByID(patient.addressID).formattedAddress};
        });
        return flatPatientList;
    };

    getSectionData(query) {
        if (!query) {
            const patientList = this.patientDataService().getAllPatients();
            const sortedPatientList = this.patientDataService().getPatientsSortedByName(patientList);
            const formattedPatientList = this.getFormattedPatientList(sortedPatientList);
            const patientCount = formattedPatientList.length;
            const sectionedPatientList = createSectionedListByField(formattedPatientList);
            const recentPatientsSection = this.createRecentPatientsSection(formattedPatientList);
            this.setState({
                patientList: recentPatientsSection ? [recentPatientsSection, ...sectionedPatientList] : sectionedPatientList,
                patientCount
            });
        } else {
            // Todo: Can improve querying Logic:
            // Todo: use higher weight for BEGINSWITH and lower for CONTAINS
            // Todo: Search on other fields ???
            const filteredPatientList = PatientDataService.getInstance().getPatientsFilteredByName(query);
            const formattedPatientList = this.getFormattedPatientList(filteredPatientList);
            const sectionedPatientList = createSectionedListByField(formattedPatientList);

            const onlinePatientsSection = this.createOnlinePatientsSection(query);
            this.setState({patientList: onlinePatientsSection ? [...sectionedPatientList, onlinePatientsSection] : sectionedPatientList});
        }
    }

    createRecentPatientsSection(patientList) {
        const recentPatientList = [];
        for (const patient of patientList) {
            if (patient.recentlyAssigned) {
                recentPatientList.push(patient);
            }
        }
        if (recentPatientList.length > 0) {
            return {title: 'New', data: recentPatientList};
        }
        return undefined;
    }

    onConnectionStatusChange(connectionInfo) {
        console.log(`Connection change, type: ${connectionInfo.type}, effectiveType: ${connectionInfo.effectiveType}`);
        if (connectionInfo.type !== 'none' && connectionInfo.type !== 'unknown') {
            this.setState({online: true}, () => { this.getSectionData(this.state.searchText); });
        } else {
            this.setState({online: false}, () => { this.getSectionData(this.state.searchText); });
        }
    }

    onPressOnlinePatient(patient) {
        this.props.navigator.showLightBox({
            screen: screenNames.onlinePatientLightBox,
            style: {
                backgroundBlur: 'dark',
                backgroundColor: '#00000070',
                tapBackgroundToDismiss: true
            },
            passProps: {
                patient,
            },
        });
    }

    createOnlinePatientsSection(query) {
        if (!this.state.online) return;

        if (!this.state.allPatientsJson && this.state.searchingOnline) {
            return {title: 'Online Results', data: [{name: 'Searching...', address: {}}]};
        }
        if (this.state.allPatientsJson) {
            const filteresPatients = this.state.allPatientsJson.filter(patientJson => {
                let allTermsFound = true;
                query.split(' ').forEach(queryTerm => {
                    allTermsFound = allTermsFound && (
                        (patientJson.firstName && patientJson.firstName.toLowerCase().includes(queryTerm.toLowerCase()))
                        || (patientJson.lastName && patientJson.lastName.toLowerCase().includes(queryTerm.toLowerCase())));
                });
                return allTermsFound;
            }).filter(patientJson => {
                const patient = PatientDataService.getInstance().getPatientByID(patientJson.patientID);
                return !patient || patient.archived;
            });

            const data = filteresPatients.map(patientJson => ({
                name: PatientDataService.constructName(patientJson.firstName, patientJson.lastName),
                address: {
                    formattedAddress: this.getformattedAddress(patientJson.address)
                },
                patientID: patientJson.patientID,
                onPress: this.onPressOnlinePatient.bind(this),
            }));

            return data.length > 0 ? {
                title: 'Online Results',
                data
            } : undefined;
        }
    }

    getformattedAddress(addressObj) {
        let addr = '';
        if (addressObj.apartmentNo) {
            addr += `${addressObj.apartmentNo}, `;
        }
        if (addressObj.streetAddress) {
            addr += `${addressObj.streetAddress}`;
        }
        if (addressObj.city) {
            addr += `, ${addressObj.city}`;
        }
        if (addressObj.zipCode) {
            addr += ` ${addressObj.zipCode}`;
        }
        if (addressObj.state) {
            addr += `, ${addressObj.state}`;
        }
        return addr;
    }

    componentWillUnmount() {
        floDB.removeListener('change', this.handleListUpdate);
    }

    handleListUpdate() {
        this.props.navigator.setTitle({
            title: `Patients (${floDB.objects(Patient).filtered('archived = false').length})`
        });

        // Todo: Don't query again
        this.getSectionData(this.state.searchText);
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

    render() {
        return (
            <PatientListScreen
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

    // External Services
    patientDataService = () => PatientDataService.getInstance();

}

export default PatientListScreenContainer;
