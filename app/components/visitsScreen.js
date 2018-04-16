import {View} from 'react-native';
import {Button} from 'react-native-elements';
import React from 'react';
import {VisitList} from './visitList';

function VisitScreen(props) {
    return (
        <View style={{flex: 1}}>
            <Button large title='Add Visit' onPress={props.addVisit} containerViewStyle={{flex: 1}} />
            <View>
                <VisitList visitItems={props.visitItems} onCheck={props.onCheck} />
            </View>
        </View>
        );
}

export {VisitScreen};
