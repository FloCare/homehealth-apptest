import React from 'react';
import {View, TouchableWithoutFeedback, TouchableHighlight, Text, Image, Dimensions} from 'react-native';
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

const shadowStyle = {
    shadowRadius: 5,
    shadowColor: 'rgba(0, 0, 0, 0.17)',
    shadowOffset: {
        width: -0.1,
        height: 1.5
    },
    shadowOpacity: 1,
};

function navigationButtons(props) {
    return (<View
        style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            height: 35,
            elevation: 15,
            position: 'relative',
            top: -20,
            paddingHorizontal: 50,
            ...shadowStyle
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

    let whiteBoxContents;

    if (props.dateMinusToday === 0) {
        whiteBoxContents = [
            cellGenerator(props.totalVisitsCount, 'Total Visits'),
            vertLine,
            cellGenerator(props.totalVisitsCount - props.remainingVisitsCount, 'Completed'),
            vertLine,
            cellGenerator(props.remainingVisitsCount, 'Remaining'),
        ];
    } else if (props.dateMinusToday > 0) {
        whiteBoxContents = [
            <StyledText
                style={{
                    fontWeight: '300',
                    fontSize: 20,
                    color: 'grey',
                    // paddingHorizontal: 20,
                    textAlign: 'center',
                    marginTop: 10
                }}
            >{`${props.remainingVisitsCount} Visits Planned`}</StyledText>,
        ];
    } else {
        whiteBoxContents = [
            <StyledText
                style={{
                    fontWeight: '300',
                    fontSize: 20,
                    color: 'grey',
                    // paddingHorizontal: 20,
                    textAlign: 'center',
                    marginTop: 10
                }}
            >{`${props.remainingVisitsCount} of ${props.totalVisitsCount} planned visits unfinished`}</StyledText>,
        ];
    }

    if (props.remainingVisitsCount === 0) {
        whiteBoxContents = [
            <StyledText
                style={{
                    fontWeight: '300',
                    fontSize: 20,
                    color: 'grey',
                    // paddingHorizontal: 20,
                    textAlign: 'center',
                    // marginVertical: 10
                }}
            >{props.totalVisitsCount !== 0 ? (props.dateMinusToday < 0 ? `All planned visits completed. Awesome!` : 'Great job! All planned visits completed'): (props.dateMinusToday < 0 ? "You didn't have any visits" : 'No Visit Summary')}</StyledText>,
        ];
    }

    const whiteBox =
        (<View
            style={{
                flexDirection: props.remainingVisitsCount !== 0 ? 'row' : 'column',
                height: Dimensions.get('window').height * 0.18,
                ...styles.cardContainerStyle,
                justifyContent: 'space-evenly',
                // alignItems: 'center',
                shadowRadius: 3,
                paddingHorizontal: 22,
                paddingVertical: 25,
            }}
        >
            {whiteBoxContents}
        </View>);

    return (
        <View
            style={{
                flex: 1,
                height: Dimensions.get('window').height * 0.22,
                borderRadius: 5,
                marginHorizontal: 20,
            }}
        >
            {whiteBox}
            {props.showVisitListButtons ? navigationButtons(props) : undefined}
        </View>
    );
}

function cardArea(props) {
    if (props.dateMinusToday === 0 && props.remainingVisitsCount > 0) {
        const showDetailedMilesView = true;
        const VisitCard = VisitCardGenerator({
            onDoneTogglePress: (visitID) => VisitService.getInstance().toggleVisitDone(visitID),
            navigator: props.navigator
        }, false, false, showDetailedMilesView);

        return (<View style={{alignItems: 'center'}}>
            <StyledText style={{fontSize: 12, color: '#999999', marginVertical: 5}}>
                Next Visit
            </StyledText>
            <TouchableHighlight underlayColor={'clear'} onPress={() => onPressCard(props.visitID, props.navigator)}>
                <VisitCard
                    data={props.visitID}
                    cardStyle={shadowStyle}
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
                        color: props.totalVisitsCount !== 0 && props.remainingVisitsCount !== 0 ? 'transparent' : 'grey'
                    }}
                >{
                    props.totalVisitsCount !== 0 ?
                        (props.remainingVisitsCount === 0 ? 'If you missed adding any visit for the day' : 'dummy placeholder') :
                        'Get started by adding visits'
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
        <View style={{marginVertical: 20}}>
            {visitSummary({...props, showVisitListButtons: props.totalVisitsCount !== 0})}
            {cardArea(props)}
        </View>
    );
}
