import {View} from 'react-native';
import {Button} from 'react-native-elements';
import React from 'react';
import {VisitListContainer} from '../common/VisitList/visitListContainer';
import {RenderIf} from '../../utils/data/syntacticHelpers';

function VisitScreen(props) {
    return (
        <View style={{flex: 1}}>
            {RenderIf(props.calendarObject, props.showCalendar)}
            <VisitListContainer visitResultObject={props.visitResultObject} />
            <Button large title='ADD VISIT' onPress={props.addVisit} />
        </View>
        );
}

export {VisitScreen};
