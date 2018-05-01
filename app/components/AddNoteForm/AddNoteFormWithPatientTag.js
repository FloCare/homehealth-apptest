import React from 'react';
import {View, Text, TextInput} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Button} from 'react-native-elements';
import styles from './styles';

// render form with patientName set
const AddNoteFormWithPatientTag = (props) => {
    const {handleSubmit, name, onChangeText, value} = props;
    return (
        <View style={{flex: 1}}>
            <View style={{backgroundColor: '#e1e8ee', borderWidth: 1, borderColor: '#a2a2a2', height: 50}}>
                <Text style={{flex: 1, textAlign: 'left', textAlignVertical: 'center', fontWeight: '200', fontSize: 25}}>{name}</Text>
            </View>
            <KeyboardAwareScrollView style={{flex: 1}} keyboardShouldPersistTaps='handled'>
                <View
                    style={{
                        borderColor: '#a2a2a2',
                        borderBottomWidth: 1,
                        backgroundColor: '#e1e8ee'
                    }}
                >
                    <TextInput
                        style={{textAlignVertical: 'top'}}
                        placeholder='Please type your notes here ...'
                        multiline
                        numberOfLines={25}
                        onChangeText={onChangeText}
                        value={value}
                    />
                </View>
            </KeyboardAwareScrollView>
            <Button
                buttonStyle={styles.buttonStyle}
                title='Save'
                onPress={handleSubmit}
            />
        </View>
    );
};

export {AddNoteFormWithPatientTag};
