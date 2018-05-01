import React from 'react';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
});

const Fab = (props) => {
    const {onPressAddNote, onPressAddVisit, onPressAddPatient} = props;
    return (
        <ActionButton
            buttonColor='#45ceb1'
            size={50}
            useNativeFeedback={false}
            bgColor={'rgba(255,255,255,0.8)'}
        >
            <ActionButton.Item buttonColor='#45ceb1' title="Add Note" textStyle={{fontWeight: '500', color: '#000'}} useNativeFeedback={false} onPress={onPressAddNote}>
                <Icon name="md-paper" style={styles.actionButtonIcon} />
            </ActionButton.Item>
            <ActionButton.Item buttonColor='#45ceb1' title="Add Visit" textStyle={{fontWeight: '500', color: '#000'}} useNativeFeedback={false} onPress={onPressAddVisit}>
                <Icon name="md-calendar" style={styles.actionButtonIcon} />
            </ActionButton.Item>
            <ActionButton.Item buttonColor='#45ceb1' title="Add Patient" textStyle={{fontWeight: '500', color: '#000'}} useNativeFeedback={false} onPress={onPressAddPatient}>
                <Icon name="md-person" style={styles.actionButtonIcon} />
            </ActionButton.Item>
        </ActionButton>
    );
};

export default Fab;
