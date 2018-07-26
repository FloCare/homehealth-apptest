import React, {PureComponent} from 'react';
import {Text} from 'react-native-elements';
import firebase from 'react-native-firebase';
import {connect} from 'react-redux';
import {
    View,
    Image,
    Linking,
    Platform,
    TouchableOpacity, Alert, Dimensions,
} from 'react-native'
import DateTimePicker from 'react-native-modal-datetime-picker';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import ActionSheet from 'react-native-actionsheet';
import moment from 'moment/moment';
import {CustomCheckBox} from './CustomCheckBox';
import {styles} from './styles';
import {
    eventNames,
    parameterValues,
    PrimaryFontFamily, screenNames, visitSubjects,
} from '../../utils/constants';
import {Images} from '../../Images';
import {VisitService} from '../../data_services/VisitServices/VisitService'
import {EpisodeDataService} from '../../data_services/EpisodeDataService'

const mapStateToProps = (state, ownProps) => {
    const visitID = ownProps.data;

    const visit = state.visits[visitID];
    const props = {
        visitID: visit.visitID,
        isDone: visit.isDone,
        episodeID: visit.episodeID,
        midnightEpochOfVisit: visit.midnightEpochOfVisit
    };

    let visitSubject;
    if (visit.isPatientVisit) {
        const patientID = visit.patientID;
        visitSubject = state.patients[patientID];
        props.patientID = visit.patientID;
        props.visitSubject = visitSubjects.PATIENT;
    } else {
        const placeID = visit.placeID;
        visitSubject = state.places[placeID];
        props.placeID = placeID;
        props.visitSubject = visitSubjects.PLACE;
    }

    props.name = visitSubject.name;
    props.primaryContact = !visitSubject.archived && visitSubject.primaryContact;
    props.visitTime = visit.plannedStartTime;
    const address = state.addresses[visitSubject.addressID];
    //console.log('Owner', visitSubject.name);
    //console.log('Address:', address);
    props.coordinates = !visitSubject.archived && {
        latitude: address.latitude,
        longitude: address.longitude
    };
    props.formattedAddress = address.formattedAddress;
    return props;
};

