import React, {Component} from 'react';
import {View, Dimensions, Platform, Linking, Image, TouchableOpacity} from 'react-native';
import firebase from 'react-native-firebase';
import {TabView, TabBar, SceneMap} from 'react-native-tab-view';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import {eventNames, parameterValues, PrimaryColor, screenNames} from '../../utils/constants';
import {NotesViewContainer} from './NotesView/NotesViewContainer';
import PatientDetailScreenContainer from './PatientDetailScreen/PatientDetailScreenContainer';
import StyledText from '../common/StyledText';
import {floDB, Patient} from '../../utils/data/schema';
import {PatientDataService} from '../../data_services/PatientDataService';
import {Images} from '../../Images';
import {navigateTo} from '../../utils/MapUtils';

export class PatientScreenContainer extends Component {
    static navigatorStyle = {
        navBarBackgroundColor: 'white',
        navBarTextColor: '#212121',
        navBarButtonColor: PrimaryColor,
        topBarElevationShadowEnabled: false,
        statusBarTextColorScheme: 'dark',
        navBarNoBorder: true,
    };

    constructor(props) {
        super(props);
        this.state = {
            index: (props.selectedScreen && props.selectedScreen === 'notes') ? 1 : 0,
            routes: [
                {key: 'details', title: 'Details'},
                {key: 'notes', title: 'Notes'},
            ],
            patientDetail: floDB.objectForPrimaryKey(Patient, props.patientId),
        };
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
        this.handleDBUpdate = this.handleDBUpdate.bind(this);
        this.onPressEditInfo = this.onPressEditInfo.bind(this);

        const patientDetails = floDB.objectForPrimaryKey(Patient, props.patientId);
        if (patientDetails && patientDetails.isLocallyOwned) {
            this.showEditNavButton();
        }
    }

    componentDidMount() {
        floDB.addListener('change', this.handleDBUpdate);
    }

    componentWillUnmount() {
        floDB.removeListener('change', this.handleDBUpdate);
    }

    handleDBUpdate() {
        this.setState({patientDetail: floDB.objectForPrimaryKey(Patient, this.props.patientId)});
    }

    showEditNavButton() {
        this.props.navigator.setButtons(
            Platform.select({
                ios: {
                    rightButtons: [
                        {
                            id: 'edit', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                            buttonColor: '#fffff',
                            systemItem: 'edit' //iOS only
                        }
                    ]
                },
                android: {
                    rightButtons: [
                        {
                            icon: Images.editButton,
                            id: 'edit', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                            buttonColor: '#fffff',
                        }
                    ]
                }
            })
        );
    }

    // this is the onPress handler for the navigation header 'Edit' button
    onNavigatorEvent(event) {
        if (event.id === 'willAppear') {
            const {firstName, lastName} = this.state.patientDetail;
            const title = PatientDataService.constructName(firstName, lastName);
            this.props.navigator.setTitle({
                title
            });
        }
        if (event.type === 'NavBarButtonPress') {
            if (event.id === 'edit') {    // this is the same id field from the static navigatorButtons definition
                this.onPressEditInfo();
            }
        }
        // STOP GAP solution. Will be removed when redux is used
        if (event.id === 'didAppear') {
            firebase.analytics().setCurrentScreen(screenNames.patient, screenNames.patient);
        }
    }

    onPressEditInfo() {
        this.props.navigator.push({
            screen: screenNames.addPatient,
            title: 'Edit Patient Information',
            navigatorStyle: {
                tabBarHidden: true
            },
            navigatorButtons: {
                rightButtons: [
                    {
                        id: 'deletePatient',
                        icon: Images.delete
                    }
                ]
            },
            passProps: {
                values: {
                    patientID: this.state.patientDetail.patientID,
                    firstName: this.state.patientDetail.firstName,
                    lastName: this.state.patientDetail.lastName,
                    addressID: this.state.patientDetail.address.addressID,
                    streetAddress: this.state.patientDetail.address.streetAddress,
                    apartmentNo: this.state.patientDetail.address.apartmentNo,
                    zipCode: this.state.patientDetail.address.zipCode,
                    city: this.state.patientDetail.address.city,
                    state: this.state.patientDetail.address.state,
                    primaryContact: this.state.patientDetail.primaryContact,
                    //diagnosis: this.state.patientDetail.episodes[0].diagnosis,
                    notes: this.state.patientDetail.notes,
                    lat: this.state.patientDetail.address.lat,
                    long: this.state.patientDetail.address.long,
                    dateOfBirth: this.state.patientDetail.dateOfBirth,
                    emergencyContactInfo: {
                        contactName: this.state.patientDetail.emergencyContactName,
                        contactNumber: this.state.patientDetail.emergencyContactNumber,
                        contactRelation: this.state.patientDetail.emergencyContactRelation,
                    }
                },
                edit: true
            }
        });
    }

