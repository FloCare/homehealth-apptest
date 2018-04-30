import React from 'react';
import CalendarStrip from 'react-native-calendar-strip';
import {View} from 'react-native';
import {VisitSummary} from './VisitSummary';
import {Visit} from '../../utils/data/schema';
import moment from 'moment';

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
                        dateContainerStyle: {borderColor: '#45ceb1', borderRadius: 0},
                    }
                ]}
            />
            {/*<SortedVisitListContainer*/}
                {/*date={props.date}*/}
                {/*singleEntry*/}
                {/*sortEnabled={false}*/}
                {/*renderWithCallback={VisitCard}*/}
                {/*onOrderChange={props.onOrderChange}*/}
            {/*/>*/}
            <VisitSummary
                date={props.date}
                totalVisitsCount={props.totalVisitsCount}
                remainingVisitsCount={props.remainingVisitsCount}
                navigateToVisitListScreen={props.navigateToVisitListScreen}
                navigateToVisitMapScreen={props.navigateToVisitMapScreen}
            />
            <View style={{height: 100}} />
            {/*<SortableList*/}
                {/*data={[2, 3, 4, 5, 6, 7]}*/}
                {/*renderRow={(item) => { console.log(`rerendered ${item}`); return <Text>{'hello'} </Text>; }}*/}
            {/*/>*/}
        </View>
    );
}

export {HomeScreen};
