import React, {Component} from 'react';
import {ScrollView} from 'react-native';
import t from 'tcomb-form-native';
import styles from './styles';

const Form = t.form.Form;

class AddPatientForm extends Component {
    render() {
        const {refName, onChange, value, modelType, options, selectedItems} = this.props;
        options.SelectedItems = selectedItems;
        console.log('SelectedItems: ', options.SelectedItems);

        return (
            <ScrollView style={styles.formScrollViewStyle}>
                <Form
                    ref={refName}
                    type={modelType}
                    options={options.Options}
                    onChange={onChange}
                    value={value}
                />
            </ScrollView>
        );
    }
}

export {AddPatientForm};
