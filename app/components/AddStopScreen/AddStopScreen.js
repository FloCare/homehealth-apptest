import React from 'react';
import {View} from 'react-native';
import {AddStopFormContainer} from '../AddStopForm';
import styles from './styles';

const AddStopScreen = (props) => {
    return (
        <View style={styles.containerStyle}>
            <AddStopFormContainer
                onSubmit={props.onSubmit}
            />
        </View>
    );
};

export {AddStopScreen};
