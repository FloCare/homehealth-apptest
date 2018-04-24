import React from 'react';
import {View} from 'react-native';
import {Icon, Text} from 'react-native-elements';

function VisitRow(props) {
    return (
        <View style={{flexDirection: 'row'}}>
            <Text>A</Text>
            <View style={{flexDirection: 'row'}}>
                <Icon name={'menu'} />
                <Text>{props.text}</Text>
            </View>
        </View>
    );
}

export {VisitRow};
