import React from 'react';
import {View, Dimensions, Image, TouchableWithoutFeedback, TouchableHighlight, Text} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import firebase from 'react-native-firebase';
import {VisitCardGenerator} from '../common/visitCardGenerator';
import {eventNames, parameterValues, PrimaryColor, screenNames} from '../../utils/constants';
import {Images} from '../../Images';
import StyledText from '../common/StyledText';
import {todayMomentInUTCMidnight} from '../../utils/utils';
import EmptyStateButton from '../common/EmptyStateButton';
import {VisitService} from '../../data_services/VisitServices/VisitService';
import {floDB, Visit} from '../../utils/data/schema';
import {styles as homeStyles} from './styles';

function onPressCard(visitID, navigator) {
    firebase.analytics().logEvent(eventNames.PATIENT_ACTIONS, {
        type: parameterValues.DETAILS
    });
    const visit = floDB.objectForPrimaryKey(Visit, visitID);
    if (visit.getPatient() && !visit.getPatient().archived) {
        navigator.push({
            screen: screenNames.patientDetails,
            passProps: {
                patientId: visit.getPatient().patientID
            },
            navigatorStyle: {
                tabBarHidden: true
            }
        });
    }
}

function visitSummaryToday(props) {
    const showEllipse = false;
    const showCheckBoxLine = false;
    const VisitCard = VisitCardGenerator({onDoneTogglePress: (visitID) => VisitService.getInstance().toggleVisitDone(visitID), navigator: props.navigator}, showEllipse, showCheckBoxLine);

    const primaryColor = PrimaryColor;
    const secondary = '#34da92';
    return (
        <View style={{flex: 1}}>
            <LinearGradient
                colors={[primaryColor, secondary]}
                start={{x: 0.0, y: 0.0}} end={{x: 0, y: 1}}
                style={{
                    alignItems: 'center',
                    margin: 0,
                    justifyContent: 'space-between'
                }}
            >
                <View style={homeStyles.headerStyle}>
                    <StyledText
                        style={{
                            fontSize: 24,
                            fontWeight: 'bold',
                            color: '#ffffff'
                        }}
                    >
                        {`${props.remainingVisitsCount} of ${props.totalVisitsCount} visits remaining`}
                    </StyledText>
                </View>
                <View>
                    <StyledText
                        style={{
                            alignSelf: 'center',
                            fontSize: 12,
                            color: '#ffffff',
                            marginTop: 10
                        }}
                    >
                        View visits on
                    </StyledText>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            marginTop: 10,
                            marginBottom: 20
                            // alignSelf: 'stretch',
                        }}
                    >

                        <TouchableWithoutFeedback onPress={props.navigateToVisitListScreen}>
                            <View style={homeStyles.listViewIconStyle}>
                                <Image
                                    source={Images.list}
                                />
                                <Text style={{alignSelf: 'center', color: '#ffffff'}}>
                                    List
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback onPress={props.navigateToVisitMapScreen}>
                            <View style={homeStyles.listViewIconStyle}>
                                <Image
                                    source={Images.map}
                                />
                                <Text style={{alignSelf: 'center', color: '#ffffff'}}>
                                    Maps
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>

                    </View>
                </View>
            </LinearGradient>
            <View
                style={{
                    width: Dimensions.get('screen').width,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 15
                }}
            >
                <StyledText style={{fontSize: 12, color: '#999999'}}>
                    Next Visit
                </StyledText>
                <VisitCard
                    data={props.visitID}
                />
            </View>
        </View>
    );
}