function VisitCardGenerator({onDoneTogglePress, navigator}, showEllipse = false, showCheckBoxLine = true) {
    class RenderRow extends PureComponent {

        constructor(props) {
            super(props);
            const episodeID = this.props.episodeID;
            const startDate = this.props.midnightEpochOfVisit;
            const endDate = this.props.midnightEpochOfVisit;
            this.visitDataSubscriber = null;
            if (episodeID) {
                this.visitDataSubscriber = EpisodeDataService.getInstance()
                .subscribeToVisitsForDays(episodeID, startDate, endDate, this.handleOtherClinicianDate);
            }

            this.state = {
                isTimePickerVisible: false,
                visitTime: this.props.visitTime,
                modalVisible: false,
                clinicianVisitData: this.visitDataSubscriber ? this.visitDataSubscriber.currentData : null
            };

            this.cardActions = this.setCardActions();
        }

        componentWillReceiveProps(nextProps) {
            if (nextProps.visitTime !== this.props.visitTime) {
                this.setState({visitTime: nextProps.visitTime});
            }
        }

        componentWillUnmount() {
            if (this.visitDataSubscriber) {
                this.visitDataSubscriber.unsubscribe();
            }
        }

        onPressRescheduleVisit() {
            firebase.analytics().logEvent(eventNames.ADD_VISIT, {
                VALUE: 1
            });
            navigator.showLightBox({
                screen: screenNames.addVisitsForPatientScreen,
                style: {
                    backgroundBlur: 'dark',
                    backgroundColor: '#00000070',
                    tapBackgroundToDismiss: true
                },
                passProps: {
                    patientId: this.props.patientID,
                    placeId: this.props.placeID,
                    visitSubject: this.props.visitSubject,
                    title: 'Reschedule Visit',
                    date: moment(this.props.midnightEpochOfVisit),
                    isReschedule: true,
                    oldVisitId: this.props.visitID
                },
            });
        }

        // Time Picker related Functions
        handleTimePicked = (date) => {
            this.setState({visitTime: date, isTimePickerVisible: false});
            VisitService.getInstance().updateVisitStartTimeByID(this.props.visitID, date);
        }

        hideTimePicker = () => this.setState({isTimePickerVisible: false});

        showTimePicker = () => {
            this.setState({isTimePickerVisible: true});
        }

        timeDisplayString = (place) => {
            if (place === 'time') {
                if (this.state.visitTime) {
                    return moment(this.state.visitTime).format('hh:mm');
                }
                return '--:--';
            }
            if (place === 'meridian') {
                if (this.state.visitTime) {
                    return moment(this.state.visitTime).format('A');
                }
                return 'AM';
            }
        }

        renderDatePickerComponent = () => {
            const startDate = this.state.visitTime ? this.state.visitTime : moment().hours(12).minutes(0).seconds(0).toDate();
            return (
                <View style={{alignSelf: 'center', flex: 2, flexDirection: 'row', justifyContent: 'center'}}>
                    {
                        showEllipse &&
                            <View style={{marginRight: 10}}>
                                <Image source={Images.ellipse} />
                            </View>

                    }

                    <View style={{alignSelf: 'center'}}>
                        <TouchableOpacity
                            onPress={() => { this.showTimePicker(); }}
                        >
                            <Text style={{alignSelf: 'center', color: '#222222', fontFamily: PrimaryFontFamily, fontSize: 15}}>
                                {this.timeDisplayString('time')}
                            </Text>
                            <Text style={{alignSelf: 'center', color: '#222222', fontFamily: PrimaryFontFamily, fontSize: 13}}>
                                {this.timeDisplayString('meridian')}
                            </Text>

                            <DateTimePicker
                                isVisible={this.state.isTimePickerVisible}
                                titleIOS={'Pick Visit Time'}
                                datePickerModeAndroid="spinner"
                                is24Hour={false}
                                minuteInterval={5}
                                date={startDate}
                                onConfirm={(date) => {
                                    this.handleTimePicked(date);
                                }}
                                onCancel={() => {
                                    this.hideTimePicker();
                                }}
                                mode={'time'}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }

        handleDeleteVisit = () => {
            Alert.alert(
                'Caution',
                'This visit will be deleted. Do you wish to continue?',
                [
                    {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                    {text: 'OK', onPress: () => VisitService.getInstance().deleteVisitByID(this.props.visitID)}
                ]
            );
        }


        setCardActions = () => {
            const cardActionsMap = [];
            let index = 0;
            if (this.props.primaryContact) {
                cardActionsMap.push({index, title: 'Call'});
                index++;
            }
            if (this.props.coordinates && this.props.coordinates.latitude && this.props.coordinates.longitude) {
                cardActionsMap.push({index, title: 'Go To Address'});
                index++;
            }
            cardActionsMap.push({index: index++, title: 'Reschedule'});
            cardActionsMap.push({index: index++, title: 'Delete Visit'});
            cardActionsMap.push({index: index++, title: 'Cancel'});
            return cardActionsMap;
        }

        handleCardActionPress(index) {
            if (index >= this.cardActions.length) return;
            const activeAction = this.cardActions.find((cardAction) => cardAction.index === index);

            switch (activeAction.title) {
                case 'Call':
                    firebase.analytics().logEvent(eventNames.PATIENT_ACTIONS, {
                        type: parameterValues.CALL_PATIENT
                    });
                    if (this.props.primaryContact) {
                        if (Platform.OS === 'android') {
                            Linking.openURL(`tel: ${this.props.primaryContact}`);
                        } else {
                            RNImmediatePhoneCall.immediatePhoneCall(this.props.primaryContact);
                        }
                    }
                    break;
                case 'Go To Address':
                    firebase.analytics().logEvent(eventNames.PATIENT_ACTIONS, {
                        type: parameterValues.NAVIGATION
                    });
                    if (this.props.coordinates) {
                        const mapsURL = `https://www.google.com/maps/dir/?api=1&destination=${this.props.coordinates.latitude},${this.props.coordinates.longitude}`;
                        Linking.openURL(mapsURL)
                            .catch(err => console.error('An error occurred', err));
                    }
                    break;
                case 'Reschedule':
                    firebase.analytics().logEvent(eventNames.VISIT_ACTIONS, {
                        type: parameterValues.RESCHEDULE
                    });
                    this.onPressRescheduleVisit();
                    break;
                case 'Delete Visit':
                    firebase.analytics().logEvent(eventNames.VISIT_ACTIONS, {
                        type: parameterValues.DELETE_VISIT
                    });
                    this.handleDeleteVisit();
                    break;
                default:
                    break;
            }
        }

        minifiedAddress = (addressString) => {
            const maxAddressCharacters = 25;
            if (addressString.length > maxAddressCharacters) {
                return `${addressString.substr(0, maxAddressCharacters)}...`;
            }
            return addressString;
        }

        showCardActions = () => {
            this.cardActionSheet.show();
        }

        renderSingleClinicianVisit = (visitData) => {
            const userRole = visitData.role;
            const visitTime = visitData.time;
            return (
              <View style={{flexDirection: 'row', marginRight: 5}}>
                  <View
                      style={{
                          borderRadius: 3,
                          paddingLeft: 4,
                          paddingRight: 4,
                          paddingTop: 1,
                          paddingBottom: 1,
                          margin: 2,
                          borderColor: '#E3E3E3',
                          borderWidth: 1,
                          backgroundColor: '#F5F5F5'
                        }}
                  >
                      <Text style={{fontSize: 14, color: '#222222'}}>
                          {userRole}
                      </Text>
                  </View>

                  <Text style={{marginLeft: 2, alignSelf: 'center', fontSize: 14}}>
                      {visitTime}
                  </Text>
              </View>
            );
        }

        renderClinicianVisitRow(clinicianVisits) {
            return (
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    {
                        clinicianVisits.map((clinicianVisit) => this.renderSingleClinicianVisit(clinicianVisit))
                    }
                </View>
            );
        }

        renderClinicianVisitData = (clinicianVisitData) => {
            const numberOfCliniciansInRow = 2;
            const clinicianRows = [];
            let filteredVisits = [];
            if (clinicianVisitData && clinicianVisitData[this.props.midnightEpochOfVisit]) {
                // filter out own visits
                filteredVisits = clinicianVisitData[this.props.midnightEpochOfVisit].filter((visit) => !visit.ownVisit);
            }
            if (filteredVisits.length > 0) {
                for (let itemIndex = 0; itemIndex < filteredVisits.length;) {
                    clinicianRows.push(this.renderClinicianVisitRow(filteredVisits.slice(itemIndex, itemIndex + numberOfCliniciansInRow)));
                    itemIndex += numberOfCliniciansInRow;
                }
                return (
                    <View style={{marginTop: 5}}>
                        {clinicianRows}
                    </View>
                );
            }
        }

        handleOtherClinicianDate = (clinicianVisitData) => {
            this.setState({clinicianVisitData});
        }

        render() {
            console.log('- - - - - - VisitCard Render- - - - - - - - ');
            const safeOnDoneTogglePress = () => {
                if (onDoneTogglePress) {
                    onDoneTogglePress(this.props.visitID);
                }
            };
            return (

                <View style={{flexDirection: 'row', marginRight: 10, width: 0.95 * Dimensions.get('screen').width}}>
                    <View style={{flex: 1}}>
                        {
                            showCheckBoxLine &&
                            <View style={{width: '50%', flex: 1, alignSelf: 'flex-end', borderLeftWidth: 1, borderLeftColor: '#E9E7E7'}} />
                        }
                        <View style={{position: 'absolute', alignSelf: 'center', paddingTop: 15, marginTop: 10, marginBottom: 10}}>
                            <CustomCheckBox
                                checked={this.props.isDone}
                                onPress={safeOnDoneTogglePress}
                            />
                        </View>
                    </View>
                    <View
                        style={[
                            Platform.select({
                                ios: {
                                    shadowColor: 'rgba(0,0,0, .2)',
                                    shadowOffset: {height: 0, width: 0},
                                    shadowOpacity: 1,
                                    shadowRadius: 1,
                                },
                                android: {
                                    elevation: 1,
                                },
                            }),
                            styles.cardContainerStyle,
                            this.props.sortingActive && !this.props.active ? {opacity: 0.7} : {},
                            this.props.active ? {elevation: 6, borderColor: '#74dbc4', borderWidth: 1} : {},
                            {flex: 8, marginTop: 10, marginBottom: 10, flexDirection: 'row'}
                        ]}
                    >
                            {
                                this.renderDatePickerComponent()
                            }
                        <View style={{flex: 7, borderLeftColor: '#E9E9E7', borderLeftWidth: 1}}>
                            <View style={{margin: 10}}>
                                <Text style={styles.nameStyle}>{this.props.name}</Text>
                                <View style={{flexDirection: 'row', marginTop: 2}}>
                                    <Image source={Images.location} style={{marginRight: 8}} />
                                    <Text style={styles.addressStyle}>
                                        {this.minifiedAddress(this.props.formattedAddress)}
                                    </Text>
                                </View>
                                {
                                    this.renderClinicianVisitData(this.state.clinicianVisitData)
                                }
                            </View>
                        </View>
                        <View style={{flex: 1}}>
                            <TouchableOpacity
                                onPress={() => { this.showCardActions(); }}
                            >
                                <View style={{marginTop: 15, alignSelf: 'center'}}>
                                    <Image source={Images.dots} />
                                </View>
                                <ActionSheet
                                    ref={element => this.cardActionSheet = element}
                                    options={this.cardActions.map((action) => action.title)}
                                    cancelButtonIndex={this.cardActions.length - 1}
                                    onPress={(index) => { this.handleCardActionPress(index); }}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            );
        }
    }

    return connect(mapStateToProps)(RenderRow);
}

export {VisitCardGenerator};
