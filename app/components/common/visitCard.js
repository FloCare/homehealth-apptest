import React from 'react';
import {Card, Divider, Button, Text} from 'react-native-elements';
import {View, FlatList} from 'react-native';
import {CustomCheckBox} from './CustomCheckBox';
import componentStyles from './styles';
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
                <Card containerStyle={componentStyles.cardContainerStyle}>
                    <View style={{flexDirection: 'row'}}>
                        <View style={{flex: 1}}>
                            <Text style={componentStyles.nameStyle}>{visit.getAssociatedName()}</Text>
                            <Text style={componentStyles.addressStyle}>{'dummy'}</Text>
                        </View>
                        <CustomCheckBox
                            checked={visit.isDone}
                            onPress={onSelectionToggle}
                        />
                    </View>
                    <FlatList
                        horizontal
                        style={componentStyles.listContainer}
                        data={visit.getDiagnosis()}
                        renderItem={({item}) =>
                            <Tag text={item} />
                        }
                        keyExtractor={(item) => item}
                    />
                    <Divider style={{marginBottom: 4, height: 1.5, backgroundColor: '#dddddd'}} />
                    <View style={{flexDirection: 'row', flex: 1, justifyContent: 'space-around', margin: 0, padding: 0}}>
                        <Button
                            icon={{
                                name: 'phone',
                                size: 18,
                                color: '#45ceb1'
                            }}
                            // onPress={this.props.onCall}
                            title='CALL'
                            textStyle={{fontSize: 14, color: '#222222'}}
                            buttonStyle={{backgroundColor: 'transparent'}}
                        />
                        <Divider style={{width: 1.5, height: '60%', marginTop: 8, backgroundColor: '#dddddd'}} />
                        <Button
                            icon={{
                                name: 'phone',
                                size: 18,
                                color: '#45ceb1'
                            }}
                            // onPress={this.props.onNavigate}
                            title='NAVIGATE'
                            textStyle={{fontSize: 14, color: '#222222'}}
                            buttonStyle={{backgroundColor: 'transparent'}}
                        />
                    </View>
                </Card>
            );
        });
}

export {VisitCard};
