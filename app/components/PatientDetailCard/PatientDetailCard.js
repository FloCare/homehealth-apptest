import React from 'react';
import firebase from 'react-native-firebase';
import {
    View,
    ScrollView,
    Image,
    Linking,
    Platform,
    TouchableOpacity,
} from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import {Text, Button, Divider} from 'react-native-elements';
import moment from 'moment';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import styles from './styles';
import {PatientDetailMapComponent} from './PatientDetailMapComponent';
import {Diagnosis} from '../common/Diagnosis';
import {PrimaryColor, eventNames, parameterValues} from '../../utils/constants';
import {Images} from '../../Images';
import StyledText from '../common/StyledText';
import ViewMore from '../common/ViewMore';
import {todayMomentInUTCMidnight} from '../../utils/utils';
import {PhysicianDataService} from '../../data_services/PhysicianDataService';

const renderViewMore = (e, onPressAddNotes) => {
    return (
        <Text style={{...styles.fontStyle, fontSize: 14, color: PrimaryColor}} onPress={onPressAddNotes}>Show Notes</Text>
    );
};

const renderSingleClinicianVisit = (visitData) => {
    const nameString = visitData.ownVisit ? 'You' : visitData.name;
    return (
        <View style={{flexDirection: 'row'}}>
            <View style={{flex: 6, marginTop: 5}}>
                <StyledText style={{...styles.fontStyle, fontSize: 15, color: '#222222'}}>
                    {`${nameString}, ${visitData.role}`}
                </StyledText>
                <StyledText style={{...styles.fontStyle, fontSize: 15, color: '#999999'}}>
                    {visitData.plannedStartTime ? moment(visitData.plannedStartTime).format('h:mm A') : '--:--'}
                </StyledText>
            </View>
            {
                !!visitData.primaryContact && !visitData.ownVisit &&
                <View style={{flex: 1, alignSelf: 'center'}}>
                    <TouchableOpacity
                        onPress={() => {
                            if (visitData.primaryContact) {
                                firebase.analytics().logEvent(eventNames.VISIT_ACTIONS, {
                                    type: parameterValues.CALL_CLINICIAN
                                });
                                if (Platform.OS === 'android') {
                                    Linking.openURL(`tel: ${visitData.primaryContact}`);
                                } else {
                                    RNImmediatePhoneCall.immediatePhoneCall(visitData.primaryContact);
                                }
                            }
                        }}
                    >
                    <Image source={Images.emptyCall} />
                    </TouchableOpacity>
                </View>
            }
        </View>
    );
};

const renderVisitSectionData = (visitSectionData) => {
    if (visitSectionData && visitSectionData.length > 0) {
        return (
            <View style={{...styles.containerStyle, flexDirection: 'column'}}>
                <Divider style={{...styles.dividerStyle, marginBottom: 10}} />
                {visitSectionData.map((visitData) => renderSingleClinicianVisit(visitData))}
            </View>
        );
    }
    return (
        <View style={{...styles.containerStyle, flexDirection: 'column'}}>
            <Divider style={{...styles.dividerStyle, marginBottom: 10}} />
            <StyledText style={{...styles.fontStyle, fontSize: 13, color: '#222222'}}>
                {'No Visits Scheduled on This Day'}
            </StyledText>
        </View>
    );
};

const getEmergencyContactText = (contactName, contactRelation) => {
    if (contactRelation === null || contactRelation === '') return contactName;
    if (contactName === null || contactName === '') return contactRelation;
    return `${contactName} (${contactRelation})`;
};


const getActiveDotStyle = (currentDate, date) => {
    return ({
        startDate: date,
        dotEnabled: true,
        dotColor: moment(currentDate).isSame(date, 'day') ? PrimaryColor : '#999999'
    });
};

const getCustomDateStyles = (currentDate, datesWithVisits) => {
    const customDateStyles = [
        {
            startDate: currentDate.valueOf(),
            dateNumberStyle: {color: 'white'},
            dateNumberContainerStyle: {borderRadius: 3, backgroundColor: PrimaryColor, padding: 2}
        },
        {
            startDate: todayMomentInUTCMidnight().valueOf(),
            dateNameStyle: {color: PrimaryColor},
            dateNumberStyle: {color: PrimaryColor},
        }
    ];
    for (let index = 0; index < datesWithVisits.length; index++) {
        customDateStyles.push(getActiveDotStyle(currentDate, datesWithVisits[index]));
    }
    return customDateStyles;
};

