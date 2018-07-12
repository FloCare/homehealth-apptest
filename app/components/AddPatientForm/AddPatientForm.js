import React, {Component} from 'react';
import t from 'tcomb-form-native';

const Form = t.form.Form;

class AddPatientForm extends Component {
    render() {
        const {refName, onChange, value, modelType, options} = this.props;
        //options.SelectedItems = selectedItems;
        //console.log('SelectedItems: ', options.SelectedItems);

        return (
                <Form
                    ref={refName}
                    type={modelType}
                    options={options.Options}
                    onChange={onChange}
                    value={value}
                />
        );
    }
}

export {AddPatientForm};
