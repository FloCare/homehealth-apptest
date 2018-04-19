import React from 'react';
import {FlatList} from 'react-native';
import {VisitCard} from '../visitCard';

function VisitList(props) {
    console.log(`list render called at ${Date.now()}`);
    return (
        <FlatList
            data={props.visitItems}
            renderItem={({item}) =>
                <VisitCard
                    key={item.key}
                    id={item.key}
                    patientName={item.patientName} address={item.address}
                    // diagnosis={item.diagnosis}
                    isDone={item.isDone}
                    onCheck={props.onCheck}
                />
            }
        />
    );
}

export {VisitList};
