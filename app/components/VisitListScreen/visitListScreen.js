import {View} from 'react-native';
import {Button} from 'react-native-elements';
import React from 'react';
import {VisitCard} from '../common/visitCard';
import {SortedVisitListContainer} from '../common/SortedVisitListContainer';
import {PrimaryColor} from '../../utils/constants';

function VisitListScreen(props) {
    return (
        <View style={{flex: 1, backgroundColor: '#f8f8f8'}}>
            {/*{RenderIf(props.calendarComponent, props.showCalendar)}*/}
            {/*<VisitListContainer visitResultObject={props.visitResultObject} />*/}
            <SortedVisitListContainer
                navigator={props.navigator}
                style={{flex: 1, marginTop: 10}}
                date={props.date}
                renderWithCallback={VisitCard}
                tapForDetails
                onOrderChange={props.onOrderChange}
            />
            <Button
                large
                title='ADD VISIT'
                onPress={props.onAddVisitPress}
                containerViewStyle={{flexDirection: 'row', marginLeft: 0, marginRight: 0}}
                buttonStyle={{flex: 1}}
                backgroundColor={PrimaryColor}
            />
        </View>
        );
}

export {VisitListScreen};
