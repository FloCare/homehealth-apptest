import React from 'react';
import {Card, Text, Divider} from 'react-native-elements';
import firebase from 'react-native-firebase';
import {View, TouchableHighlight, Image, Linking, TouchableWithoutFeedback, Platform} from 'react-native';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import {CustomCheckBox} from './CustomCheckBox';
import {styles} from './styles';
import {Diagnosis} from './Diagnosis';
import {screenNames, PrimaryColor, eventNames, parameterValues} from '../../utils/constants';
import {Images} from '../../Images';
import StyledText from '../common/StyledText';

function pushPatientDetailScreen(navigator, patient) {
    if (patient) {
        navigator.push({
            screen: screenNames.patientDetails,
            passProps: {
                patientId: patient.patientID
            }
        });
    }
}

function VisitCard({isDoneToggle, navigator}) {
    //
    // render() {
    //     console.log(`card render ${this.props.patientName}called at ${Date.now()}`);
    return ((props) => {
        console.log('- - - - - - - - - - - - - - ');
        const visit = props.data;
        const phoneNumber = visit.getAssociatedNumber();
        const coordinates = visit.getAddress().coordinates;
        let ownerArchived = false;
        if (visit.isOwnerArchived()) {
            ownerArchived = true;
        }
        const phoneNumberActive = (phoneNumber && (!ownerArchived));
        const navigationActive = (coordinates && (!ownerArchived));

        const onSelectionToggle = () => {
            if (isDoneToggle) {
                isDoneToggle(visit);
            }
        };
        // const rightIcon = visit.isDone ? {name: 'checkbox', color: PrimaryColor} : {name: 'box', color: PrimaryColor};
        // console.log(visit);
        // console.log('rerendered visitcard');
        return (
            //TODO suboptimal
            //<TouchableWithoutFeedback onPress={() => pushPatientDetailScreen(navigator, visit.getPatient())}>
                <Card
                    containerStyle={
                        [
                            styles.cardContainerStyle,
                            props.sortingActive && !props.active ? {opacity: 0.7} : {},
                            props.active ? {elevation: 6, borderColor: '#74dbc4', borderWidth: 1} : {}
                            ]}
                >
                    <View style={{flexDirection: 'row'}}>
                        <View style={{flex: 1}}>
                            <Text style={styles.nameStyle}>{visit.getAssociatedName()}</Text>
                            <Text style={styles.addressStyle}>{visit.getAddress().formattedAddress}</Text>
                        </View>
                        <CustomCheckBox
                            checked={visit.isDone}
                            onPress={onSelectionToggle}
                            disabled={ownerArchived}
                        />
                    </View>
                    <Diagnosis diagnosis={visit.getDiagnosis()} />
                    <Divider style={{marginBottom: 4, marginRight: 15, height: 1.5, backgroundColor: '#dddddd'}} />
                    <View
                        style={{flexDirection: 'row', flex: 1, justifyContent: 'space-around', margin: 0, padding: 0}}
                    >
                        <TouchableHighlight
                            activeOpacity={0.5}
                            underlayColor={'white'}
                            style={{flex: 1, padding: 5}}
                            onPress={() => {
                                firebase.analytics().logEvent(eventNames.PATIENT_ACTIONS, {
                                    'type': parameterValues.CALL
                                });
                                //TODO not working on iOS
                                if (phoneNumberActive) {
                                    if (Platform.OS === 'android') {
                                        Linking.openURL(`tel: ${visit.getAssociatedNumber(phoneNumber)}`);
                                    } else {
                                        RNImmediatePhoneCall.immediatePhoneCall(visit.getAssociatedNumber(phoneNumber));
                                    }
                                }
                            }}
                        >
                            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', opacity: phoneNumberActive ? 1 : 0.4}}>
                                <Image
                                    source={Images.call}
                                    style={(!phoneNumberActive) ? {tintColor: 'black'} : {}}
                                />
                                <StyledText
                                    style={{fontSize: 14, color: '#222222'}}
                                >{'  CALL'}</StyledText>
                            </View>
                        </TouchableHighlight>
                        <Divider style={{width: 1.5, height: '60%', marginTop: 8, backgroundColor: '#dddddd'}} />
                        <TouchableHighlight
                            activeOpacity={0.5}
                            underlayColor={'white'}
                            style={{flex: 1, padding: 5}}
                            onPress={() => {
                                firebase.analytics().logEvent(eventNames.PATIENT_ACTIONS, {
                                    'type': parameterValues.NAVIGATION
                                });
                                if (navigationActive) { Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${visit.getAddress().getCommaSeperatedCoordinates()}`).catch(err => console.error('An error occurred', err)); }
                            }}
                        >
                            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', opacity: navigationActive ? 1 : 0.4}}>
                                <Image
                                    source={Images.navigate}
                                    style={!navigationActive ? {tintColor: 'black'} : {}}
                                />
                                <StyledText
                                    style={{fontSize: 14, color: '#222222'}}
                                >{'  NAVIGATE'}</StyledText>
                            </View>
                        </TouchableHighlight>
                    </View>
                </Card>
          //  </TouchableWithoutFeedback>
        );
    });
}

export {VisitCard};
