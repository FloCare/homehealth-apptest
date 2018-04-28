import React from 'react';
import {Badge, Icon, Text} from 'react-native-elements';
import {TouchableHighlight, View} from 'react-native';
import componentStyles from './styles';


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
            containerStyle={[componentStyles.badgeContainerStyle, {margin: 4}]}
            children={
                <View style={{flexDirection: 'row'}}>
                    <Text style={[componentStyles.badgeTextStyle, {margin: 4}]}> {props.text} </Text>
                    {removeButton(props.onPress)}
                </View>
            }
        />
    );
}

export {Tag};
