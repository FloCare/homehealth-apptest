import React from 'react';
import {Badge, Icon, Text} from 'react-native-elements';
import {TouchableHighlight, View} from 'react-native';
import componentStyles from './styles';


function removeButton(onPress) {
    if (onPress) {
        return (
            <TouchableHighlight onPress={onPress}>
                <Icon name='rowing' />
            </TouchableHighlight>
        );
    } 
    return undefined;
}

function Tag(props) {
    return (
        <Badge
            containerStyle={componentStyles.badgeContainerStyle}
            children={
                <View style={{flexDirection: 'row'}}>
                    <Text style={componentStyles.badgeTextStyle}> {props.text} </Text>
                    {removeButton(props.onPress)}
                </View>
            }
        />
    );
}

export {Tag};
