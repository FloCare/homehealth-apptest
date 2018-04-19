import React, {Component} from 'react';
import {ScrollView} from 'react-native';
import t from 'tcomb-form-native';
import {AddPatientModel, options} from './AddPatientModel';
import styles from './styles';

const Form = t.form.Form;

class AddPatientForm extends Component {
    render() {
        const {refName, onChange, value} = this.props;
        return (
            <ScrollView style={styles.formScrollViewStyle}>
                <Form
                    ref={refName}
                    type={AddPatientModel}
                    options={options}
                    onChange={onChange}
                    value={value}
                />
            </ScrollView>
        );
    }
}

export {AddPatientForm};
