import React from 'react';
import {Card, Divider, Text} from 'react-native-elements';
import {View, TouchableHighlight, Image, Linking, TouchableWithoutFeedback} from 'react-native';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import {CustomCheckBox} from './CustomCheckBox';
import {styles} from './styles';
import {Diagnosis} from './Diagnosis';
import {screenNames} from '../../utils/constants';

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
    return (({data}) => {
        const visit = data;
        const phoneNumber = visit.getAssociatedNumber();

        const onSelectionToggle = () => {
            if (isDoneToggle) {
                isDoneToggle(visit);
            }
        };
        // const rightIcon = visit.isDone ? {name: 'checkbox', color: '#45ceb1'} : {name: 'box', color: '#45ceb1'};
        // console.log(visit);
        // console.log('rerendered visitcard');
        return (
            //TODO suboptimal
            //<TouchableWithoutFeedback onPress={() => pushPatientDetailScreen(navigator, visit.getPatient())}>
                <Card containerStyle={[styles.cardContainerStyle]}>
                    <View style={{flexDirection: 'row'}}>
                        <View style={{flex: 1}}>
                            <Text style={styles.nameStyle}>{visit.getAssociatedName()}</Text>
                            <Text style={styles.addressStyle}>{visit.getAddress().streetAddress}</Text>
                        </View>
                        <CustomCheckBox
                            checked={visit.isDone}
                            onPress={onSelectionToggle}
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
                                //TODO not working on iOS
                                if (phoneNumber) {
                                    console.warn('calling');
                                    RNImmediatePhoneCall.immediatePhoneCall(visit.getAssociatedNumber(phoneNumber));
                                }
                            }}
                        >
                            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', opacity: phoneNumber ? 1 : 0.5}}>
                                <Image source={require('../../../resources/call.png')} />
                                <Text
                                    style={{fontSize: 14, color: '#222222'}}
                                >{'  CALL'}</Text>
                            </View>
                        </TouchableHighlight>
                        <Divider style={{width: 1.5, height: '60%', marginTop: 8, backgroundColor: '#dddddd'}} />
                        <TouchableHighlight
                            activeOpacity={0.5}
                            underlayColor={'white'}
                            style={{flex: 1, padding: 5}}
                            onPress={() => {
                                Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${visit.getAddress().getCommaSeperatedCoordinates()}`).catch(err => console.error('An error occurred', err));
                            }}
                        >
                            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                                <Image source={require('../../../resources/navigate.png')} />
                                <Text
                                    style={{fontSize: 14, color: '#222222'}}
                                >{'  NAVIGATE'}</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                </Card>
          //  </TouchableWithoutFeedback>
        );
    });
}

export {VisitCard};
