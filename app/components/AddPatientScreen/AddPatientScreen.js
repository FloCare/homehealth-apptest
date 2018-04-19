import React, {Component} from 'react';
import {View} from 'react-native';
import {AddPatientFormContainer} from '../AddPatientForm';
import styles from './styles';

class AddPatientScreen extends Component {
    /*
        Presentational component - has for a form and button as children
     */
    render() {
        const {onSubmit} = this.props;
        return (
            <View style={styles.containerStyle}>
                <AddPatientFormContainer
                    onSubmit={onSubmit}
                />
            </View>
        );
    }
}

export { AddPatientScreen };
