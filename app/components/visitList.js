import React from 'react';
import {FlatList} from 'react-native';
import {VisitCard} from './common/visitCard';

function VisitList(props) {
    return (
        <FlatList
            data={props.visitItems}
            renderItem={({item, index}) =>
                <VisitCard
                    patientName={item.patientName} address={item.address}
                    diagnosis={item.diagnosis} isDone={item.isDone}
                    onCheck={() => { console.log(index); props.onCheck(index); }}
                />
            }
        />
    );
}

export {VisitList};
