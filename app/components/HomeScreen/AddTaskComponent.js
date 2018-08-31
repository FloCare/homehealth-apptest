import React, {Component} from 'react';
import {Dimensions, KeyboardAvoidingView, TextInput} from 'react-native';
import {SimpleButton} from '../common/SimpleButton';
import {PrimaryColor} from '../../utils/constants';

export class AddTaskComponent extends Component {
    render() {
        return (
            <KeyboardAvoidingView
                style={{
                    width: Dimensions.get('window').width * 0.85,
                    top: -30,
                    backgroundColor: '#eeeeee',
                    borderRadius: 10,
                }}
            >
                <TextInput
                    autoFocus
                    style={{marginLeft: 20, marginTop: 25}}
                    onChangeText={text => { this.text = text; }}
                    placeholder={'Enter task here'}
                    placeholderTextColor={'rgba(0,0,0,0.35)'}
                    onSubmitEditing={() => this.props.onSubmit(this.text)}
                />
                <SimpleButton
                    onPress={() => this.props.onSubmit(this.text)}
                    title={'Save'}
                    textStyle={{color: PrimaryColor}}
                    style={{backgroundColor: '#eeeeee', marginVertical: 20}}
                />
            </KeyboardAvoidingView>
        );
    }
}
