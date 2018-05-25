import React from 'react';
import {View, ScrollView, Image} from 'react-native';
import {Text, Button, Divider} from 'react-native-elements';
import moment from 'moment';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import styles from './styles';
import {styles as componentStyles} from '../common/styles';

import {PatientDetailMapComponent} from './PatientDetailMapComponent';
import {Diagnosis} from '../common/Diagnosis';
import {PrimaryColor} from '../../utils/constants';
import {Images} from '../../Images';
import StyledText from '../common/StyledText';
import ViewMore from '../common/ViewMore';

const renderViewMore = (e, onPressAddNotes) => {
    return (
        <Text style={{...styles.fontStyle, fontSize: 14, color: PrimaryColor}} onPress={onPressAddNotes}>Show Notes</Text>
    );
};

const getVisitsView = function (visitSectionData) {
    if (visitSectionData && visitSectionData.length > 0) {
        if (visitSectionData.length > 1) {
            return (
                <View style={componentStyles.listContainer}>
                    <StyledText style={{...styles.fontStyle, ...styles.visitStyle, opacity: 0.7}}>
                        {visitSectionData[0]}
                    </StyledText>
                    <StyledText style={{...styles.fontStyle, ...styles.visitStyle}}>
                        {visitSectionData[1]}
                    </StyledText>
                </View>
            );
        } else {
            return (
                <View style={componentStyles.listContainer}>
                    <StyledText style={{...styles.fontStyle, ...styles.visitStyle, width: '70%'}}>
                        {visitSectionData[0]}
                    </StyledText>
                </View>
            );
        }
    }
    return (
        <View style={{height: 16}} />
    );
};

const PatientDetailCard = (props) => {
    const {patientDetail, nextVisit, lastVisit, onPressAddVisit, onPressAddNotes, showCallout, setMarkerRef} = props;
    //Handle name with navigator props
    const {
        primaryContact,
        emergencyContact,
        diagnosis,
        notes,
        address
    } = patientDetail;

    let coordinates = null;
    if (address) {
        if (address.coordinates &&
            address.coordinates.latitude !== null &&
            address.coordinates.longitude !== null) {
            coordinates = address.coordinates;
        }
    }

    let lastVisitTimestamp = null;
    let nextVisitTimestamp = null;
    const visitSectionData = [];
    if (lastVisit) {
        lastVisitTimestamp = moment.utc(lastVisit.midnightEpochOfVisit);
        visitSectionData.push(`Last visited by You On "${lastVisitTimestamp.format('YYYY-MMM-DD')}"`);
    }
    if (nextVisit) {
        nextVisitTimestamp = moment.utc(nextVisit.midnightEpochOfVisit);
        visitSectionData.push(`Next visit scheduled On "${nextVisitTimestamp.format('YYYY-MMM-DD')}"`);
    }
    if (visitSectionData.length === 0) {
        visitSectionData.push('No visits scheduled for You.');
    }

    return (
        <View style={styles.parentContainerStyle}>
            {coordinates &&
            <PatientDetailMapComponent
                patientCoordinates={coordinates}
                patientAddress={address.formattedAddress}
                onRegionChangeComplete={showCallout}
                setMarkerRef={setMarkerRef}
            />
            }

            <ScrollView>
                <View style={styles.containerStyle}>
                    <Image source={Images.elliotLugo} />
                    <View style={{marginLeft: 14}}>
                        <StyledText style={{...styles.headerStyle, ...styles.fontStyle}}>
                            Primary Contact
                        </StyledText>
                        <StyledText style={{...styles.fontStyle, fontSize: 12, color: '#999999'}}>
                            {primaryContact}
                        </StyledText>
                    </View>
                    <Button
                        title="Call"
                        textStyle={{
                            ...styles.fontStyle,
                            color: PrimaryColor
                        }}
                        buttonStyle={styles.callButtonStyle}
                        containerViewStyle={{
                            width: '20%',
                            position: 'absolute',
                            right: 0
                        }}
                        onPress={() => {
                            if (primaryContact) {
                                RNImmediatePhoneCall.immediatePhoneCall(primaryContact);
                            }
                        }}
                    />
                </View>

                <Divider style={styles.dividerStyle} />

                {emergencyContact !== '' && emergencyContact &&
                <View style={styles.containerStyle}>
                    <Image source={Images.elliotLugo} />
                    <View style={{marginLeft: 14}}>
                        <StyledText style={{...styles.fontStyle, ...styles.headerStyle}}>
                            Emergency Contact
                        </StyledText>
                        <StyledText style={{...styles.fontStyle, fontSize: 12, color: '#999999'}}>
                            {emergencyContact}
                        </StyledText>
                    </View>
                    <Button
                        title="Call"
                        textStyle={{
                            ...styles.fontStyle,
                            color: PrimaryColor
                        }}
                        buttonStyle={styles.callButtonStyle}
                        containerViewStyle={{
                            width: '20%',
                            position: 'absolute',
                            right: 0
                        }}
                        onPress={() => {
                            if (emergencyContact) {
                                RNImmediatePhoneCall.immediatePhoneCall(emergencyContact);
                            }
                        }}
                    />
                </View>
                }

                {emergencyContact !== '' && emergencyContact &&
                <Divider style={styles.dividerStyle} />
                }

                <View style={[styles.containerStyle, {opacity: 0.3}]}>
                    <Image source={Images.diagnosis} />
                    <View style={{marginLeft: 14}}>
                        <StyledText style={{...styles.fontStyle, ...styles.headerStyle}}>
                            Diagnosis
                        </StyledText>
                        <Diagnosis diagnosis />
                    </View>
                </View>

                <Divider style={styles.dividerStyle} />

                <View style={styles.containerStyle}>
                    <Image source={Images.visits} />
                    <View style={{marginLeft: 14}}>
                        <StyledText style={{...styles.fontStyle, ...styles.headerStyle}}>
                            Visits
                        </StyledText>
                        {getVisitsView(visitSectionData)}
                    </View>
                </View>

                <Divider style={styles.dividerStyle} />

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
