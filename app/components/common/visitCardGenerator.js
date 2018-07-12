import React, {PureComponent} from 'react';
import {Text, Divider} from 'react-native-elements';
import firebase from 'react-native-firebase';
import {connect} from 'react-redux';
import {View, TouchableHighlight, Image, Linking, Platform, Dimensions} from 'react-native';
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
    props.primaryContact = !visitOwner.archived && visitOwner.primaryContact;

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

function VisitCardGenerator({onDoneTogglePress}) {
    const {width} = Dimensions.get('window');

    class RenderRow extends PureComponent {
        render() {
            console.log('- - - - - - VisitCard Render- - - - - - - - ');
            const safeOnDoneTogglePress = () => {
                if (onDoneTogglePress) {
                    onDoneTogglePress(this.props.visitID);
                }
            };
            return (

                <View
                    style={
                        [
                            {
                                // height: Math.max(height * 0.16),
                                width: width * 0.90,
                                padding: 15
                            },
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
                    <View style={{height: 50, flexDirection: 'row'}}>
                        <View style={{flex: 1}}>
                            <Text style={styles.nameStyle}>{this.props.name}</Text>
                            <Text style={styles.addressStyle}>{this.props.formattedAddress}</Text>
                        </View>
                        <CustomCheckBox
                            checked={this.props.isDone}
                            onPress={safeOnDoneTogglePress}
                        />
                    </View>
                    <Divider style={{marginVertical: 4, marginRight: 15, height: 1.5, backgroundColor: '#dddddd'}} />
                    <View
                        style={{flexDirection: 'row', justifyContent: 'space-around', height: 35}}
                    >
                        <TouchableHighlight
                            activeOpacity={0.4}
                            underlayColor={'white'}
                            style={{flex: 1}}
                            onPress={() => {
                                firebase.analytics().logEvent(eventNames.PATIENT_ACTIONS, {
                                    type: parameterValues.CALL_PATIENT
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
                            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', opacity: this.props.primaryContact ? 1 : 0.4}}>
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
                            activeOpacity={0.4}
                            underlayColor={'white'}
                            style={{flex: 1}}
                            onPress={() => {
                                firebase.analytics().logEvent(eventNames.PATIENT_ACTIONS, {
                                    type: parameterValues.NAVIGATION
                                });
                                if (this.props.coordinates) {
                                    Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${this.props.coordinates.latitude},${this.props.coordinates.longitude}`).catch(err => console.error('An error occurred', err));
                                }
                            }}
                        >
                            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', opacity: this.props.coordinates ? 1 : 0.4}}>
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
                </View>
            );
        }
    }

    return connect(mapStateToProps)(RenderRow);
}

export {VisitCardGenerator};
