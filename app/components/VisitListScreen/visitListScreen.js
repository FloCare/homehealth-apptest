import {View} from 'react-native';
import React from 'react';
import {VisitCardGenerator} from '../common/visitCardGenerator';
import {SortedVisitListContainer} from '../common/SortedVisitListContainer';
import {SimpleButton} from '../common/SimpleButton';
import StyledText from '../common/StyledText';

function VisitListScreen(props) {
    return (
        <View style={{flex: 1, backgroundColor: '#f8f8f8'}}>
            {/*{RenderIf(props.calendarComponent, props.showCalendar)}*/}
            {/*<VisitListContainer visitResultObject={props.visitResultObject} />*/}
            {
                props.showError &&
                <View style={{backgroundColor: '#FFF78A', marginTop: 10, marginBottom: 5}}>
                    <StyledText style={{fontSize: 12, color: '#F51414', alignSelf: 'center', margin: 5}}>
                        *Please check the order of the visits
                    </StyledText>
                </View>
            }

            <SortedVisitListContainer
                navigator={props.navigator}
                style={{flex: 1, marginLeft: 5}}
                orderedVisitID={props.orderedVisitID}
                renderFunctionGenerator={VisitCardGenerator}
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
