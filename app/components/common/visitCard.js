import {Card, Divider, Button, Badge, Text, Icon} from 'react-native-elements';
import {View, FlatList, StyleSheet, Switch} from 'react-native';
import React from 'react';

function VisitCard({patientName, diagnosis, address, isDone, onCheck, onCall, onNavigate}) {
    return (
        <Card>
            <View style={{backgroundColor: '#ffffff'}}>
                <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 1}}>
                        <Text style={styles.nameStyle}>{patientName}</Text>
                        <Text style={styles.addressStyle}>{address}</Text>
                    </View>
                    <Switch
                        onValueChange={onCheck}
                        value={isDone}
                    />
                </View>
                <FlatList
                    horizontal
                    style={{
                        marginTop: 10,
                        marginBottom: 10,
                        marginRight: 50,
                        flexDirection: 'row',
                        flexWrap: 'wrap'
                    }}
                    data={diagnosis}
                    renderItem={({item}) => <Badge value={item} />}
                />
                <Divider style={{marginBottom: 4}} />
                <View style={{flexDirection: 'row'}}>
                    <Button
                        icon={{
                                name: 'phone',
                                size: 15,
                                color: 'blue'
                            }}
                        onPress={onCall}
                        title='CALL'
                    />
                    <Button
                        icon={{
                                name: 'phone',
                                size: 15,
                                color: 'yellow'
                            }}
                        onPress={onNavigate}
                        title='NAVIGATE'
                    />
                </View>
            </View>
        </Card>);
}

const styles = StyleSheet.create({
    // container: {
    //     flex: 1,
    //     margin: 0,
    //     padding: 0
    // },
    // listContainer: {
    //     paddingBottom: 60,
    //     marginBottom: 10,
    // },
    // inputStyle: {
    //     color: '#000',
    //     paddingRight: 5,
    //     fontSize: 18,
    //     lineHeight: 24,
    //     flex: 2,
    //     borderBottomWidth: 1,
    //     borderColor: '#ddd',
    // },
    // errorStyle: {
    //     color: '#d50000',
    //     padding: 5,
    //     fontSize: 12,
    // },
    // labelStyle: {
    //     fontSize: 14,
    //     color: "#525252",
    //     paddingBottom: 4,
    //     flex: 1
    // },
    nameStyle: {
        fontSize: 17,
        color: '#222222'
    },
    addressStyle: {
        fontSize: 12,
        color: '#666666'
    },
    // containerStyle: {
    //     flex: 1,
    //     margin: 4,
    //     marginBottom: 20,
    //     flexDirection: 'column',
    // },
    // itemStyle: {
    //     backgroundColor: '#f5f5f5',
    //     borderStyle: 'solid',
    //     borderRadius: 25,
    //     paddingRight: 10,
    //     paddingLeft: 10,
    //     margin: 5,
    //     borderWidth: 0.5,
    //     borderColor: '#cccccc'
    // },
    // buttonStyle: {
    //     padding: 0,
    //     backgroundColor: "rgb(52,218,146)",
    //     margin: 0,
    //     right: 0,
    //     left: 0
    // },
    // buttonContainer: {
    //     flex: 1,
    //     position: 'absolute',
    //     bottom: 0,
    //     padding: 0,
    //     left: 0,
    //     right: 0,
    // }
});

export {VisitCard};
