import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import t from 'tcomb-form-native';
import { AddPatientModel, options } from './AddPatientModel';
import styles from './styles';

const Form = t.form.Form;

class AddPatientForm extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { refName } = this.props;
        return (
            <ScrollView style={styles.containerStyle}>
                <Form
                    ref={refName}
                    type={AddPatientModel}
                    options={options}
                />
            </ScrollView>
        );
    }
}

export { AddPatientForm };
