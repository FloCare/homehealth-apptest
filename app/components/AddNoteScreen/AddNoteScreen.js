import React from 'react';
import {View} from 'react-native';
import {AddNoteFormContainer} from '../AddNoteForm';
import styles from './styles';

const AddNoteScreen = (props) => {
    const {onSubmit, patientId, name, navigator} = props;
    return (
        <View style={styles.containerStyle}>
            <AddNoteFormContainer
                navigator={navigator}
                onSubmit={onSubmit}
                patientId={patientId}
                name={name}
            />
        </View>
    );
};

export {AddNoteScreen};
