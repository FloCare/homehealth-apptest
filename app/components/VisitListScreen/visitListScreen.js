import {View} from 'react-native';
import {Button} from 'react-native-elements';
import React from 'react';
import {RenderIf} from '../../utils/data/syntacticHelpers';
import {VisitCard} from '../common/visitCard';
import {SortedVisitListContainer} from '../common/SortedVisitListContainer';

function VisitListScreen(props) {
    return (
        <View style={{flex: 1}}>
            {RenderIf(props.calendarComponent, props.showCalendar)}
            {/*<VisitListContainer visitResultObject={props.visitResultObject} />*/}
            <SortedVisitListContainer
                date={props.date}
                renderWithCallback={VisitCard}
                onOrderChange={props.onOrderChange}
            />
            <Button large title='ADD VISIT' onPress={props.onAddVisitPress} />
        </View>
        );
}

export {VisitListScreen};
