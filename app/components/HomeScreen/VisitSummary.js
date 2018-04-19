import React from 'react';
import {View} from 'react-native';
import {Button, Text} from 'react-native-elements';
import {VisitListContainer} from '../common/VisitList/visitListContainer';

export function VisitSummary(props) {
    return (
        <View style={{alignItems: 'center'}}>
            <Text>
                {'5 of 5 Visits Remaining'}
                {/*{`${props.remainingVisitCount} of ${props.totalVisitCount} Visits Remaining`}*/}
            </Text>
            <Text>
                {'Total Remaining Miles: 10'}
                {/*{`Total Remaining Miles: ${props.remainingMiles}`}*/}
            </Text>
            <Text>
                Visit Views on
            </Text>
            <View>
                <Button title={'Map'} />
                <Button title={'List'} onPress={props.navigateToVisitsScreen} />
            </View>
            <View>
                <Text> Next Visit </Text>
                <VisitListContainer visitResultObject={props.visitResultObject} onlyDisplayOne />
            </View>
        </View>
    );
}
