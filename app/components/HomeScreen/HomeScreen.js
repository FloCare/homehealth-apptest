import React from 'react';
import CalendarStrip from 'react-native-calendar-strip';
import {View} from 'react-native';
import moment from 'moment';
import {VisitSummary} from './VisitSummary';
import {Button, Text} from 'react-native-elements';
import EmptyStateButton from '../common/EmptyStateButton';
import {CalendarStripStyled} from '../common/CalendarStripStyled';

function getComponentToDisplayBasedOnVisitCount(props) {
    if (props.remainingVisitsCount === 0) {
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
                >No Day's Summary</Text>
                <Text
                    style={{
                        textAlign: 'center',
                        padding: 0,
                        margin: 20,
                        marginTop: 5,
                    }}
                >
                    By adding patients and visits you'll be able to see a summary of the visits for the day
                </Text>
                <EmptyStateButton
                    onPress={props.onPressAddVisit}
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
                // dateRowAtBottom
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