const renderPhysicianContactRow = (contact, label) => (
        !!contact &&
        <View style={{flexDirection: 'row', flex: 1, justifyContent: 'space-between'}}>
            <View style={{flex: 4}}>
                <StyledText style={{...styles.fontStyle, fontSize: 13, color: '#999999', marginTop: 10}}>
                    {contact}
                </StyledText>
                <StyledText style={{...styles.fontStyle, fontSize: 11, color: '#525252'}}>
                    {label}
                </StyledText>
            </View>
            <View style={{flex: 1, alignSelf: 'center'}}>
                <TouchableOpacity
                    onPress={() => {
                        firebase.analytics().logEvent(eventNames.PATIENT_ACTIONS, {
                            type: parameterValues.CALL_PHYSICIAN
                        });
                        if (Platform.OS === 'android') {
                            Linking.openURL(`tel: ${contact}`);
                        } else {
                            RNImmediatePhoneCall.immediatePhoneCall(contact);
                        }
                    }}
                >
                    <Image source={Images.emptyCall} style={{height: 28, resizeMode: 'contain'}} />
                </TouchableOpacity>
            </View>
        </View>
);

const PatientDetailCard = (props) => {
    const {patientDetail, onPressAddVisit, onWeekChanged, currentWeekVisitData,
        selectedVisitsDate, visitSectionData, onSelectVisitsDate,
        onPressAddNotes, showCallout, setMarkerRef} = props;
    //Handle name with navigator props
    const {
        primaryContact,
        emergencyContactNumber,
        emergencyContactName,
        emergencyContactRelation,
        dateOfBirth,
        diagnosis,
        notes,
        address
    } = patientDetail;

    const emergencyContactText = getEmergencyContactText(emergencyContactName, emergencyContactRelation);
    const physicianInfo = patientDetail.primaryPhysician;
    const physicianSectionPresent = physicianInfo && (physicianInfo.phone1 || physicianInfo.phone2);
    let coordinates = null;
    if (address) {
        if (address.coordinates &&
            address.coordinates.latitude !== null &&
            address.coordinates.longitude !== null) {
            coordinates = address.coordinates;
        }
    }

    const datesWithVisits = [];
    for (const dateKey in currentWeekVisitData) {
        if (currentWeekVisitData[dateKey].length > 0) {
            datesWithVisits.push(parseInt(dateKey, 10));
        }
    }

    return (
        <View style={styles.parentContainerStyle}>
            {coordinates &&
            <PatientDetailMapComponent
                patientCoordinates={coordinates}
                displayAddress={address.formattedAddress}
                navigationAddress={address.navigationAddress}
                onRegionChangeComplete={showCallout}
                setMarkerRef={setMarkerRef}
            />
            }

            <ScrollView>
                <View style={styles.containerStyle}>
                    <Image source={Images.primaryContact} style={{marginTop: 5}} />
                    <View style={{flexDirection: 'row', flex: 1, justifyContent: 'space-between'}}>
                        <View style={{marginLeft: 14, flex: 4}}>
                            <StyledText style={{...styles.headerStyle, ...styles.fontStyle}}>
                                Primary Contact
                            </StyledText>
                            <StyledText style={{...styles.fontStyle, fontSize: 12, color: '#999999'}}>
                                {primaryContact}
                            </StyledText>
                        </View>
                        <View style={{flex: 1, alignSelf: 'center'}}>
                            <TouchableOpacity
                                onPress={() => {
                                    if (primaryContact) {
                                        firebase.analytics().logEvent(eventNames.PATIENT_ACTIONS, {
                                            type: parameterValues.CALL_PATIENT
                                        });
                                        if (Platform.OS === 'android') {
                                            Linking.openURL(`tel: ${primaryContact}`);
                                        } else {
                                            RNImmediatePhoneCall.immediatePhoneCall(primaryContact);
                                        }
                                    }
                                }}
                            >
                                <Image source={Images.emptyCall} style={{height: 28, resizeMode: 'contain'}} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <Divider style={styles.dividerStyle} />

                { dateOfBirth &&
                <View style={styles.containerStyle}>
                    <Image source={Images.birthday} />
                    <View style={{marginLeft: 14}}>
                        <StyledText style={{...styles.fontStyle, ...styles.headerStyle}}>
                            Birthday
                        </StyledText>
                        <StyledText style={{...styles.fontStyle, fontSize: 13, color: '#999999'}}>
                            {moment(dateOfBirth).format('DD MMM YYYY')}
                        </StyledText>
                    </View>
                </View>
                }

                {dateOfBirth &&
                    <Divider style={styles.dividerStyle} />
                }

                {/*<View style={[styles.containerStyle, {opacity: 0.3}]}>*/}
                    {/*<Image source={Images.diagnosis} />*/}
                    {/*<View style={{marginLeft: 14}}>*/}
                        {/*<StyledText style={{...styles.fontStyle, ...styles.headerStyle}}>*/}
                            {/*Diagnosis*/}
                        {/*</StyledText>*/}
                        {/*<Diagnosis diagnosis />*/}
                    {/*</View>*/}
                {/*</View>*/}

                {/*<Divider style={styles.dividerStyle} />*/}

                <View style={{...styles.containerStyle, flexDirection: 'column'}}>
                    <View style={{flexDirection: 'row'}}>
                        <Image source={Images.visits} />
                        <View style={{marginLeft: 14}}>
                            <StyledText style={{...styles.fontStyle, ...styles.headerStyle}}>
                                Visits
                            </StyledText>
                        </View>
                    </View>
                    <View style={{width: '100%', alignSelf: 'center'}}>
                        <CalendarStrip
                            swipeEnabled
                            style={{height: 80}}
                            styleWeekend={false}
                            calendarHeaderFormat='MMMM'
                            calendarDatesStyle={{paddingHorizontal: 20}}
                            calendarHeaderStyle={{fontWeight: '100', fontSize: 14, alignSelf: 'flex-start'}}
                            calendarHeaderViewStyle={{marginLeft: 27, marginTop: 10}}
                            onDateSelected={(date) => { 
                                firebase.analytics().logEvent(eventNames.PATIENT_ACTIONS, {
                                    'type': parameterValues.VIEW_VISIT_CALENDAR
                                });
                                onSelectVisitsDate(moment(date).utc());
                            }}
                            onWeekChanged={onWeekChanged}
                            selectedDate={selectedVisitsDate}
                            customDatesStyles={getCustomDateStyles(selectedVisitsDate, datesWithVisits)}
                            responsiveSizingOffset={-5}
                            dotMarginEnabled
                            datesStripStyle={{alignSelf: 'center'}}
                            iconContainer={{padding: 5, paddingTop: 10, paddingBottom: 10}}
                        />
                    </View>
                    <View>
                        {
                            renderVisitSectionData(visitSectionData)
                        }
                    </View>
                </View>

                <Divider style={styles.dividerStyle} />

                {emergencyContactNumber !== '' && emergencyContactNumber &&
                <View style={styles.containerStyle}>
                    <Image source={Images.emergencyIcon} />
                    <View style={{marginLeft: 14}}>
                        <StyledText style={{...styles.fontStyle, ...styles.headerStyle}}>
                            Emergency Contact Details
                        </StyledText>
                        <TouchableOpacity
                            onPress={() => {
                                if (emergencyContactNumber) {
                                    firebase.analytics().logEvent(eventNames.PATIENT_ACTIONS, {
                                        type: parameterValues.CALL_EMERGENCY
                                    });
                                    if (Platform.OS === 'android') {
                                        Linking.openURL(`tel: ${emergencyContactNumber}`);
                                    } else {
                                        RNImmediatePhoneCall.immediatePhoneCall(emergencyContactNumber);
                                    }
                                }
                            }}
                        >
                            <View>
                                <StyledText style={{...styles.fontStyle, fontSize: 13, color: '#999999'}}>
                                    {emergencyContactNumber}
                                </StyledText>
                                {emergencyContactText && emergencyContactText.length > 0 &&
                                <StyledText style={{...styles.fontStyle, fontSize: 13, color: '#999999'}}>
                                    {emergencyContactText}
                                </StyledText>
                                }
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                }

                {emergencyContactNumber !== '' && emergencyContactNumber &&
                <Divider style={styles.dividerStyle} />
                }

                {physicianSectionPresent &&
                <View style={styles.containerStyle}>
                    <Image source={Images.physicianIcon} />
                    <View style={{marginLeft: 14, flex: 1}}>
                        <StyledText style={{...styles.fontStyle, ...styles.headerStyle}}>
                            Physician Contact Details
                        </StyledText>
                        <StyledText style={{...styles.fontStyle, fontSize: 13, color: '#222222', marginTop: 5}}>
                        {PhysicianDataService.constructName(physicianInfo.firstName, physicianInfo.lastName)}
                        </StyledText>
                        {
                            renderPhysicianContactRow(physicianInfo.phone1, 'Office Phone')
                        }
                        {
                            renderPhysicianContactRow(physicianInfo.phone2, 'Office Phone')
                        }
                    </View>
                </View>
                }

                {
                    physicianSectionPresent &&
                    <Divider style={styles.dividerStyle} />
                }
                <View style={styles.containerStyle}>
                    <Image
                        source={Images.notes}
                    />
                    <View style={{marginLeft: 14, marginRight: 16}}>
                        <StyledText style={{...styles.fontStyle, ...styles.headerStyle}}>
                            Notes
                        </StyledText>
                        <ViewMore
                            textStyle={{...styles.fontStyle, ...styles.noteStyle}}
                            numberOfLines={2}
                            renderViewMore={(e) => renderViewMore(e, onPressAddNotes)}
                        >
                            {notes || 'You have not added any note for this patient.'}
                        </ViewMore>
                    </View>
                </View>

                <Divider style={styles.dividerStyle} />
            </ScrollView>

            <Divider style={styles.dividerStyle} />

            <Button
                containerViewStyle={{marginLeft: 0, marginRight: 0}}
                buttonStyle={styles.buttonStyle}
                title='Add Visit'
                onPress={onPressAddVisit}
                textStyle={{
                    ...styles.fontStyle,
                    color: 'white',
                    fontSize: 16
                }}
            />
        </View>
    );
};

export {PatientDetailCard};
