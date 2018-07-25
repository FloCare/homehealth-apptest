import React from 'react';
import {View, Dimensions, Image, TouchableWithoutFeedback, TouchableHighlight} from 'react-native';
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
    const isHomeScreen = true;
    const VisitCard = VisitCardGenerator({onDoneTogglePress: (visitID) => VisitService.getInstance().toggleVisitDone(visitID), navigator: props.navigator}, isHomeScreen);

    const primaryColor = PrimaryColor;
    const secondary = '#34da92';
    return (
        <LinearGradient
            colors={[primaryColor, secondary]}
            start={{x: 0.0, y: 0.0}} end={{x: 0, y: 1}}
            style={{
                flex: 1,
                alignItems: 'center',
                margin: 0,
                justifyContent: 'space-between'
                // marginTop: 60,
                // paddingTop: 10,
                // paddingBottom: 30
            }}
        >
            <View style={{flex: 1, justifyContent: 'center'}}>
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
            <View style={{flex: 2}}>
                <StyledText
                    style={{
                        alignSelf: 'center',
                        fontSize: 12,
                        color: '#ffffff'
                    }}
                >
                    View visits on
                </StyledText>
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        // alignSelf: 'stretch',
                    }}
                >
                    <TouchableWithoutFeedback onPress={props.navigateToVisitMapScreen}>
                        {/*// underlayColor={primaryColor}>*/}
                        <Image
                            style={{resizeMode: 'contain'}}
                            source={Images.map}
                        />
                    </TouchableWithoutFeedback>


                    <TouchableWithoutFeedback onPress={props.navigateToVisitListScreen}>
                        <Image
                            style={{resizeMode: 'contain'}}
                            source={Images.list}
                        />
                    </TouchableWithoutFeedback>
                </View>
            </View>
            <View
                style={{
                    flex: 4,
                    width: Dimensions.get('screen').width,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <StyledText
                    style={{
                        fontSize: 14,
                        color: '#ffffff',
                    }}
                >
                    Next Visit
                </StyledText>
                <TouchableHighlight underlayColor={'clear'} onPress={() => onPressCard(props.visitID, props.navigator)}>
                    <VisitCard
                        data={props.visitID}
                    />
                </TouchableHighlight>
            </View>
        </LinearGradient>
    );
}

function visitSummaryFuture(props) {
    const primaryColor = PrimaryColor;
    const secondary = '#34da92';
    return (
        <LinearGradient
            colors={[primaryColor, secondary]}
            start={{x: 0.0, y: 0.0}} end={{x: 0, y: 1}}
            style={{
                flex: 1,
                alignItems: 'center',
                margin: 0,
                justifyContent: 'space-between'
                // marginTop: 60,
                // paddingTop: 10,
                // paddingBottom: 30
            }}
        >
            <View style={{flex: 2, justifyContent: 'center'}}>
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
            <View style={{flex: 2}}>
                <StyledText
                    style={{
                        alignSelf: 'center',
                        fontSize: 12,
                        color: '#ffffff'
                    }}
                >
                    View visits on
                </StyledText>
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        // alignSelf: 'stretch',
                    }}
                >
                    <TouchableWithoutFeedback onPress={props.navigateToVisitMapScreen}>
                        {/*// underlayColor={primaryColor}>*/}
                        <Image
                            style={{resizeMode: 'contain'}}
                            source={Images.map}
                        />
                    </TouchableWithoutFeedback>


                    <TouchableWithoutFeedback onPress={props.navigateToVisitListScreen}>
                        <Image
                            style={{resizeMode: 'contain'}}
                            source={Images.list}
                        />
                    </TouchableWithoutFeedback>
                </View>
            </View>
            <View
                style={{
                    flex: 3,
                    width: Dimensions.get('screen').width,
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                }}
            >
                <EmptyStateButton
                    onPress={props.onPressAddVisit}
                >
                    Add Visits
                </EmptyStateButton>
            </View>
        </LinearGradient>
    );
}

function visitSummaryPast(props) {
    const primaryColor = PrimaryColor;
    const secondary = '#34da92';
    return (
        <LinearGradient
            colors={[primaryColor, secondary]}
            start={{x: 0.0, y: 0.0}} end={{x: 0, y: 1}}
            style={{
                flex: 1,
                alignItems: 'center',
                margin: 0,
                justifyContent: 'space-between'
                // marginTop: 60,
                // paddingTop: 10,
                // paddingBottom: 30
            }}
        >
            <View style={{flex: 1, justifyContent: 'center'}}>
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
            <View style={{flex: 2}}>
                <StyledText
                    style={{
                        alignSelf: 'center',
                        fontSize: 12,
                        color: '#ffffff'
                    }}
                >
                    View visits on
                </StyledText>
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        // alignSelf: 'stretch',
                    }}
                >
                    <TouchableWithoutFeedback onPress={props.navigateToVisitMapScreen}>
                        {/*// underlayColor={primaryColor}>*/}
                        <Image
                            style={{resizeMode: 'contain'}}
                            source={Images.map}
                        />
                    </TouchableWithoutFeedback>


                    <TouchableWithoutFeedback onPress={props.navigateToVisitListScreen}>
                        <Image
                            style={{resizeMode: 'contain'}}
                            source={Images.list}
                        />
                    </TouchableWithoutFeedback>
                </View>
            </View>
        </LinearGradient>
    );
}

export function VisitSummary(props) {
    if (props.date.isSame(todayMomentInUTCMidnight())) return visitSummaryToday(props);
    else if (props.date.isBefore(todayMomentInUTCMidnight())) return visitSummaryPast(props);
    return visitSummaryFuture(props);
}
