import {FlatList} from 'react-native'
import {VisitCard} from "./common/visitCard";
import React from "react";

function VisitList(props) {
    return (
        <FlatList
            data={props.visitItems}
            renderItem={({item, index}) =>
                <VisitCard
                    patientName={item.patientName} address={item.address}
                    diagnosis={item.diagnosis} completed={item.completed}
                    onCheck={() => props.onCheck(index)}/>
            }
        />
    )
}

export {VisitList}