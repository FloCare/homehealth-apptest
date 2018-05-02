import React from 'react';
import CalendarStrip from 'react-native-calendar-strip';
import {View} from 'react-native';
import moment from 'moment';
import {VisitSummary} from './VisitSummary';
import {Button, Text} from 'react-native-elements';
import EmptyStateButton from '../common/EmptyStateButton';

function getComponentToDisplayBasedOnVisitCount(props) {
    if (props.remainingVisitsCount === 0) {
        return (
            <View
                style={{
                    flex: 1,
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
                <Text style={{
                    textAlign: 'center',
                    padding: 0,
                    margin: 20,
                    marginTop: 5,
                }}>
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
        <View style={{paddingBottom: 100, flex: 1}}>
            <VisitSummary
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
    // console.log('home screen rerendered');
    return (
        //TODO insert other stuff thats got to be on the home screen too
        <View style={{flex: 1}}>
            <CalendarStrip
                style={{height: 100, paddingTop: 20, paddingBottom: 10}}
                calendarHeaderStyle={{fontWeight: 'bold', fontSize: 24}}
                // highlightDateNumberStyle={{fontWeight: '800'}}
                onDateSelected={props.onDateSelected}
                selectedDate={props.date}
                styleWeekend={false}
                calendarHeaderFormat='MMMM'
                customDatesStyles={[
                    {
                        startDate: props.date.valueOf(),
                        dateContainerStyle: {backgroundColor: '#45ceb1', borderRadius: 0},
                        dateNameStyle: {color: 'white'},
                        dateNumberStyle: {color: 'white'},
                    },
                    {
                        startDate: moment().utc().startOf('day').valueOf(),
                        dateNameStyle: {color: '#45ceb1'},
                        dateNumberStyle: {color: '#45ceb1'},
                    }
                ]}
            />
            {getComponentToDisplayBasedOnVisitCount(props)}
        </View>
    );
}

export {HomeScreen};
