import React from 'react';
import {View} from 'react-native';
import {VisitSection} from './VisitSection';
import {TaskSection} from './TaskSection';

function HomeScreen(props) {
    return (
        //TODO insert other stuff thats got to be on the home screen too
        <View style={{flex: 1}}>
            <VisitSection
                visitID={props.visitID}
                navigator={props.navigator}
                dateMinusToday={props.dateMinusToday}
                date={props.date}
                totalVisitsCount={props.totalVisitsCount}
                remainingVisitsCount={props.remainingVisitsCount}
                navigateToVisitListScreen={props.navigateToVisitListScreen}
                navigateToVisitMapScreen={props.navigateToVisitMapScreen}
                onPressAddVisit={props.onPressAddVisitZeroState}
            />
            <View
                style={{height: 1, backgroundColor: '#e6e6e6'}}
            />
            <TaskSection
                navigator={props.navigator}
                midnightEpoch={props.date.valueOf()}
                dateMinusToday={props.dateMinusToday}
            />
        </View>
    );
}

export {HomeScreen};
