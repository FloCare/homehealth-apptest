import React, {Component} from 'react';
import t from 'tcomb-form-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';

const Form = t.form.Form;

class AddPatientForm extends Component {
    render() {
        const {refName, onChange, value, modelType, options, selectedItems} = this.props;
        options.SelectedItems = selectedItems;
        console.log('SelectedItems: ', options.SelectedItems);

        return (
            <KeyboardAwareScrollView
                style={styles.formScrollViewStyle}
                keyboardShouldPersistTaps='handled'
            >
                <Form
                    ref={refName}
                    type={modelType}
                    options={options.Options}
                    onChange={onChange}
                    value={value}
                />
            </KeyboardAwareScrollView>
        );
    }
}

export {AddPatientForm};
