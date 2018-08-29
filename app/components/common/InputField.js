import {View, Dimensions, TextInput} from 'react-native';
import React, {Component} from 'react';
import StyledText from './StyledText';

export class InputField extends Component {
    render() {
        return (
            <View
                style={{width: Dimensions.get('window').width * 0.7, marginVertical: 10}}
            >
                <StyledText
                    style={{color: 'white', textAlign: 'left', ...this.props.titleStyle}}
                >
                    {this.props.title}
                </StyledText>
                <TextInput
                    keyboardType={this.props.keyboardType}
                    value={this.props.value}
                    autoFocus={this.props.autoFocus}
                    editable={this.props.editable}
                    placeholder={this.props.placeholder}
                    fontSize={this.props.fontSize}
                    secureTextEntry={this.props.secureTextEntry}
                    onChangeText={this.props.onChangeText}
                    onSubmitEditing={this.props.onSubmitEditing}

                    autoCapitalize={'none'}
                    selectionColor={this.props.selectionColor || 'rgba(255,255,255,0.5)'}
                    underlineColorAndroid={'white'}
                    autoCorrect={false}
                    style={{color: 'white', ...this.props.style}}
                    placeholderTextColor={this.props.placeholderTextColor || 'rgba(255,255,255,0.35)'}
                />
            </View>
        );
    }
}

