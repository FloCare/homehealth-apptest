import React from 'react';
import CalendarStrip from 'react-native-calendar-strip';
import {Image, TouchableWithoutFeedback, View} from 'react-native';
import moment from 'moment';
import {VisitSummary} from './VisitSummary';
import {Button, Text} from 'react-native-elements';
import EmptyStateButton from '../common/EmptyStateButton';
import {CalendarStripStyled} from '../common/CalendarStripStyled';

function getComponentToDisplayBasedOnVisitCount(props) {
    if (props.remainingVisitsCount === 0) {
        //TODO pull it out, make it common
        const visitListButtons = (
            <View>
                <Text
                    style={{
                        alignSelf: 'center',
                        fontSize: 12,
                        color: '#ffffff'
                    }}
                >
                    View visits on
                </Text>
                <View
                    style={{
                        // flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        // alignSelf: 'stretch',
                    }}
                >
                    <TouchableWithoutFeedback onPress={() => props.navigateToVisitMapScreen(true)}>
                        {/*// underlayColor={primaryColor}>*/}
                        <Image
                            style={{resizeMode: 'contain'}}
                            source={require('../../../resources/map.png')}
                        />
                    </TouchableWithoutFeedback>


                    <TouchableWithoutFeedback onPress={props.navigateToVisitListScreen}>
                        <Image
                            style={{resizeMode: 'contain'}}
                            source={require('../../../resources/list.png')}
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
                <Text
                    style={{
                        fontWeight: '300',
                        fontSize: 20
                    }}
                >{props.totalVisitsCount !== 0 ? 'Great job! All planned visits complete' : 'No Day\'s Summary'}</Text>
                {props.totalVisitsCount !== 0 ? visitListButtons : null}
                <Text
                    style={{
                        textAlign: 'center',
                        padding: 0,
                        margin: 20,
                        marginTop: 5,
                    }}
                >{
                  props.totalVisitsCount !== 0 ?
                        'If you missed adding any visit for the day' :
                        'By adding patients and visits you\'ll be able to see a summary of the visits for the day'
                }
                </Text>
                <EmptyStateButton
                    onPress={props.onPressAddVisitZeroState}
                >
                    Add Visits
                </EmptyStateButton>
            </View>

        );
    }

    return (
        <View style={{flex: 4}}>
            <VisitSummary
                navigator={props.navigator}
                date={props.date}
                totalVisitsCount={props.totalVisitsCount}
                remainingVisitsCount={props.remainingVisitsCount}
                navigateToVisitListScreen={props.navigateToVisitListScreen}
                navigateToVisitMapScreen={props.navigateToVisitMapScreen}
                onOrderChange={props.onOrderChange}
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
                paddingTop={20}
                date={props.date}
                noRounding={props.remainingVisitsCount === 0}
                onDateSelected={props.onDateSelected}
            />
            {getComponentToDisplayBasedOnVisitCount(props)}
            <View style={{flex: 1}} />
        </View>
    );
}

export {HomeScreen};
