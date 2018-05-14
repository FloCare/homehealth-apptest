import React from 'react';
import {View, TextInput} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Button} from 'react-native-elements';
import styles from './styles';
import StyledText from '../common/StyledText';
import {PrimaryFontFamily} from '../../utils/constants';

// render form with patientName set
const AddNoteFormWithPatientTag = (props) => {
    const {handleSubmit, name, onChangeText, value} = props;
    return (
        <View style={{flex: 10, justifyContent: 'space-between'}}>
            <View style={styles.nameContainerStyle}>
                <StyledText
                    style={styles.nameTextStyle}
                >{name}</StyledText>
            </View>
            <KeyboardAwareScrollView
                style={styles.scrollViewStyle}
                keyboardShouldPersistTaps='handled'
            >
                <TextInput
                    style={styles.notesTextStyle}
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
                textStyle={{
                    fontFamily: PrimaryFontFamily,
                    fontSize: 16
                }}
            />
        </View>
    );
};

export {AddNoteFormWithPatientTag};
