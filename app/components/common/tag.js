import React from 'react';
import {Badge, Icon, Text} from 'react-native-elements';
import {Image, TouchableHighlight, View} from 'react-native';
import {styles} from './styles';

//TODO: underlayColor not working
function removeButton(onPress) {
    if (onPress) {
        return (
            <TouchableHighlight style={{alignSelf: 'center', underlayColor: 'white'}} onPress={onPress}>
                <Image source={require('../../../resources/close.png')} />
            </TouchableHighlight>
        );
    } 
    return undefined;
}

function Tag(props) {
    return (
        <Badge
            containerStyle={[styles.badgeContainerStyle, {margin: 4, padding: 2}, props.badgeContainerStyle]}
            children={
                <View style={{flexDirection: 'row'}}>
                    <Text style={[styles.badgeTextStyle, {margin: 4}, props.badgeTextStyle]}> {props.text} </Text>
                    {removeButton(props.onPress)}
                </View>
            }
        />
    );
}

export {Tag};
