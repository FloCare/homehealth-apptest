import React from 'react';
import {View, Text, TextInput} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Button} from 'react-native-elements';
import styles from './styles';

// render form with patientName set
const AddNoteFormWithPatientTag = (props) => {
    const {handleSubmit, name, onChangeText, value} = props;
    return (
        <KeyboardAwareScrollView keyboardShouldPersistTaps='handled'>
            <View><Text>{name}</Text></View>
            <TextInput
                multiline
                numberOfLines={20}
                onChangeText={onChangeText}
                value={value}
            />
            <Button
                buttonStyle={styles.buttonStyle}
                title='Save'
                onPress={handleSubmit}
            />
        </KeyboardAwareScrollView>
    );
};

export {AddNoteFormWithPatientTag};
