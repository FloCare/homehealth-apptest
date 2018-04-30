import React from 'react';
import {View} from 'react-native';
import {Icon, Text} from 'react-native-elements';

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
                    <Text style={{color: 'white'}}>{`  ${String.fromCharCode('A'.charCodeAt(0) + index)}`}</Text>
                </View>
                <View style={{flex: 1, backgroundColor: 'rgba(255,255,255,0.4)', marginLeft: 10, paddingLeft: 15, alignContent: 'center'}}>
                    {/*<Icon name={'menu'} />*/}
                    <Text style={{color: 'white', opacity: 1}}>{data.getAssociatedName()}</Text>
                </View>
            </View>
        ));
}

export {VisitRow};
