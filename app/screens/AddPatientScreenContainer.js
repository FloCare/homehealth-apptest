import React, { Component } from 'react';
import { AddPatientScreen } from '../components/AddPatientScreen';

class AddPatientScreenContainer extends Component {
    /*
        Container Component - has states
     */
    constructor(props) {
        super(props);
        // this.state = { formIsValid: false, formIsSubmitted: false }; // TODO add state vars here
        this.handleSubmit = this.handleSubmit.bind(this);
        this.setForm = this.setForm.bind(this);
    }

    handleSubmit() {
        // console.log(Object.getOwnPropertyNames(this.formValues.current.refs.input.refs.name.refs.input));
        // const value = this.refs.addPatientForm.getValue();
        const value = Object.getOwnPropertyNames(this.addPatientForm);
        console.log('value: ', value);
    }

    setForm(formElement) {
        this.addPatientForm = formElement;
        const value = Object.getOwnPropertyNames(this.addPatientForm);
        console.log('value: ', value);
    }

    render() {
        return (
            // Add header (navigation module)
            <AddPatientScreen onSubmit={this.setForm} />
        );
    }
}

export default AddPatientScreenContainer;