    renderActionButtons(style) {
        const imageLength = 30;
        return (<View
            style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                paddingTop: 10,
                ...style
            }}
        >
            <TouchableOpacity
                style={{paddingHorizontal: 15, alignItems: 'center'}}
                onPress={() => {
                    if (this.state.patientDetail.primaryContact) {
                        firebase.analytics().logEvent(eventNames.PATIENT_ACTIONS, {
                            type: parameterValues.CALL_PATIENT
                        });
                        if (Platform.OS === 'android') {
                            Linking.openURL(`tel: ${this.state.patientDetail.primaryContact}`);
                        } else {
                            RNImmediatePhoneCall.immediatePhoneCall(this.state.patientDetail.primaryContact);
                        }
                    }
                }}
            >
                <Image source={Images.callIcon} style={{height: imageLength, width: imageLength, resizeMode: 'contain'}} />
                <StyledText
                    style={{
                        marginTop: 5,
                        fontSize: 9,
                        color: '#888888'
                    }}
                >
                    Call
                </StyledText>
            </TouchableOpacity>
            <TouchableOpacity
                style={{paddingHorizontal: 15, alignItems: 'center'}}
                onPress={() => {
                    const coordinates = this.state.patientDetail.address.coordinates;
                    if (coordinates) {
                        firebase.analytics().logEvent(eventNames.PATIENT_ACTIONS, {
                            type: parameterValues.NAVIGATION
                        });
                        navigateTo(coordinates.latitude, coordinates.longitude, this.state.patientDetail.address.formattedAddress);
                    }
                }}
            >
                <Image source={Images.mapSolid} style={{height: imageLength, width: imageLength, resizeMode: 'contain'}} />
                <StyledText
                    style={{
                        marginTop: 5,
                        fontSize: 9,
                        color: '#888888'
                    }}
                >
                    Navigate
                </StyledText>
            </TouchableOpacity>
        </View>);
    }

    detailsScreen() {
        return <PatientDetailScreenContainer {...this.props} />;
    }

    notesScreen() {
        return <NotesViewContainer {...this.props} patientID={this.props.patientId} />;
    }

    sceneMap = SceneMap({
        details: this.detailsScreen.bind(this),
        notes: this.notesScreen.bind(this),
    });

    render() {
        return (
            <View
                style={{flex: 1}}
            >
                <View
                    style={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-evenly',
                        backgroundColor: 'white',
                    }}
                >
                    <StyledText
                        style={{
                            color: '#202020',
                            fontWeight: '100',
                            paddingVertical: 5,
                            fontSize: 11
                        }}
                    >
                        {this.state.patientDetail.primaryContact}
                    </StyledText>
                    <StyledText
                        style={{
                            color: '#202020',
                            fontWeight: '100',
                            paddingVertical: 5,
                            fontSize: 11
                        }}
                    >
                        {this.state.patientDetail.address.formattedAddress}
                    </StyledText>
                    {this.renderActionButtons()}
                </View>
                <TabView
                    navigationState={this.state}
                    renderScene={this.sceneMap}
                    renderTabBar={props =>
                        <TabBar
                            {...props}
                            style={{backgroundColor: 'white'}}
                            labelStyle={{color: '#202020'}}
                            indicatorStyle={{backgroundColor: PrimaryColor}}
                        />
                    }
                    onIndexChange={index => this.setState({index})}
                    initialLayout={{width: Dimensions.get('window').width}}
                />
            </View>
        );
    }
}
