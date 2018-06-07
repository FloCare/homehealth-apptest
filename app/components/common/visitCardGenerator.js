import React, {PureComponent} from 'react';
import {Card, Text, Divider} from 'react-native-elements';
import firebase from 'react-native-firebase';
import {connect} from 'react-redux';
import {View, TouchableHighlight, Image, Linking, Platform} from 'react-native';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import {CustomCheckBox} from './CustomCheckBox';
import {styles} from './styles';
import {eventNames, parameterValues} from '../../utils/constants';
import {Images} from '../../Images';
import StyledText from '../common/StyledText';

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
    } else {
        const placeID = visit.placeID;
        visitOwner = state.places[placeID];
    }

    props.name = visitOwner.name;
    props.primaryContact = visitOwner.primaryContact;

    const address = state.addresses[visitOwner.addressID];
    props.coordinates = {
        latitude: address.latitude,
        longitude: address.longitude
    };
    props.formattedAddress = address.formattedAddress;

    return props;
};

function VisitCardGenerator({onDoneTogglePress}) {
    class RenderRow extends PureComponent {
        render() {
            console.log('- - - - - - VisitCard Render- - - - - - - - ');
            const safeOnDoneTogglePress = () => {
                if (onDoneTogglePress) {
                    onDoneTogglePress(this.props.visitID);
                }
            };
            return (
                <Card
                    containerStyle={
                        [
                            styles.cardContainerStyle,
                            this.props.sortingActive && !this.props.active ? {opacity: 0.7} : {},
                            this.props.active ? {elevation: 6, borderColor: '#74dbc4', borderWidth: 1} : {}
                        ]}
                >
                    <View style={{flexDirection: 'row'}}>
                        <View style={{flex: 1}}>
                            <Text style={styles.nameStyle}>{this.props.name}</Text>
                            <Text style={styles.addressStyle}>{this.props.formattedAddress}</Text>
                        </View>
                        <CustomCheckBox
                            checked={this.props.isDone}
                            onPress={safeOnDoneTogglePress}
                        />
                    </View>
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
                                    type: parameterValues.CALL
                                });
                                //TODO not working on iOS
                                if (this.props.primaryContact) {
                                    if (Platform.OS === 'android') {
                                        Linking.openURL(`tel: ${this.props.primaryContact}`);
                                    } else {
                                        RNImmediatePhoneCall.immediatePhoneCall(this.props.primaryContact);
                                    }
                                }
                            }}
                        >
                            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', opacity: this.props.primaryContact ? 1 : 0.4}}>
                                <Image
                                    source={Images.call}
                                    style={!this.props.primaryContact ? {tintColor: 'black'} : {}}
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
                                    type: parameterValues.NAVIGATION
                                });
                                if (this.props.coordinates !== null) { Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${this.props.coordinates.latitude},${this.props.coordinates.longitude}`).catch(err => console.error('An error occurred', err)); }
                            }}
                        >
                            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', opacity: this.props.coordinates ? 1 : 0.4}}>
                                <Image
                                    source={Images.navigate}
                                    style={!this.props.coordinates ? {tintColor: 'black'} : {}}
                                />
                                <StyledText
                                    style={{fontSize: 14, color: '#222222'}}
                                >{'  NAVIGATE'}</StyledText>
                            </View>
                        </TouchableHighlight>
                    </View>
                </Card>
            );
        }
    }

    return connect(mapStateToProps)(RenderRow);
}

export {VisitCardGenerator};
