import React, {Component} from 'react';
import {View} from 'react-native';
import {Button} from 'react-native-elements';
import styles from './styles';
import {AddPatientForm} from '../AddPatientForm';

class AddPatientScreen extends Component {
    /*
        Presentational component - has for a form and button as children
     */
    render() {
        const { refName, onSubmit, onChange, value } = this.props;
        return (
            <View style={styles.containerStyle}>
                <AddPatientForm
                    refName={refName}
                    onChange={onChange}
                    value={value}
                />
                <Button
                    buttonStyle={styles.buttonStyle}
                    title='Save'
                    onPress={onSubmit}
                />
            </View>
        );
    }
}

export { AddPatientScreen };
