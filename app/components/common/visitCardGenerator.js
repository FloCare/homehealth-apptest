import React, {PureComponent} from 'react';
import {Text, Divider} from 'react-native-elements';
import firebase from 'react-native-firebase';
import {connect} from 'react-redux';
import {
    View,
    Image,
    Linking,
    Platform,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import ActionSheet from 'react-native-actionsheet';
import moment from 'moment/moment';
import {CustomCheckBox} from './CustomCheckBox';
import {styles} from './styles';
import {
    eventNames,
    parameterValues,
    PrimaryFontFamily, screenNames,
} from '../../utils/constants'
import {Images} from '../../Images';
import {VisitService} from '../../data_services/VisitServices/VisitService'

const mapStateToProps = (state, ownProps) => {
    const visitID = ownProps.data;

    const visit = state.visits[visitID];
    const props = {
        visitID: visit.visitID,
        isDone: visit.isDone,
    };

    let visitOwner;
    if (visit.isPatientVisit) {
        const patientID = visit.patientID;
        visitOwner = state.patients[patientID];
        props.patientID = visit.patientID;
    } else {
        const placeID = visit.placeID;
        visitOwner = state.places[placeID];
    }

    props.name = visitOwner.name;
    props.primaryContact = !visitOwner.archived && visitOwner.primaryContact;
    props.visitTime = visit.plannedStartTime;
    const address = state.addresses[visitOwner.addressID];
    //console.log('Owner', visitOwner.name);
    //console.log('Address:', address);
    props.coordinates = !visitOwner.archived && {
        latitude: address.latitude,
        longitude: address.longitude
    };
    props.formattedAddress = address.formattedAddress;

    return props;
};

function VisitCardGenerator({onDoneTogglePress, navigator}) {

    const cardActions = ['Call', 'Go To Address', 'Reschedule', 'Delete Visit', 'Cancel'];
    const cancelIndex = 4;

    class RenderRow extends PureComponent {

        constructor(props) {
            super(props);
            this.state = {
                isTimePickerVisible: false,
                visitTime: this.props.visitTime,
                modalVisible: false
            };
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
                    title: 'Reschedule Visit',
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
                return '';
            }
        }

        handleDeleteVisit = () => {
            VisitService.getInstance().deleteVisitByID(this.props.visitID);
        }

        // card Action Related functions
        // cardActions = {['Call', 'Go To Address', 'Reschedule', 'Delete Visit', 'Cancel']}
        handleCardActionPress(index) {
            switch (index) {
                case 0:
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
                case 1:
                    firebase.analytics().logEvent(eventNames.PATIENT_ACTIONS, {
                        type: parameterValues.NAVIGATION
                    });
                    if (this.props.coordinates) {
                        const mapsURL = `https://www.google.com/maps/dir/?api=1&destination=${this.props.coordinates.latitude},${this.props.coordinates.longitude}`
                        Linking.openURL(mapsURL)
                            .catch(err => console.error('An error occurred', err));
                    }
                    break;
                case 2:
                    firebase.analytics().logEvent(eventNames.VISIT_ACTIONS, {
                        type: parameterValues.RESCHEDULE
                    });
                    this.onPressRescheduleVisit();
                    break;
                case 3:
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

        userData = [{role: 'COTA', time: '10:30 AM'}, {role: 'LPN', time: '4:30 PM'}, {role: 'SN', time: '6:30 PM'}]

        renderClinicianVisit = (visitData) => {
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
                        clinicianVisits.map((clinicianVisit) => this.renderClinicianVisit(clinicianVisit))
                    }
                </View>
            );
        }

        renderOtherClinicianData = (userData) => {
            const numberOfCliniciansInRow = 2;
            const clinicianRows = [];

            for (let itemIndex = 0; itemIndex < userData.length;) {
                clinicianRows.push(this.renderClinicianVisitRow(userData.slice(itemIndex, itemIndex + numberOfCliniciansInRow)));
                itemIndex += numberOfCliniciansInRow;
            }
            return (
              <View style={{marginTop: 5}}>
                  {clinicianRows}
              </View>
            );
        }

        render() {
            console.log('- - - - - - VisitCard Render 1 - - - - - - - - ');
            console.log(this.props.visitID);
            const safeOnDoneTogglePress = () => {
                if (onDoneTogglePress) {
                    onDoneTogglePress(this.props.visitID);
                }
            };
            return (
                <View style={{flexDirection: 'row', marginTop: 10, marginRight: 10, marginBottom: 10}}>
                    <View style={{flex: 1, paddingTop: 15}}>
                        <View style={{width: '50%', height: '100%', alignSelf: 'flex-end', borderLeftWidth: 1, borderLeftColor: 'black'}}>
                        </View>
                            <View style={{position: 'absolute', alignSelf: 'center'}}>
                        <CustomCheckBox
                            checked={this.props.isDone}
                            onPress={safeOnDoneTogglePress}
                        />
                            </View>
                    </View>
                    <View style={{flex: 8}}>
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
                                    this.props.active ? {elevation: 6, borderColor: '#74dbc4', borderWidth: 1} : {}
                                ]}
                        >
                            <View style={{flexDirection: 'row', flex: 1}}>
                                <View style={{alignSelf: 'center', flex: 2}}>
                                    <View style={{flexDirection: 'row'}}>
                                        <View style={{marginLeft: 3}}>
                                            <Image source={Images.ellipse}/>
                                        </View>
                                        <View style={{flex: 1}}>
                                            <TouchableOpacity
                                                onPress={() => { this.showTimePicker(); }}
                                            >
                                                <Text style={{alignSelf: 'center', color: '#222222', fontFamily: PrimaryFontFamily, fontSize: 15}}>
                                                    {this.timeDisplayString('time')}
                                                </Text>
                                                {
                                                    this.state.visitTime &&
                                                    <Text style={{alignSelf: 'center', color: '#222222', fontFamily: PrimaryFontFamily, fontSize: 15}}>
                                                        {this.timeDisplayString('meridian')}
                                                    </Text>
                                                }
                                            </TouchableOpacity>
                                        </View>

                                    </View>
                                    <View>
                                        <DateTimePicker
                                            isVisible={this.state.isTimePickerVisible}
                                            titleIOS={'Pick Visit Time'}
                                            datePickerModeAndroid="spinner"
                                            is24Hour={false}
                                            minuteInterval={5}
                                            date={moment().hours(12).minutes(0).seconds(0).toDate()}
                                            onConfirm={(date) => {
                                                this.handleTimePicked(date);
                                            }}
                                            onCancel={() => {
                                                this.hideTimePicker();
                                            }}
                                            mode={'time'}
                                        />
                                    </View>
                                </View>
                                <View style={{flex: 7, borderLeftColor: '#E9E9E7', borderLeftWidth: 1}}>
                                    <View style={{margin: 10}}>
                                        <View>
                                            <Text style={styles.nameStyle}>{this.props.name}</Text>
                                            <View style={{flexDirection: 'row', marginTop: 2}}>
                                                <Image source={Images.location} style={{marginRight: 8}} />
                                                <Text style={styles.addressStyle}>
                                                    {this.minifiedAddress(this.props.formattedAddress)}
                                                </Text>
                                            </View>
                                        </View>
                                        {
                                            this.renderOtherClinicianData(this.userData)
                                        }
                                    </View>

                                </View>
                                <View style={{flex: 1, alignSelf: 'center', height: '100%'}}>
                                    <TouchableOpacity
                                        onPress={() => { this.showCardActions(); }}
                                    >
                                        <View style={{marginTop: 15, alignSelf: 'center'}}>
                                            <Image source={Images.dots} />
                                        </View>
                                        <ActionSheet
                                            ref={element => this.cardActionSheet = element}
                                            options={cardActions}
                                            cancelButtonIndex={cancelIndex}
                                            onPress={(index) => { this.handleCardActionPress(index)}}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                        </View>
                    </View>
                </View>
            );
        }
    }

    return connect(mapStateToProps)(RenderRow);
}

export {VisitCardGenerator};
