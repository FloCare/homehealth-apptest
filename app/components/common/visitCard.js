import {Card, Divider, Button, Badge, Text} from 'react-native-elements';
import {View, FlatList} from 'react-native';
import {CustomCheckBox} from './CustomCheckBox'
import React from 'react';
import componentStyles from "./styles";

function VisitCard({patientName, diagnosis, address, isDone, onCheck, onCall, onNavigate}) {
    console.log(`card render ${patientName}called at ${Date.now()}`);
    return (
        <Card containerStyle={componentStyles.cardContainerStyle}>
            <View style={{backgroundColor: '#ffffff'}}>
                <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 1}}>
                        <Text style={componentStyles.nameStyle}>{patientName}</Text>
                        <Text style={componentStyles.addressStyle}>{address}</Text>
                    </View>
                    <CustomCheckBox
                        checked={!isDone}
                        onPress={onCheck}
                    />
                </View>
                <FlatList
                    horizontal
                    style={componentStyles.listContainer}
                    data={diagnosis}
                    renderItem={({item}) =>
                        <Badge
                            containerStyle={componentStyles.badgeContainerStyle}
                            textStyle={componentStyles.badgeTextStyle}
                            value={item}/>
                    }
                />
                <Divider style={{marginBottom: 4, height: 1.5, backgroundColor: "#dddddd"}}/>
                <View style={{flexDirection: 'row', flex: 1, justifyContent: 'space-around', margin: 0, padding: 0}}>
                    <Button
                        icon={
                            {
                                name: 'phone',
                                size: 18,
                                color: '#45ceb1'
                            }
                        }
                        onPress={onCall}
                        title='CALL'
                        textStyle={{fontSize: 14, color: "#222222"}}
                        buttonStyle={{backgroundColor: "transparent"}}
                    />
                    <Divider style={{width: 1.5, height: '60%', marginTop: 8, backgroundColor: "#dddddd"}}/>
                    <Button
                        icon={
                            {
                                name: 'phone',
                                size: 18,
                                color: '#45ceb1'
                            }
                        }
                        onPress={onNavigate}
                        title='NAVIGATE'
                        textStyle={{fontSize: 14, color: "#222222"}}
                        buttonStyle={{backgroundColor: "transparent"}}
                    />
                </View>
            </View>
        </Card>);
}

export {VisitCard};
