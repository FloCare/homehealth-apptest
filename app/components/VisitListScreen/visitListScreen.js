import {View} from 'react-native';
import {Button} from 'react-native-elements';
import React from 'react';
import {VisitListContainer} from '../common/VisitList/visitListContainer';
import {RenderIf} from '../../utils/data/syntacticHelpers';

function VisitListScreen(props) {
    return (
        <View style={{flex: 1}}>
            {RenderIf(props.calendarComponent, props.showCalendar)}
            <VisitListContainer visitResultObject={props.visitResultObject} />
            <Button large title='ADD VISIT' onPress={props.onAddVisitPress} />
        </View>
        );
}

export {VisitListScreen};
