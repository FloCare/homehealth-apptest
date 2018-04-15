import React, {Component} from 'react';
import {AddPatientScreen} from '../components/AddPatientScreen';
import {MyRealm, Patient, Case} from '../utils/data/schema';

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
        };
        this.clearForm = this.clearForm.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.setForm = this.setForm.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onChange(value, path) {
        this.addPatientForm.getComponent(path).validate();
        this.setState({value});
    }

    setForm(formElement) {
        this.addPatientForm = formElement;
        return this.addPatientForm;
    }

    clearForm() {
        this.setState({
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
        });
    }

    handleSubmit() {
        const value = this.addPatientForm.getValue();

        // Todo: Add proper ID generators
        const patientId = Math.random().toString();
        const caseId = Math.random().toString();

        // add a new patient and a new case
        // Todo: Add error handling ???
        MyRealm.write(() => {
            MyRealm.create(Patient.schema.name, {
                patientID: patientId,
                name: value.name,
                primaryContact: value.primaryContact ? value.primaryContact.toString() : '',
                emergencyContact: value.emergencyContact ? value.emergencyContact.toString() : '',
                streetAddress: value.streetAddress,
                zipCode: value.zip ? value.zip.toString() : '',
                city: value.city,
                notes: value.notes,
                diagnosis: value.diagnosis,
                midnightEpoch: 0
            });
            MyRealm.create(Case.schema.name, {
                caseID: caseId,
                patientID: patientId,
                diagnosis: value.diagnosis ? [value.diagnosis] : []
            });
        });
        console.log(MyRealm.objects(Patient.schema.name));
        this.clearForm();
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
