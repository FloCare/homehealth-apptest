import React, { Component } from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-elements';
import styles from './styles';
import { AddPatientForm } from '../AddPatientForm';

class AddPatientScreen extends Component {
    /*
        Presentational component - has for a form and button as children
     */
    render() {
        const { refName, onSubmit } = this.props;
        return (
            <View style={styles.containerStyle}>
                <AddPatientForm
                    refName={refName}
                />
                <Button
                    styles={styles.buttonStyle}
                    title='Save'
                    onPress={onSubmit}
                />
            </View>
        );
    }
}

export { AddPatientScreen };
