import React from 'react';
import {Badge, Icon, Text} from 'react-native-elements';
import {TouchableHighlight, View} from 'react-native';
import {styles} from './styles';


function removeButton(onPress) {
    if (onPress) {
        return (
            <TouchableHighlight onPress={onPress}>
                <Icon name='close' />
            </TouchableHighlight>
        );
    } 
    return undefined;
}

function Tag(props) {
    return (
        <Badge
            containerStyle={[styles.badgeContainerStyle, {margin: 4}]}
            children={
                <View style={{flexDirection: 'row'}}>
                    <Text style={[styles.badgeTextStyle, {margin: 4}]}> {props.text} </Text>
                    {removeButton(props.onPress)}
                </View>
            }
        />
    );
}

export {Tag};
