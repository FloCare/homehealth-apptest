import React from 'react';
import {View} from 'react-native';
import {Tag} from './tag';

function Diagnosis(props) {
    if (props.diagnosis && props.diagnosis.length > 0) {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                }}
            >
                {
                    props.diagnosis.map((item) =>
                    <Tag
                        text={item}
                        badgeContainerStyle={{padding: 0, marginLeft: 0}}
                        badgeTextStyle={{margin: 0, marginRight: 4, marginLeft: 4}}
                    />)
                }
            </View>
        );
    }
    return (
        <View style={{height: 16}} />
    );
}

export {Diagnosis};
