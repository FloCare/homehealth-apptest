import React from 'react';
import {View, Text, TextInput} from 'react-native';
import {Button} from 'react-native-elements';
import styles from './styles';

// render form with patientName set
const AddNoteFormWithPatientTag = (props) => {
    const {handleSubmit, name, onChangeText, value} = props;
    return (
        <View>
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
        </View>
    );
};

export {AddNoteFormWithPatientTag};
