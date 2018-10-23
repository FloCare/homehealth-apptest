import React, {Component} from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import {styles} from './styles';

export default class SyncingDataModal extends Component {

    render() {
        return (
            <View style={{margin: 10, paddingTop: 20, paddingBottom: 20, backgroundColor: 'white', borderRadius: 5, alignItems: 'center'}}>
                <ActivityIndicator size='small' color="black" />
                <Text style={{...styles.textStyle, marginTop: 10}}>
                    Syncing Data From Server
                </Text>
            </View>
        );
    }

}
