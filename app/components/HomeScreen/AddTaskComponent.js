import React, {Component} from 'react';
import {Dimensions, KeyboardAvoidingView, TextInput, StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import {SimpleButton} from '../common/SimpleButton';
import {PrimaryColor} from '../../utils/constants';

export class AddTaskComponent extends Component {
    render() {
        return (<KeyboardAvoidingView behavior='padding' style={styles.container}>
            <TouchableWithoutFeedback style={styles.fill} onPress={this.props.onDismiss}>
                <View style={styles.fill} />
            </TouchableWithoutFeedback>
            <View
                style={{
                    width: Dimensions.get('window').width * 0.85,
                    backgroundColor: '#eeeeee',
                    borderRadius: 10,
                }}
            >
                <TextInput
                    autoFocus
                    multiline
                    defaultValue={this.props.existingText}
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
            </View>
        </KeyboardAvoidingView>);
    }
}

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        height,
        width,
        alignItems: 'center',
        justifyContent: 'center',
    },
    fill: {
        ...StyleSheet.absoluteFillObject,
    },
    subContainer: {
        width: 300,
        justifyContent: 'center',
        backgroundColor: '#ffffff',
    }
});
