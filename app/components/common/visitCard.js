import React from 'react';
import {Card, Divider, Button, Text, ListItem} from 'react-native-elements';
import {View, FlatList, TouchableHighlight, Image, Linking} from 'react-native';
import {CustomCheckBox} from './CustomCheckBox';
import {styles} from './styles';
import {Tag} from './tag';
import {Visit} from '../../utils/data/schema';
import {diagnosisList} from "../../utils/constants";

function VisitCard({isDoneToggle}) {
    this.getTags = function (visit) {
        if (visit.getDiagnosis() && visit.getDiagnosis().length > 0) {
            return (
                <View style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                }}>
                    {visit.getDiagnosis().map((item) =>
                        <Tag text={item}
                             badgeContainerStyle={{padding: 0, marginLeft: 0}}
                             badgeTextStyle={{margin: 0, marginRight: 2, marginLeft: 2}} />)}
                </View>
            );
        }
        return (
            <View style={{height: 16}}/>
        )
    }
    //
    // render() {
    //     console.log(`card render ${this.props.patientName}called at ${Date.now()}`);
    return (({data}) => {
        const visit = data;
        const onSelectionToggle = () => {
            if (isDoneToggle) {
                isDoneToggle(visit);
            }
        };
        const rightIcon = visit.isDone ? {name: 'checkbox', color: '#45ceb1'} : {name: 'box', color: '#45ceb1'};
        // console.log(visit);
        // console.log('rerendered visitcard');
        return (
            <Card containerStyle={[styles.cardContainerStyle, {marginRight: 0, paddingRight: 0}]}>
                <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 1}}>
                        <Text style={styles.nameStyle}>{visit.getAssociatedName()}</Text>
                        <Text style={styles.addressStyle}>{visit.getAddress().streetAddress}</Text>
                    </View>
                    <CustomCheckBox
                        checked={visit.isDone}
                        onPress={onSelectionToggle}
                    />
                </View>
                {this.getTags(visit)}
                <Divider style={{marginBottom: 4, marginRight: 15, height: 1.5, backgroundColor: '#dddddd'}}/>
                <View style={{flexDirection: 'row', flex: 1, justifyContent: 'space-around', margin: 0, padding: 0}}>
                    <TouchableHighlight
                        underlayColor={'white'}
                        style={{flex: 1, padding: 5}}
                        onPress={() => {
                            console.log('hello');
                        }}//this.props.onCall}
                    >
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                            <Image source={require('../../../resources/call.png')}/>
                            <Text
                                style={{fontSize: 14, color: '#222222'}}
                            >{'  CALL'}</Text>
                        </View>
                    </TouchableHighlight>
                    <Divider style={{width: 1.5, height: '60%', marginTop: 8, backgroundColor: '#dddddd'}}/>
                    <TouchableHighlight
                        underlayColor={'white'}
                        style={{flex: 1, padding: 5}}
                        onPress={() => {
                            Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${visit.getAddress().getCommaSeperatedCoordinates()}`).catch(err => console.error('An error occurred', err));
                        }}
                    >
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                            <Image source={require('../../../resources/navigate.png')}/>
                            <Text
                                style={{fontSize: 14, color: '#222222'}}
                            >{'  NAVIGATE'}</Text>
                        </View>
                    </TouchableHighlight>
                </View>
            </Card>
        );
    });
}

export {VisitCard};
