import React from 'react';
import {View, FlatList, Linking, ScrollView, Image, Dimensions} from 'react-native';
import {Text, Button, Divider, Icon} from 'react-native-elements';
import moment from 'moment';
import Badge from 'react-native-elements/src/badge/badge';
import styles from './styles';
import {styles as componentStyles} from '../common/styles';

import {PatientDetailMapComponent} from './PatientDetailMapComponent';

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
                patientAddress={address.streetAddress}
                onRegionChangeComplete={showCallout}
                setMarkerRef={setMarkerRef}
            />
            }

            <ScrollView style={{flex: 8}}>
                <View style={styles.containerStyle}>
                    <Icon name="phone" size={22} color="#999999" containerStyle={styles.iconStyle} />
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
                            color: '#45ceb1'
                        }}
                        buttonStyle={styles.callButtonStyle}
                        containerViewStyle={{
                            width: '20%',
                            position: 'absolute',
                            right: 0
                        }}
                        onPress={() => Linking.openURL(`tel:${primaryContact}`).catch(err => console.error('An error occurred', err))}
                    />
                </View>

                <Divider style={styles.dividerStyle} />

                {emergencyContact !== '' && emergencyContact &&
                <View style={styles.containerStyle}>
                    <Icon name="phone" size={22} color="#999999" containerStyle={styles.iconStyle} />
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
                            color: '#45ceb1'
                        }}
                        buttonStyle={styles.callButtonStyle}
                        containerViewStyle={{
                            position: 'absolute',
                            right: 0
                        }}
                        onPress={() => Linking.openURL(`tel:${emergencyContact}`).catch(err => console.error('An error occurred', err))}
                    />
                </View>
                }

                <Divider style={styles.dividerStyle} />

                <View style={[styles.containerStyle, {opacity: 0.3}]}>
                    <Image source={require('../../../resources/diagnosis.png')} />
                    <View style={{marginLeft: 14}}>
                        <Text style={styles.headerStyle}>
                            Diagnosis
                        </Text>
                        <FlatList
                            showsHorizontalScrollIndicator={false}
                            horizontal
                            style={componentStyles.listContainer}
                            data={[
                                '#CHF',
                                '#COPD',
                                '#THR',
                                '#UTI',
                            ]}
                            renderItem={({item}) =>
                                <Badge
                                    containerStyle={componentStyles.badgeContainerStyle}
                                    textStyle={componentStyles.badgeTextStyle}
                                    value={item}
                                />
                            }
                        />
                    </View>
                </View>

                <Divider style={styles.dividerStyle} />

                <View style={styles.containerStyle}>
                    <Image source={require('../../../resources/visits.png')} />
                    <View style={{marginLeft: 14}}>
                        <Text style={styles.headerStyle}>
                            Visits
                        </Text>
                        <FlatList
                            showsHorizontalScrollIndicator={false}
                            horizontal
                            style={componentStyles.listContainer}
                            data={visitSectionData}
                            show
                            renderItem={({item}) =>
                                /*Use nested texts for spannable*/
                                <Text style={styles.visitStyle}>
                                    {item}
                                </Text>
                            }
                        />
                    </View>
                </View>

                <Divider style={styles.dividerStyle} />

                <View style={styles.containerStyle}>
                    <Image
                        source={require('../../../resources/notes.png')}
                    />
                    <View style={{marginLeft: 14}}>
                        <Text style={styles.headerStyle}>
                            Notes
                        </Text>
                        <Text style={styles.noteStyle}>
                            {notes || 'You have not added any note for this patient.'}
                        </Text>
                    </View>
                </View>
            </ScrollView>

            <Divider style={styles.dividerStyle} />

            <View style={styles.buttonContainerStyle}>
                <Button
                    title="Add Visit"
                    buttonStyle={styles.footerButtonStyle}
                    containerViewStyle={{width: '45%'}}
                    onPress={onPressAddVisit}
                />
                <Button
                    title="Add Notes"
                    buttonStyle={styles.footerButtonStyle}
                    containerViewStyle={{width: '45%'}}
                    onPress={onPressAddNotes}
                />
            </View>
        </View>
    );
};

export {PatientDetailCard};
