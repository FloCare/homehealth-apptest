import React from 'react';
import CalendarStrip from 'react-native-calendar-strip';
import {View} from 'react-native';
import {VisitSummary} from './VisitSummary';

function HomeScreen(props) {
    return (
        //TODO insert other stuff thats got to be on the home screen too
        <View style={{flex: 1}}>
            <CalendarStrip
                style={{height: 100, paddingTop: 20, paddingBottom: 10}}
            />
            <VisitSummary
                visitResultObject={props.visitResultObject}
                navigateToVisitListScreen={props.navigateToVisitListScreen}
                navigateToVisitMapScreen={props.navigateToVisitMapScreen}
            />
        </View>
    );
}

export {HomeScreen};
