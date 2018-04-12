import React, { Component } from 'react';
import { AddPatientScreen } from '../components/AddPatientScreen';

class AddPatientScreenContainer extends Component {
    /*
        Container Component - has states
     */
    constructor(props) {
        super(props);
        this.state = {
            value: {
                name: null,
                streetAddress: null,
                zip: null,
                city: null,
                primaryContact: null,
                emergencyContact: null,
                diagnosis: null,
                notes: null
            }
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.setForm = this.setForm.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onChange(value, path) {
        this.addPatientForm.getComponent(path).validate();
        this.setState({ value });
    }

    setForm(formElement) {
        this.addPatientForm = formElement;
        return this.addPatientForm;
    }

    handleSubmit() {
        const value = this.addPatientForm.getValue();
        console.log('value: ', value);
    }

    render() {
        return (
            // Add header (navigation module)
            <AddPatientScreen
                refName={this.setForm}
                onChange={this.onChange}
                onSubmit={this.handleSubmit}
                value={this.state.value}
            />
        );
    }
}

export default AddPatientScreenContainer;
