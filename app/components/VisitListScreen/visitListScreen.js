import {View} from 'react-native';
import React from 'react';
import {VisitCard} from '../common/visitCard';
import {SortedVisitListContainer} from '../common/SortedVisitListContainer';
import {SimpleButton} from '../common/SimpleButton';

function VisitListScreen(props) {
    return (
        <View style={{flex: 1, backgroundColor: '#f8f8f8'}}>
            {/*{RenderIf(props.calendarComponent, props.showCalendar)}*/}
            {/*<VisitListContainer visitResultObject={props.visitResultObject} />*/}
            <SortedVisitListContainer
                navigator={props.navigator}
                style={{flex: 1}}
                date={props.date}
                renderWithCallback={VisitCard}
                tapForDetails
                onOrderChange={props.onOrderChange}
            />
            <SimpleButton
                title='Add Visits'
                onPress={props.onAddVisitPress}
                style={{height: 50}}
            />
        </View>
    );
}

export {VisitListScreen};
