import React from 'react';
import {View, Text} from 'react-native';

function CustomCallout(props) {
    const {address} = props;
    return (
        <View 
            style={{
                height: 30,
                width: 150
            }}
        >
            <Text
                numberOfLines={2}
                style={{
                    fontSize: 12
                }}
            >
                {address}
            </Text>
        </View>
    );
}

export {CustomCallout};
