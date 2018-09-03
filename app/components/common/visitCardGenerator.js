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
} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Modal from 'react-native-modal';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import ActionSheet from 'react-native-actionsheet';
import moment from 'moment/moment';
import {CustomCheckBox} from './CustomCheckBox';
import {styles} from './styles';
import {
    ErrorMessageColor,
    eventNames,
    parameterValues, PrimaryColor,
    PrimaryFontFamily, screenNames, visitSubjects,
} from '../../utils/constants';
import {Images} from '../../Images';
import {VisitService} from '../../data_services/VisitServices/VisitService';
import {EpisodeDataService} from '../../data_services/EpisodeDataService';
import {navigateTo} from '../../utils/MapUtils';
import AddOrEditMilesModal from '../Miles/AddOrEditMilesModal';
import {milesRenderString} from '../../utils/renderFormatUtils';
import {VisitMiles} from '../../utils/data/schemas/Models/visitMiles/VisitMiles';
import {Address} from '../../utils/data/schemas/Models/address/Address';

const mapStateToProps = (state, ownProps) => {
    const visitID = ownProps.data;

    const visit = state.visits[visitID];
    const props = {
        visitID: visit.visitID,
        isDone: visit.isDone,
        episodeID: visit.episodeID,
        midnightEpochOfVisit: visit.midnightEpochOfVisit,
        // miles related information
        odometerStart: visit.visitMiles.odometerStart,
        odometerEnd: visit.visitMiles.odometerEnd,
        totalMiles: visit.visitMiles.totalMiles,
        milesComments: visit.visitMiles.milesComments
    };

    let visitSubject;
    if (visit.isPatientVisit) {
        const patientID = visit.patientID;
        visitSubject = state.patients[patientID];
        props.patientID = visit.patientID;
        props.isLocalPatient = visitSubject.isLocallyOwned;
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

const cardActions = {
    call: 'Call Patient',
    goToAddress: 'Go To Address',
    addOrEditMiles: 'Add/Edit Miles',
    reschedule: 'Reschedule Visit',
    deleteVisit: 'Delete Visit',
    cancel: 'Cancel'
};

const cardBorderColor = '#E9E9E7';

function VisitCardGenerator({onDoneTogglePress, navigator}, showEllipse = true, showCheckBoxLine = true, showDetailedMilesView = false) {
    class RenderRow extends PureComponent {

        static numberOfCliniciansInRow = 2;

        constructor(props) {
            super(props);
            const episodeID = this.props.episodeID;
            const startDate = this.props.midnightEpochOfVisit;
            const endDate = this.props.midnightEpochOfVisit;
            this.visitDataSubscriber = null;
            if (episodeID) {
                this.visitDataSubscriber = EpisodeDataService.getInstance()
                .subscribeToVisitsForDays(episodeID, startDate, endDate, this.onVisitDataChange);
            }

            this.state = {
                isTimePickerVisible: false,
                milesModalVisible: false,
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
            navigator.showLightBox({
                screen: screenNames.addOrRescheduleVisitsLightBox,
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
                    date: moment(this.props.midnightEpochOfVisit).utc(),
                    isReschedule: true,
                    oldVisitId: this.props.visitID
                },
            });
        }

        onPressAddOrEditMiles = () => {
            firebase.analytics().logEvent(eventNames.VISIT_ACTIONS, {
                type: parameterValues.EDIT_MILES
            });
            this.setState({milesModalVisible: true});
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
                return ' --:--';
            }
            if (place === 'meridian') {
                if (this.state.visitTime) {
                    return moment(this.state.visitTime).format('A');
                }
                return 'AM';
            }
        }

        renderDatePickerComponent = () => {
            const startDate = this.state.visitTime ? this.state.visitTime :
                moment(this.props.midnightEpochOfVisit).subtract(moment().utcOffset(), 'minutes')
                .hours(12)
                .minutes(0)
                .seconds(0)
                .toDate();
            return (
                <View style={{alignItems: 'center', flex: 2, flexDirection: 'row', justifyContent: 'center'}}>
                    {
                        showEllipse &&
                            <View style={{marginLeft: 2}}>
                                <Image source={Images.ellipse} />
                            </View>

                    }

                    <View style={{alignSelf: 'center', marginLeft: 6, marginRight: 6, height: '100%'}}>
                        <TouchableOpacity
                            onPress={() => { this.showTimePicker(); }}
                            style={{flex: 1, justifyContent: 'center'}}
                        >
                            <Text style={{alignSelf: 'center', color: '#222222', fontFamily: PrimaryFontFamily, fontSize: 13}}>
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
                                    if (this.state.visitTime) {
                                        firebase.analytics().logEvent(eventNames.VISIT_ACTIONS, {
                                            type: parameterValues.EDIT_TIME
                                        });
                                    } else {
                                        firebase.analytics().logEvent(eventNames.VISIT_ACTIONS, {
                                            type: parameterValues.ADD_TIME
                                        });
                                    }
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
                cardActionsMap.push({index, title: cardActions.call});
                index++;
            }
            if (this.props.coordinates && this.props.coordinates.latitude && this.props.coordinates.longitude) {
                cardActionsMap.push({index, title: cardActions.goToAddress});
                index++;
            }
            if (this.isMilesEnabled()) {
                cardActionsMap.push({index: index++, title: cardActions.addOrEditMiles});
            }
            cardActionsMap.push({index: index++, title: cardActions.reschedule});
            cardActionsMap.push({index: index++, title: cardActions.deleteVisit});
            cardActionsMap.push({index: index++, title: 'Cancel'});
            return cardActionsMap;
        }

        handleCardActionPress(index) {
            if (index >= this.cardActions.length) return;
            const activeAction = this.cardActions.find((cardAction) => cardAction.index === index);

            switch (activeAction.title) {
                case cardActions.call:
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
                case cardActions.goToAddress:
                    firebase.analytics().logEvent(eventNames.PATIENT_ACTIONS, {
                        type: parameterValues.NAVIGATION
                    });
                    if (this.props.coordinates) {
                        navigateTo(this.props.coordinates.latitude, this.props.coordinates.longitude, this.props.formattedAddress);
                    }
                    break;
                case cardActions.addOrEditMiles:
                    this.onPressAddOrEditMiles();
                    break;
                case cardActions.reschedule:
                    firebase.analytics().logEvent(eventNames.VISIT_ACTIONS, {
                        type: parameterValues.RESCHEDULE
                    });
                    this.onPressRescheduleVisit();
                    break;
                case cardActions.deleteVisit:
                    firebase.analytics().logEvent(eventNames.VISIT_ACTIONS, {
                        type: parameterValues.DELETE_VISIT
                    });
                    this.handleDeleteVisit();
                    break;
                default:
                    break;
            }
        }

        showCardActions = () => {
            this.cardActionSheet.show();
        }

        renderSingleClinicianVisit = (visitData) => {
            const userRole = visitData.role;
            const visitTime = visitData.plannedStartTime ? moment(visitData.plannedStartTime).format('hh:mm A') : ' --:-- ';
            return (
              <View style={{flexDirection: 'row', marginRight: 5}}>
                  <View
                      style={{
                          borderRadius: 3,
                          paddingLeft: 2,
                          paddingRight: 2,
                          paddingTop: 1,
                          paddingBottom: 1,
                          margin: 2,
                          borderColor: '#E3E3E3',
                          borderWidth: 1,
                          backgroundColor: '#F5F5F5'
                        }}
                  >
                      <Text style={{fontSize: 12, color: '#222222'}}>
                          {userRole}
                      </Text>
                  </View>

                  <Text style={{marginLeft: 2, alignSelf: 'center', fontSize: 12}}>
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

        getOtherUsersVisits = (clinicianVisitData) => {
            let filteredVisits = [];
            if (clinicianVisitData && clinicianVisitData[this.props.midnightEpochOfVisit]) {
                filteredVisits = clinicianVisitData[this.props.midnightEpochOfVisit].filter((visit) => !visit.ownVisit);
            }
            return filteredVisits;
        }

        renderClinicianVisitData = (clinicianVisitData) => {
            const numberOfCliniciansInRow = RenderRow.numberOfCliniciansInRow;
            const clinicianRows = [];
            const filteredVisits = this.getOtherUsersVisits(clinicianVisitData);
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

        willLayoutSizeChange = (newClinicianVisitData) => {
            const numberOfCliniciansInRow = RenderRow.numberOfCliniciansInRow;

            const currentClinicianVisitData = this.state.clinicianVisitData;
            const currentOtherUsersVisits = this.getOtherUsersVisits(currentClinicianVisitData);

            const newOtherUsersVisits = this.getOtherUsersVisits(newClinicianVisitData);

            const currentNoOfRows = Math.ceil((currentOtherUsersVisits.length) / numberOfCliniciansInRow);
            const newNoOfRows = Math.ceil((newOtherUsersVisits.length) / numberOfCliniciansInRow);

            return (currentNoOfRows !== newNoOfRows);
        }

        onVisitDataChange = (clinicianVisitData) => {
            if (this.props.onItemLayoutUpdate && this.willLayoutSizeChange(clinicianVisitData)) {
                this.props.onItemLayoutUpdate(this.props.visitID);
            }
            this.setState({clinicianVisitData});
        }

        // Miles Section

        isMilesEnabled = () => {
            const isPlaceVisit = this.props.visitSubject === visitSubjects.PLACE;
            const isLocalPatient = this.props.isLocalPatient;
            return !(isPlaceVisit || isLocalPatient);
        }

        dismissMilesModal = () => {
            this.setState({milesModalVisible: false});
        }

        getOdometerDataComponent = (odometerValue) => (
            typeof (odometerValue) === 'number' ?
                (
                    <Text style={styles.milesDataStyle}>
                        {milesRenderString(odometerValue)}
                    </Text>
                )
                :
                (
                    <Text style={{...styles.milesDataStyle, color: ErrorMessageColor}}>
                        {'____'}
                    </Text>
                )
        );

        getMilesTravelledComponentInDetailedView = (totalMiles) => {
            if (totalMiles) {
                return (
                    <View style={{flexDirection: 'row', alignItems: 'center', marginRight: 15}}>
                        <Text style={{...styles.milesDataStyle, fontSize: 15}}>
                            {milesRenderString(totalMiles)}
                        </Text>
                        <Text style={styles.milesDataStyle}>
                            {' mi'}
                        </Text>
                    </View>
                );
            }
            return (
                <View style={{flexDirection: 'row', alignItems: 'center', marginRight: 15}}>
                    <Text style={{...styles.milesDataStyle, color: ErrorMessageColor}}>
                        {' _____ mi'}
                    </Text>
                </View>
            );
        }

        renderAddMilesButton = () => (
            <TouchableOpacity
                style={{marginTop: 8, marginBottom: 8, alignItems: 'center'}}
                onPress={this.onPressAddOrEditMiles}
            >
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image source={Images.plus} style={{height: 9, width: 9, marginRight: 5}} />
                    <Text
                        style={{fontSize: 16, color: PrimaryColor, fontFamily: PrimaryFontFamily}}
                    >
                        {'Add Miles'}
                    </Text>
                </View>

            </TouchableOpacity>
        )

        renderDetailedMilesView = () => {
            const {odometerStart, odometerEnd} = this.props;
            if (!odometerStart && !odometerEnd) {
                return this.renderAddMilesButton();
            }
            return (
                <View style={{marginLeft: 10, marginBottom: 5, marginTop: 5}}>
                    <Text style={styles.milesHeadingStyle}>
                        Odometer Reading
                    </Text>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <View style={{flexDirection: 'row', marginTop: 5}}>
                            <View style={{flexDirection: 'row', alignItems: 'center', paddingRight: 10}}>
                                <Text style={{...styles.milesHeadingStyle, fontSize: 9}}>
                                    {'Start: '}
                                </Text>
                                {this.getOdometerDataComponent(odometerStart, 'start')}
                            </View>
                            <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 10}}>
                                <Text style={{...styles.milesHeadingStyle, fontSize: 9}}>
                                    {'End '}
                                </Text>
                                {this.getOdometerDataComponent(odometerEnd, 'end')}
                            </View>
                        </View>
                        {
                            this.getMilesTravelledComponentInDetailedView(VisitMiles.getMiles(odometerStart, odometerEnd))
                        }
                    </View>
                </View>
            );
        }

        // Shows up below three dots button
        renderMiniMilesSummary = () => {
            const {odometerStart, odometerEnd} = this.props;
            const milesTravelled = VisitMiles.getMiles(odometerStart, odometerEnd);
            const milesSection = milesTravelled ?
                (
                    <Text style={{...styles.milesDataStyle, fontSize: 10}}>
                        {`${milesRenderString(milesTravelled)} Mi`}
                    </Text>
                )
                :
                (
                    <Text style={{...styles.milesDataStyle, fontSize: 10, color: ErrorMessageColor}}>
                        {'__ Mi'}
                    </Text>
                );
            return (
                <View>
                    {
                        milesSection
                    }
                </View>
            );
        };

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
                        <View style={{height: '100%', position: 'absolute', alignSelf: 'center', paddingTop: 2, marginTop: 2, marginBottom: 2}}>
                            <CustomCheckBox
                                checked={this.props.isDone}
                                onPress={safeOnDoneTogglePress}
                                checkBoxStyle={{width: 20, height: 20, alignSelf: 'flex-start', marginTop: 10}}
                                checkBoxContainerStyle={{width: 40, height: '100%', justifyContent: 'center'}}
                            />
                        </View>
                    </View>
                    <View
                        style={[
                            styles.cardContainerStyle,
                            this.props.sortingActive && !this.props.active ? {opacity: 0.7} : {},
                            this.props.active ? {elevation: 6, borderColor: '#74dbc4', borderWidth: 1} : {},
                            {flex: 8, marginTop: 2, marginBottom: 2}
                        ]}
                    >
                        <View style={{flexDirection: 'row'}}>
                            {
                                this.renderDatePickerComponent()
                            }
                            <View style={{flex: 8, flexDirection: 'row', borderLeftColor: cardBorderColor, borderLeftWidth: 1}}>
                                <View style={{margin: 10, flex: 1}}>
                                    <Text style={{...styles.nameStyle, fontSize: 15}}>{this.props.name}</Text>
                                    <View style={{flexDirection: 'row', marginTop: 2}}>
                                        <Image source={Images.location} style={{marginRight: 8}} />
                                        <Text style={styles.addressStyle}>
                                            {Address.minifiedAddress(this.props.formattedAddress)}
                                        </Text>
                                    </View>
                                    {
                                        this.renderClinicianVisitData(this.state.clinicianVisitData)
                                    }
                                </View>
                                <View style={{width: 40}}>
                                    <TouchableOpacity
                                        onPress={() => { this.showCardActions(); }}
                                    >
                                        <View style={{alignItems: 'center', margin: 10}}>
                                            <Image source={Images.dots} />
                                        </View>
                                        <ActionSheet
                                            ref={element => { this.cardActionSheet = element; }}
                                            options={this.cardActions.map((action) => action.title)}
                                            cancelButtonIndex={this.cardActions.length - 1}
                                            onPress={(index) => { this.handleCardActionPress(index); }}
                                        />
                                    </TouchableOpacity>
                                    {
                                        this.props.isDone && this.isMilesEnabled() && !showDetailedMilesView &&
                                        <View>
                                            {
                                                this.renderMiniMilesSummary()
                                            }
                                        </View>
                                    }

                                </View>
                            </View>
                        </View>
                        {
                            this.isMilesEnabled() &&
                            <View style={{borderTopColor: cardBorderColor, borderTopWidth: 1}}>
                                <TouchableOpacity
                                    onPress={() => { this.onPressAddOrEditMiles(); }}
                                >
                                    <Modal
                                        isVisible={this.state.milesModalVisible}
                                        onBackButtonPress={() => this.dismissMilesModal()}
                                        avoidKeyboard
                                        backdropOpacity={0.8}
                                    >
                                        <AddOrEditMilesModal
                                            name={this.props.name}
                                            visitID={this.props.visitID}
                                            odometerStart={this.props.odometerStart}
                                            odometerEnd={this.props.odometerEnd}
                                            totalMiles={this.props.totalMiles}
                                            comments={this.props.milesComments}
                                            dismissMilesModal={this.dismissMilesModal}
                                        />
                                    </Modal>
                                    {
                                        showDetailedMilesView && this.renderDetailedMilesView()
                                    }
                                </TouchableOpacity>
                            </View>
                        }
                    </View>
                </View>
            );
        }
    }

    return connect(mapStateToProps)(RenderRow);
}

export {VisitCardGenerator};