function visitSummaryFuture(props) {
    const primaryColor = PrimaryColor;
    const secondary = '#34da92';
    return (
        <View style={{flex: 1}}>
            <LinearGradient
                colors={[primaryColor, secondary]}
                start={{x: 0.0, y: 0.0}} end={{x: 0, y: 1}}
                style={{
                    alignItems: 'center',
                    margin: 0,
                    justifyContent: 'space-between',
                    // marginTop: 60,
                    // paddingTop: 10,
                    // paddingBottom: 10
                }}
            >
                <View style={homeStyles.headerStyle}>
                    <StyledText
                        style={{
                            fontSize: 24,
                            fontWeight: 'bold',
                            color: '#ffffff'
                        }}
                    >
                        {`${props.totalVisitsCount} visits planned`}
                    </StyledText>
                </View>
                <View>
                    <StyledText
                        style={{
                            alignSelf: 'center',
                            fontSize: 12,
                            color: '#ffffff',
                            marginTop: 10
                        }}
                    >
                        View visits on
                    </StyledText>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            marginTop: 10,
                            marginBottom: 20
                            // alignSelf: 'stretch',
                        }}
                    >

                        <TouchableWithoutFeedback onPress={props.navigateToVisitListScreen}>
                            <View style={homeStyles.listViewIconStyle}>
                                <Image
                                    style={{resizeMode: 'contain'}}
                                    source={Images.list}
                                />
                                <Text style={{alignSelf: 'center', color: '#ffffff'}}>
                                    List
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback onPress={props.navigateToVisitMapScreen}>
                            <View style={homeStyles.listViewIconStyle}>
                                <Image
                                    style={{resizeMode: 'contain'}}
                                    source={Images.map}
                                />
                                <Text style={{alignSelf: 'center', color: '#ffffff'}}>
                                    Maps
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            </LinearGradient>
            <View
                style={{
                    width: Dimensions.get('screen').width,
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    marginTop: 30
                }}
            >
                <EmptyStateButton
                    onPress={props.onPressAddVisit}
                >
                    Add Visits
                </EmptyStateButton>
            </View>
        </View>
    );
}

function visitSummaryPast(props) {
    const primaryColor = PrimaryColor;
    const secondary = '#34da92';
    return (
        <View style={{flex: 1}}>
            <LinearGradient
                colors={[primaryColor, secondary]}
                start={{x: 0.0, y: 0.0}} end={{x: 0, y: 1}}
                style={{
                    alignItems: 'center',
                    margin: 0,
                    justifyContent: 'space-between'
                    // marginTop: 60,
                    // paddingTop: 10,
                    // paddingBottom: 30
                }}
            >
                <View style={homeStyles.headerStyle}>
                    <StyledText
                        style={{
                            fontSize: 24,
                            fontWeight: 'bold',
                            color: '#ffffff'
                        }}
                    >
                        {`${props.totalVisitsCount} visits`}
                    </StyledText>
                </View>
                <View>
                    <StyledText
                        style={{
                            alignSelf: 'center',
                            fontSize: 12,
                            color: '#ffffff',
                            marginTop: 10
                        }}
                    >
                        View visits on
                    </StyledText>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            marginTop: 10,
                            marginBottom: 20
                            // alignSelf: 'stretch',
                        }}
                    >

                        <TouchableWithoutFeedback onPress={props.navigateToVisitListScreen}>
                            <View style={homeStyles.listViewIconStyle}>
                                <Image
                                    style={{resizeMode: 'contain'}}
                                    source={Images.list}
                                />
                                <Text style={{alignSelf: 'center', color: '#ffffff'}}>
                                    List
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback onPress={props.navigateToVisitMapScreen}>
                            <View style={homeStyles.listViewIconStyle}>
                                <Image
                                    style={{resizeMode: 'contain'}}
                                    source={Images.map}
                                />
                                <Text style={{alignSelf: 'center', color: '#ffffff'}}>
                                    Maps
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>

                    </View>
                </View>
            </LinearGradient>
        </View>
    );
}

export function VisitSummary(props) {
    if (props.date.isSame(todayMomentInUTCMidnight())) return visitSummaryToday(props);
    else if (props.date.isBefore(todayMomentInUTCMidnight())) return visitSummaryPast(props);
    return visitSummaryFuture(props);
}
