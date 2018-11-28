import {View} from 'react-native';
import React from 'react';
import {VisitCardGenerator} from '../common/visitCardGenerator';
import {SortedVisitListContainer} from '../common/SortedVisitListContainer';
import {SimpleButton} from '../common/SimpleButton';
import StyledText from '../common/StyledText';
import {ErrorMessageColor} from '../../utils/constants';

function VisitListScreen(props) {
    return (
        <View style={{flex: 1, backgroundColor: '#f8f8f8'}}>
            {/*{RenderIf(props.calendarComponent, props.showCalendar)}*/}
            {/*<VisitListContainer visitResultObject={props.visitResultObject} />*/}
            {
                props.showError &&
                <View style={{backgroundColor: '#FFF78A', marginTop: 10}}>
                    <StyledText style={{fontSize: 12, color: ErrorMessageColor, textAlign: 'center', margin: 5}}>
                        *Visit-time order is inconsistent. Please check the order or time(s).
                    </StyledText>
                </View>
            }

            <View style={{marginTop: 10, marginBottom: 5, flexDirection: 'row', alignSelf: 'center'}}>
                <StyledText style={{fontSize: 12, color: '#999999', alignSelf: 'center', margin: 5}}>
                    Total Remaining Distance :
                </StyledText>
                <StyledText style={{fontSize: 14, color: '#222222', alignSelf: 'center'}}>
                    {props.remainingDistance ? props.remainingDistance : ' -- '}
                </StyledText>
            </View>

            <SortedVisitListContainer
                navigator={props.navigator}
                style={{flex: 1, marginLeft: 5}}
                orderedVisitID={props.orderedVisitID}
                renderFunctionGenerator={VisitCardGenerator}
                tapForDetails
                keyboardShouldPersistTaps
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
