import React from 'react';
import {Image, TouchableWithoutFeedback, View, Platform} from 'react-native';
import {VisitSummary} from './VisitSummary';
import EmptyStateButton from '../common/EmptyStateButton';
import {CalendarStripStyled} from '../common/CalendarStripStyled';
import StyledText from '../common/StyledText';
import {Images} from '../../Images';

function getComponentToDisplayBasedOnVisitCount(props) {
    if (props.remainingVisitsCount === 0) {
        //TODO pull it out, make it common
        const visitListButtons = (
            <View style={{paddingTop: 10}}>
                <StyledText
                    style={{
                        alignSelf: 'center',
                        fontSize: 12,
                        color: '#999999'
                    }}
                >
                    View visits on
                </StyledText>
                <View
                    style={{
                        // flex: 1,
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
        );

        return (
            <View
                style={{
                    flex: 4,
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <StyledText
                    style={{
                        fontWeight: '300',
                        fontSize: 20,
                        color: 'grey',
                        paddingHorizontal: 20,
                        textAlign: 'center'
                    }}
                >{props.totalVisitsCount !== 0 ? 'Great job! All planned visits completed' : 'No Day\'s Summary'}</StyledText>
                {props.totalVisitsCount !== 0 ? visitListButtons : null}
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
                        'If you missed adding any visit for the day' :
                        'By adding patients and visits you\'ll be able to see a summary of the visits for the day'
                }
                </StyledText>
                <EmptyStateButton
                    onPress={props.onPressAddVisitZeroState}
                >
                    Add Visits
                </EmptyStateButton>
            </View>

        );
    }

    return (
        <View style={{flex: 4, marginTop: -3}}>
            <VisitSummary
                visitID={props.visitID}
                navigator={props.navigator}
                date={props.date}
                totalVisitsCount={props.totalVisitsCount}
                remainingVisitsCount={props.remainingVisitsCount}
                navigateToVisitListScreen={props.navigateToVisitListScreen}
                navigateToVisitMapScreen={props.navigateToVisitMapScreen}
                onOrderChange={props.onOrderChange}
                onPressAddVisit={props.onPressAddVisit}
            />
        </View>
    );
}

function HomeScreen(props) {
    return (
        //TODO insert other stuff thats got to be on the home screen too
        <View style={{flex: 1}}>
            <CalendarStripStyled
                dateRowAtBottom
                showMonth
                paddingTop={Platform.select({ios: 30, android: 20})}
                date={props.date}
                noRounding={props.remainingVisitsCount === 0}
                onDateSelected={props.onDateSelected}
            />
            {getComponentToDisplayBasedOnVisitCount(props)}
            <View style={{flex: 0.85}} />
        </View>
    );
}

export {HomeScreen};
