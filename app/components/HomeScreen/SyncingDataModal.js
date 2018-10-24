import React, {Component} from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import {styles} from './styles';

export default class SyncingDataModal extends Component {

    render() {
        return (
            <View style={{alignItems: 'center'}}>
                <View style={{padding: 10, paddingTop: 20, paddingBottom: 20, backgroundColor: 'white', borderRadius: 5}}>
                    <ActivityIndicator size='small' color="black" />
                    <Text style={{...styles.textStyle, marginTop: 10, color: 'black'}}>
                        Syncing Data From Server
                    </Text>
                </View>
            </View>
        );
    }

}
