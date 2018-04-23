import React from 'react';
import {View} from 'react-native';
import {AddNoteFormContainer} from '../AddNoteForm';
import styles from './styles';

const AddNoteScreen = (props) => {
    const {onSubmit, patientId, name} = props;
    return (
        <View style={styles.containerStyle}>
            <AddNoteFormContainer
                onSubmit={onSubmit}
                patientId={patientId}
                name={name}
            />
        </View>
    );
};

export {AddNoteScreen};
