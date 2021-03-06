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
import {Button, Divider, Badge} from 'react-native-elements';
import moment from 'moment';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import styles from './styles';
import {PrimaryColor, eventNames, parameterValues} from '../../../../utils/constants';
import {Images} from '../../../../Images';
import StyledText from '../../../common/StyledText';
import {todayMomentInUTCMidnight} from '../../../../utils/utils';
import {PhysicianDataService} from '../../../../data_services/PhysicianDataService';

const renderSingleClinicianVisit = (visitData) => {
    const nameString = visitData.ownVisit ? 'You' : visitData.name;
    return (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{flex: 6, marginTop: 5}}>
                <StyledText style={{...styles.fontStyle, fontSize: 12, color: '#222222'}}>
                    {`${nameString}, ${visitData.role}`}
                </StyledText>
                <StyledText style={{...styles.fontStyle, fontSize: 12, color: '#999999'}}>
                    {visitData.plannedStartTime ? moment(visitData.plannedStartTime).format('h:mm A') : '--:--'}
                </StyledText>
            </View>
            {
                !!visitData.primaryContact && !visitData.ownVisit &&
                <View style={{flex: 1}}>
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
                    <Image source={Images.callButton} />
                    </TouchableOpacity>
                </View>
            }
        </View>
    );
};

