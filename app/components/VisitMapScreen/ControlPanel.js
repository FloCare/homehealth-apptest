import React from 'react';
import {View} from 'react-native';

import {PrimaryColor} from '../../utils/constants';
import {VisitMapRowGenerator} from './VisitMapRowGenerator';
import {SortedVisitListContainer} from '../common/SortedVisitListContainer';
import StyledText from '../common/StyledText';

export function ControlPanel(props) {
    // console.log('control panel props');
    // console.log(props.orderedVisitID.length);
    if (props.orderedVisitID.length > 0) {
        return (
            <View style={{backgroundColor: PrimaryColor, paddingTop: 10, paddingBottom: 10}}>
                <SortedVisitListContainer
                    renderFunctionGenerator={VisitMapRowGenerator}
                    orderedVisitID={props.orderedVisitID}
                    scrollEnabled={false}
                    onOrderChange={props.onOrderChange}
                />
            </View>
        ); 
    }

    return (
        <View style={{backgroundColor: PrimaryColor, paddingTop: 10, paddingBottom: 10, alignItems: 'center'}}>
            <StyledText style={{color: 'white'}}>
                No Remaining Visits
            </StyledText>
        </View>
    );
}
