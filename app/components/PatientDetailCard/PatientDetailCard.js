import React from 'react';
import {View, Linking, ScrollView, Image} from 'react-native';
import {Text, Button, Divider, Icon} from 'react-native-elements';
import moment from 'moment';
import ViewMoreText from 'react-native-view-more-text';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import styles from './styles';
import {styles as componentStyles} from '../common/styles';

import {PatientDetailMapComponent} from './PatientDetailMapComponent';
import {Diagnosis} from '../common/Diagnosis';
import {PrimaryColor} from '../../utils/constants';

const renderViewMore = (e, onPressAddNotes) => {
    return (
        <Text style={{color: PrimaryColor}} onPress={onPressAddNotes}>EDIT NOTES</Text>
    );
};

const renderViewLess = (onPress) => {
    return (
        <Text style={{color: PrimaryColor}} onPress={onPress}>View less</Text>
    );
};

const getVisitsView = function (visitSectionData) {
    if (visitSectionData && visitSectionData.length > 0) {
        if (visitSectionData.length > 1) {
            return (
                <View style={componentStyles.listContainer}>
                    <Text style={{...styles.visitStyle, opacity: 0.7}}>
                        {visitSectionData[0]}
                    </Text>
                    <Text style={styles.visitStyle}>
                        {visitSectionData[1]}
                    </Text>
                </View>
            );
        } else {
            return (
                <View style={componentStyles.listContainer}>
                    <Text style={{...styles.visitStyle, width: '70%'}}>
                        {visitSectionData[0]}
                    </Text>
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
        lastVisitTimestamp = moment.utc(lastVisit.midnightEpochOfVisit).local();
        visitSectionData.push(`Last visited by You On "${lastVisitTimestamp.format('YYYY-MMM-DD')}"`);
    }
    if (nextVisit) {
        nextVisitTimestamp = moment.utc(nextVisit.midnightEpochOfVisit).local();
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
                    <Image source={require('../../../resources/elliotLugo.png')} />
                    <View style={{marginLeft: 14}}>
                        <Text style={styles.headerStyle}>
                            Primary Contact
                        </Text>
                        <Text style={{fontSize: 12, color: '#999999'}}>
                            {primaryContact}
                        </Text>
                    </View>
                    <Button
                        title="Call"
                        textStyle={{
                            fontSize: 18,
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
                    <Image source={require('../../../resources/elliotLugo.png')} />
                    <View style={{marginLeft: 14}}>
                        <Text style={styles.headerStyle}>
                            Emergency Contact
                        </Text>
                        <Text style={{fontSize: 12, color: '#999999'}}>
                            {emergencyContact}
                        </Text>
                    </View>
                    <Button
                        title="Call"
                        textStyle={{
                            fontSize: 18,
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
                    <Image source={require('../../../resources/diagnosis.png')} />
                    <View style={{marginLeft: 14}}>
                        <Text style={styles.headerStyle}>
                            Diagnosis
                        </Text>
                        <Diagnosis diagnosis />
                    </View>
                </View>

                <Divider style={styles.dividerStyle} />

                <View style={styles.containerStyle}>
                    <Image source={require('../../../resources/visits.png')} />
                    <View style={{marginLeft: 14}}>
                        <Text style={styles.headerStyle}>
                            Visits
                        </Text>
                        {getVisitsView(visitSectionData)}
                    </View>
                </View>

                <Divider style={styles.dividerStyle} />

                <View style={styles.containerStyle}>
                    <Image
                        source={require('../../../resources/notes.png')}
                    />
                    <View style={{marginLeft: 14, marginRight: 16}}>
                        <Text style={styles.headerStyle}>
                            Notes
                        </Text>
                        <ViewMoreText
                            textStyle={styles.noteStyle}
                            numberOfLines={2}
                            renderViewMore={(e) => renderViewMore(e, onPressAddNotes)}
                            renderViewLess={renderViewLess}
                        >
                            {notes || 'You have not added any note for this patient.'}
                        </ViewMoreText>
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
                large
            />
        </View>
    );
};

export {PatientDetailCard};
