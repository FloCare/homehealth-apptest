import {View} from 'react-native';
import {Button} from 'react-native-elements';
import React from 'react';
import {VisitList} from './visitList';

function VisitScreen(props) {
    return (
        <View>
            <View>
                <VisitList visitItems={props.visitItems} onCheck={props.onCheck} />
            </View>
            <Button large title='Add Visit' onPress={props.addVisit} />
        </View>
        );
}

export {VisitScreen};
