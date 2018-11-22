import React, {Component} from 'react';
import {View, TextInput} from 'react-native';
import {SimpleButton} from '../common/SimpleButton';
import {PrimaryColor} from '../../utils/constants';

export class NoteTextBox extends Component {
    constructor(props) {
        super(props);
        this.state = {text: undefined};
    }

    render() {
        return (
            <View
                style={{
                    // flex: 1,
                    flexDirection: 'column',
                    paddingHorizontal: 17.5,
                    borderTopWidth: 2.5,
                    borderColor: '#f1f1f1'
                }}
            >
                <TextInput
                    style={{
                        marginVertical: 15
                    }}
                    value={this.state.text}
                    onChangeText={text => { this.setState({text}); }}
                    multiline
                    placeholder={'Enter note for the patient here'}
                />
                <View
                    style={{height: 40, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}
                >
                    {/*<Image source={Images.notesIcon} />*/}
                    <SimpleButton
                        title={'Share'}
                        disabled={!this.state.text}
                        style={{
                            borderRadius: 15,
                            paddingHorizontal: 20,
                            opacity: this.state.text ? 1 : 0.6,
                            backgroundColor: 'transparent',
                            borderColor: PrimaryColor,
                            borderWidth: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        textStyle={{
                            color: PrimaryColor
                        }}
                        onPress={() => {
                            if (this.state.text) {
                                this.props.onSubmit(this.state.text);
                                this.setState({text: undefined});
                            }
                        }}
                    />
                </View>
            </View>
        );
    }
}
