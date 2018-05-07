import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-elements';

function VisitRow() {
    return (({index, data}) => 
        // console.log(data);
         (
            <View style={{flexDirection: 'row', marginLeft: 20, marginRight: 20, marginTop: 7.5, marginBotton: 7.5}}>
                <View
                    style={{
                        alignContent: 'center',
                        justifyContent: 'center',
                        width: 28,
                        height: 28,
                        borderRadius: 14,
                        borderWidth: 1.5,
                        borderColor: 'white',
                    }}
                >
                    {/*//TODO remove this hack*/}
                    <Text style={{color: 'white', alignSelf: 'center', alignItems: 'center'}}>{`${String.fromCharCode('A'.charCodeAt(0) + index)}`}</Text>
                </View>
                <View style={{flex: 1, flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.35)', marginLeft: 10, alignItems: 'center'}}>
                    <View style={{flex: 1, margin: 10, justifyContent: 'space-between'}}>
                        <View style={{height: 1, borderColor: 'white', borderWidth: 1}} />
                        <View style={{height: 2}} />
                        <View style={{height: 1, borderColor: 'white', borderWidth: 1}} />
                    </View>
                    <Text style={{flex: 20, paddingLeft: 5, color: 'white', fontSize: 14}}>{data.getAssociatedName()}</Text>
                </View>
            </View>
        ));
}

export {VisitRow};
