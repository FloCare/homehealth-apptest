import React from 'react';
import {View} from 'react-native';
import {Icon, Text} from 'react-native-elements';

function VisitRow({index, data}) {
    return (
        <View style={{flexDirection: 'row'}}>
            <Text>{String.fromCharCode('A'.charCodeAt(0) + index)}</Text>
            <View style={{flexDirection: 'row'}}>
                <Icon name={'menu'} />
                <Text>{data.data}</Text>
                {/*<Text>BCD</Text>*/}
            </View>
        </View>
    );
}

export {VisitRow};
