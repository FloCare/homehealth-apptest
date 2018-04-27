import React from 'react';
import CalendarStrip from 'react-native-calendar-strip';
import {Text, View} from 'react-native';
import {VisitSummary} from './VisitSummary';
import {VisitCard} from '../common/visitCard';
import {SortedVisitListContainer} from '../common/SortedVisitListContainer';
import {Visit} from '../../utils/data/schema';
import SortableList from 'react-native-sortable-list';
import {Button} from 'react-native-elements';

function HomeScreen(props) {
    return (
        //TODO insert other stuff thats got to be on the home screen too
        <View style={{flex: 1}}>
            <CalendarStrip
                style={{height: 100, paddingTop: 20, paddingBottom: 10}}
                calendarHeaderStyle={{fontWeight: 'bold', fontSize: 24}}
                // highlightDateNumberStyle={{fontWeight: '800'}}
                onDateSelected={props.onDateSelected}
                selectedDate={props.date}
            />
            <SortedVisitListContainer
                date={props.date}
                singleEntry
                sortEnabled={false}
                renderWithCallback={VisitCard}

            />
            <VisitSummary
                date={props.date}
                navigateToVisitListScreen={props.navigateToVisitListScreen}
                navigateToVisitMapScreen={props.navigateToVisitMapScreen}
            />
            {/*<SortableList*/}
                {/*data={[2, 3, 4, 5, 6, 7]}*/}
                {/*renderRow={(item) => { console.log(`rerendered ${item}`); return <Text>{'hello'} </Text>; }}*/}
            {/*/>*/}
        </View>
    );
}

export {HomeScreen};
