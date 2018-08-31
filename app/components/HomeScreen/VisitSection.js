import React from 'react';
import {View, TouchableWithoutFeedback, TouchableHighlight, Text, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import firebase from 'react-native-firebase';
import {VisitCardGenerator} from '../common/visitCardGenerator';
import {eventNames, parameterValues, PrimaryColor, screenNames} from '../../utils/constants';
import StyledText from '../common/StyledText';
import EmptyStateButton from '../common/EmptyStateButton';
import {VisitService} from '../../data_services/VisitServices/VisitService';
import {floDB, Visit} from '../../utils/data/schema';
import {styles} from '../common/styles';
import {Images} from '../../Images';

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

function navigationButtons(props) {
    if (props.totalVisitsCount === 0) return;
    return (<View
        style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            height: 35,
            position: 'relative',
            top: -20,
            paddingHorizontal: 50,
            shadowRadius: 5,
            shadowColor: 'rgba(0, 0, 0, 0.21)',
            shadowOffset: {
                width: -0.1,
                height: 1.5
            },
            shadowOpacity: 1,
        }}
    >
        <TouchableWithoutFeedback onPress={props.navigateToVisitMapScreen}>
            <LinearGradient
                colors={['#34da92', PrimaryColor]}
                start={{x: 0.0, y: 0.0}} end={{x: 0, y: 1}}
                style={{
                    flex: 1,
                    borderTopLeftRadius: 17.5,
                    borderBottomLeftRadius: 17.5,
                    backgroundColor: '#45ceb0',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 35,
                }}
            >
                <Image
                    style={{marginLeft: 10, height: 35, resizeMode: 'contain'}}
                    source={Images.map}
                />
                <Text style={{marginHorizontal: 10, alignSelf: 'center', color: '#ffffff'}}>
                    Map
                </Text>
            </LinearGradient>
        </TouchableWithoutFeedback>
        <View style={{width: 1, backgroundColor: 'white'}} />
        <TouchableWithoutFeedback onPress={props.navigateToVisitListScreen}>
            <LinearGradient
                colors={['#34da92', PrimaryColor]}
                start={{x: 0.0, y: 0.0}} end={{x: 0, y: 1}}
                style={{
                    flex: 1,
                    borderTopRightRadius: 17.5,
                    borderBottomRightRadius: 17.5,
                    backgroundColor: '#45ceb0',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 35,
                }}
            >
                <Image
                style={{height: 35, resizeMode: 'contain'}}
                source={Images.list}
                />
                <Text style={{marginHorizontal: 10, alignSelf: 'center', color: '#ffffff'}}>
                    List
                </Text>
            </LinearGradient>
        </TouchableWithoutFeedback>

    </View>);
}

function visitSummary(props) {
    const cellGenerator = (count, text, style) =>
        <View style={{alignItems: 'center', ...style}}>
            <StyledText
                style={{
                    fontSize: 24,
                    fontWeight: '500',
                    color: PrimaryColor
                }}
            >
                {`${count}`}
            </StyledText>
            <StyledText
                style={{
                    fontSize: 12,
                    color: '#000000'
                }}
            >
                {`${text}`}
            </StyledText>
        </View>;

    const vertLine = <View style={{width: 1, backgroundColor: '#e6e6e6'}} />;

    let whiteBoxContents = [
        cellGenerator(props.totalVisitsCount, 'Total Visits'),
        props.dateMinusToday === 0 ? vertLine : undefined,
        props.dateMinusToday === 0 ? cellGenerator(props.totalVisitsCount - props.remainingVisitsCount, 'Completed') : undefined,
        props.dateMinusToday === 0 ? vertLine : undefined,
        props.dateMinusToday === 0 ? cellGenerator(props.remainingVisitsCount, 'Remaining') : undefined,
    ];

    if (props.remainingVisitsCount === 0) {
        whiteBoxContents = [
            <StyledText
                style={{
                    fontWeight: '300',
                    fontSize: 20,
                    color: 'grey',
                    paddingHorizontal: 20,
                    textAlign: 'center',
                    marginVertical: 10
                }}
            >{props.totalVisitsCount !== 0 ? 'Great job! All planned visits completed' : 'No Day\'s Summary'}</StyledText>,
        ];
    }

    const whiteBox =
        (<View
            style={{
                flexDirection: props.remainingVisitsCount !== 0 ? 'row' : 'column',
                ...styles.cardContainerStyle,
                justifyContent: 'space-evenly',
                shadowRadius: 3,
                paddingHorizontal: 22,
                paddingTop: 20,
                paddingBottom: props.remainingVisitsCount !== 0 ? 35 : 20
            }}
        >
            {whiteBoxContents}
        </View>);

    return (
        <View
            style={{
                flex: 1,
                borderRadius: 5,
                marginHorizontal: 20,
            }}
        >
            {whiteBox}
            {navigationButtons(props)}
        </View>
    );
}

function cardArea(props) {
    if (props.dateMinusToday === 0 && props.remainingVisitsCount > 0) {
        const VisitCard = VisitCardGenerator({
            onDoneTogglePress: (visitID) => VisitService.getInstance().toggleVisitDone(visitID),
            navigator: props.navigator
        }, false, false);

        return (<View style={{alignItems: 'center'}}>
            <StyledText style={{fontSize: 12, color: '#999999', marginVertical: 5}}>
                Next Visit
            </StyledText>
            <TouchableHighlight underlayColor={'clear'} onPress={() => onPressCard(props.visitID, props.navigator)}>
                <VisitCard
                    data={props.visitID}
                />
            </TouchableHighlight>
        </View>);
    } else if (props.dateMinusToday >= 0) {
        return (
            <View style={{alignItems: 'center'}}>
                <StyledText
                    style={{
                        textAlign: 'center',
                        padding: 0,
                        margin: 20,
                        marginTop: 5,
                        fontSize: 14,
                        color: 'grey'
                    }}
                >{
                    props.totalVisitsCount !== 0 ?
                        (props.remainingVisitsCount === 0 ? 'If you missed adding any visit for the day' : undefined) :
                        'By adding patients and visits you\'ll be able to see a summary of the visits for the day'
                }
                </StyledText>
                <EmptyStateButton
                    onPress={props.onPressAddVisit}
                >
                    Add Visits
                </EmptyStateButton>
            </View>
        );
    }
    return;
}

export function VisitSection(props) {
    return (
        <View style={{flex: 1, marginVertical: 20}}>
            {visitSummary(props)}
            {cardArea(props)}
        </View>
    );
}
