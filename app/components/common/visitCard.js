import React from 'react';
import {Card, Divider, Button, Text} from 'react-native-elements';
import {View, FlatList} from 'react-native';
import {CustomCheckBox} from './CustomCheckBox';
import componentStyles from './styles';
import {Tag} from './tag';

class VisitCard extends React.PureComponent {

    onSelectionToggle = () => {
        this.props.onCheck(this.props.id);
    }

    render() {
        console.log(`card render ${this.props.patientName}called at ${Date.now()}`);
        return (
            <Card containerStyle={componentStyles.cardContainerStyle}>
                <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 1}}>
                        <Text style={componentStyles.nameStyle}>{this.props.patientName}</Text>
                        <Text style={componentStyles.addressStyle}>{this.props.address}</Text>
                    </View>
                    <CustomCheckBox
                        checked={this.props.isDone}
                        onPress={this.onSelectionToggle}
                    />
                </View>
                <FlatList
                    horizontal
                    style={componentStyles.listContainer}
                    data={this.props.diagnosis}
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
                        onPress={this.props.onCall}
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
                        onPress={this.props.onNavigate}
                        title='NAVIGATE'
                        textStyle={{fontSize: 14, color: '#222222'}}
                        buttonStyle={{backgroundColor: 'transparent'}}
                    />
                </View>
            </Card>
        );
    }
}

export {VisitCard};
