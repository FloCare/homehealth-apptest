import React from 'react';
import {View, Text, TextInput} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Button} from 'react-native-elements';
import styles from './styles';

// render form with patientName set
const AddNoteFormWithPatientTag = (props) => {
    const {handleSubmit, name, onChangeText, value} = props;
    return (
        <View style={{flex: 10, justifyContent: 'space-between'}}>
            <View style={{backgroundColor: '#e1e8ee', borderWidth: 1, borderColor: '#a2a2a2', height: 50}}>
                <Text
                    style={{
                        flex: 1,
                        textAlign: 'left',
                        textAlignVertical: 'center',
                        fontWeight: '200',
                        fontSize: 23,
                        paddingLeft: 10,
                        paddingRight: 10
                    }}
                >{name}</Text>
            </View>
            <KeyboardAwareScrollView
                style={{
                    flex: 9,
                    borderColor: '#a2a2a2',
                    borderBottomWidth: 1,
                    backgroundColor: '#e1e8ee',
                }}
                keyboardShouldPersistTaps='handled'
            >
                <TextInput
                    style={{textAlignVertical: 'top', paddingLeft: 10, paddingRight: 10}}
                    placeholder='Please type your notes here ...'
                    multiline
                    numberOfLines={25}
                    onChangeText={onChangeText}
                    value={value}
                />
            </KeyboardAwareScrollView>
            <Button
                containerViewStyle={{marginLeft: 0, marginRight: 0}}
                buttonStyle={styles.buttonStyle}
                title='Save'
                onPress={handleSubmit}
                large
            />
        </View>
    );
};

export {AddNoteFormWithPatientTag};
