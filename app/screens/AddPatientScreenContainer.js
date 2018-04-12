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
                onSubmit={this.handleSubmit}
            />
        );
    }
}

export default AddPatientScreenContainer;
