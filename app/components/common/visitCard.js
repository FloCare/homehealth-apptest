import React from 'react';
import {Card, Divider, Button, Text} from 'react-native-elements';
import {View, FlatList, TouchableHighlight, Image, Linking} from 'react-native';
import {CustomCheckBox} from './CustomCheckBox';
import {styles} from './styles';
import {Tag} from './tag';
import {Visit} from '../../utils/data/schema';

function VisitCard({isDoneToggle}) {
    //
    // render() {
    //     console.log(`card render ${this.props.patientName}called at ${Date.now()}`);
        return (({data}) => {
            const visit = data;
            const onSelectionToggle = () => {
                if (isDoneToggle) { isDoneToggle(visit); }
            };
            // console.log(visit);
            // console.log('rerendered visitcard');
            return (
                <Card containerStyle={styles.cardContainerStyle}>
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
                    <FlatList
                        horizontal
                        style={styles.listContainer}
                        data={visit.getDiagnosis()}
                        renderItem={({item}) =>
                            <Tag text={item} />
                        }
                        keyExtractor={(item) => item}
                    />
                    <Divider style={{marginBottom: 4, height: 1.5, backgroundColor: '#dddddd'}} />
                    <View style={{flexDirection: 'row', flex: 1, justifyContent: 'space-around', margin: 0, padding: 0}}>
                        <TouchableHighlight
                            underlayColor={'white'}
                            style={{flex: 1, padding: 5}}
                            onPress={() => { console.log('hello'); }}//this.props.onCall}
                        >
                            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                                <Image source={require('../../../resources/call.png')} />
                                <Text
                                    style={{fontSize: 14, color: '#222222'}}
                                >{'  CALL'}</Text>
                            </View>
                        </TouchableHighlight>
                        <Divider style={{width: 1.5, height: '60%', marginTop: 8, backgroundColor: '#dddddd'}} />
                        <TouchableHighlight
                            underlayColor={'white'}
                            style={{flex: 1, padding: 5}}
                            onPress={() => { Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${visit.getAddress().getCommaSeperatedCoordinates()}`).catch(err => console.error('An error occurred', err)); }}
                        >
                            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                                <Image source={require('../../../resources/navigate.png')} />
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