const renderVisitSectionData = (visitSectionData) => {
    if (visitSectionData && visitSectionData.length > 0) {
        return (
            <View style={{marginHorizontal: 10, flexDirection: 'column'}}>
                <Divider style={{...styles.dividerStyle, marginBottom: 10}} />
                {visitSectionData.map((visitData) => renderSingleClinicianVisit(visitData))}
            </View>
        );
    }
    return (
        <View style={{marginHorizontal: 10, flexDirection: 'column'}}>
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


const getActiveDotStyle = (currentDate, date) => ({
        startDate: date,
        dotEnabled: true,
        dateNumberStyle: {fontWeight: '100'},
        dotColor: moment(currentDate).isSame(date, 'day') ? PrimaryColor : '#999999'
    });

const getCustomDateStyles = (currentDate, datesWithVisits) => {
    const customDateStyles = [
        {
            startDate: currentDate.valueOf(),
            dateNumberStyle: {color: 'white', fontWeight: '100'},
            dateNumberContainerStyle: {borderRadius: 3, backgroundColor: PrimaryColor, padding: 2}
        },
        {
            startDate: todayMomentInUTCMidnight().valueOf(),
            dateNameStyle: {color: PrimaryColor, fontWeight: '100'},
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
                    <Image source={Images.callButton} style={{height: 28, resizeMode: 'contain'}} />
                </TouchableOpacity>
            </View>
        </View>
);

const basicInfoCard = (props) => {
    const {
        dateOfBirth,

        emergencyContactNumber,
        emergencyContactName,
        emergencyContactRelation,
    } = props.patientDetail;

    const emergencyContactText = getEmergencyContactText(emergencyContactName, emergencyContactRelation);

    return (
        (dateOfBirth || (emergencyContactNumber !== '' && emergencyContactNumber)) &&
        <View
            style={cardViewStyle}
        >
            {dateOfBirth &&
            <View
                style={{
                    flexDirection: 'row',
                }}
            >
                <Image source={Images.birthday} style={{width: 20}} resizeMode={'contain'} />
                <View style={{marginLeft: 14}}>
                    <StyledText style={titleTextStyle}>
                        Birthday
                    </StyledText>
                    <StyledText style={{fontSize: 13, color: '#303030'}}>
                        {moment(dateOfBirth).format('DD MMM YYYY')}
                    </StyledText>
                </View>
            </View>}

            {emergencyContactNumber !== '' && emergencyContactNumber &&
            <View
                style={{
                    flexDirection: 'row',
                    paddingTop: dateOfBirth && 10,
                }}
            >
                <Image source={Images.emergencyIcon} style={{width: 20}} resizeMode={'contain'} />
                <View style={{marginLeft: 14}}>
                    <StyledText style={titleTextStyle}>
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
                            <StyledText style={{fontSize: 11, color: '#303030'}}>
                                {emergencyContactNumber}
                            </StyledText>
                            {emergencyContactText && emergencyContactText.length > 0 &&
                            <StyledText style={{fontSize: 11, color: '#303030'}}>
                                {emergencyContactText}
                            </StyledText>
                            }
                        </View>
                    </TouchableOpacity>
                </View>
            </View>}
        </View>
    );
};

const visitCalendar = props => {
    const {onWeekChanged, selectedVisitsDate, visitSectionData, onSelectVisitsDate, currentWeekVisitData} = props;
    const datesWithVisits = [];
    for (const dateKey in currentWeekVisitData) {
        if (currentWeekVisitData[dateKey].length > 0) {
            datesWithVisits.push(parseInt(dateKey, 10));
        }
    }

    return (
        <View style={cardViewStyle}>
            <View style={{flexDirection: 'row'}}>
                <Image source={Images.visits} />
                <View style={{marginLeft: 14}}>
                    <StyledText style={titleTextStyle}>
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
                    dateNumberStyle={{fontWeight: '100'}}
                    calendarHeaderStyle={{fontWeight: '100', fontSize: 14, alignSelf: 'flex-start'}}
                    calendarHeaderViewStyle={{marginLeft: 14, marginTop: 14}}
                    onDateSelected={(date) => {
                        firebase.analytics().logEvent(eventNames.PATIENT_ACTIONS, {
                            type: parameterValues.VIEW_VISIT_CALENDAR
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
    );
};

const physicianSection = props => {
    const physicianInfo = props.patientDetail.primaryPhysician;
    const physicianSectionPresent = physicianInfo && (physicianInfo.phone1 || physicianInfo.phone2);

    return (
        physicianSectionPresent &&
        <View style={cardViewStyle}>
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
    );
};

const careTeam = props => {
    if (props.patientDetail && props.patientDetail.episodes && props.patientDetail.episodes[0].careTeam.length > 0) {
        return (
            <View
                style={cardViewStyle}
            >
                <View
                    style={{
                        flexDirection: 'row',
                    }}
                >
                    <Image source={Images.teamCare} style={{width: 20}} resizeMode={'contain'} />
                    <StyledText
                        style={{...titleTextStyle, marginLeft: 14}}
                    >
                        Care Team
                    </StyledText>
                </View>
                <View
                    style={{
                        flex: 1,
                        flexWrap: 'wrap',
                        paddingLeft: 20,
                        flexDirection: 'row'
                    }}
                >
                    {props.patientDetail.episodes[0].careTeam.map(user => (
                            <Badge
                                value={user.firstName}
                                containerStyle={{margin: 4, padding: 5, backgroundColor: '#f0f0f0'}}
                                textStyle={{paddingHorizontal: 5, color: '#202020'}}
                            />
                        )
                    )}
                </View>
            </View>
        );
    }
};

const PatientDetailCard = (props) => {
    const {onPressAddVisit} = props;
    // let coordinates = null;
    // if (address) {
    //     if (address.coordinates &&
    //         address.coordinates.latitude !== null &&
    //         address.coordinates.longitude !== null) {
    //         coordinates = address.coordinates;
    //     }
    // }

    return (
        <View style={styles.parentContainerStyle}>
            <ScrollView
                style={{
                    paddingVertical: 7.5,
                    paddingHorizontal: 10,
                }}
            >
                {basicInfoCard(props)}
                {visitCalendar(props)}
                {careTeam(props)}
                {physicianSection(props)}

            </ScrollView>

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

const titleTextStyle = {
    fontSize: 13,
    color: '#858688'
};

const cardViewStyle = {
    flexDirection: 'column',
    padding: 17.5,
    margin: 8,
    backgroundColor: 'white',

    shadowRadius: 3,
    shadowColor: 'rgba(0, 0, 0, 0.17)',
    shadowOffset: {
        width: -0.1,
        height: 0.1
    },
    shadowOpacity: 1,
    elevation: 4,
};

export {PatientDetailCard};
