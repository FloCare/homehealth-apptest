import React, {Component} from 'react';
import {AddPatientScreen} from '../components/AddPatientScreen';
import {MyRealm, Patient, Case} from '../utils/data/schema';

const items = [
    {
        name: 'Diagnosis',
        id: 0,
        children: [{
            name: 'ADHD',
            id: 10,
        }, {
            name: 'BLA',
            id: 17,
        }, {
            name: 'BLAH',
            id: 13,
        }, {
            name: 'BLAHH',
            id: 14,
        }, {
            name: 'BLAHHH',
            id: 15,
        }, {
            name: 'BLAHHHH',
            id: 16,
        }]
    },
];

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
            },
            selectedItems: []
        };
        this.clearForm = this.clearForm.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.setForm = this.setForm.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSelectedItemsChange = this.onSelectedItemsChange.bind(this);
    }

    onSelectedItemsChange = (selectedItems) => {
        this.setState({selectedItems});
        console.log(selectedItems);
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
            },
            selectedItems: []
        });
    }

    handleSubmit() {
        const value = this.addPatientForm.getValue();
        if (value) {
            // Todo: Add proper ID generators
            const patientId = Math.random().toString();
            const caseId = Math.random().toString();

            // add a new patient and a new case
            // Todo: Add error handling ???
            MyRealm.write(() => {
                MyRealm.create(Patient.schema.name, {
                    patientID: patientId,
                    name: value.name ? value.name : '',
                    primaryContact: value.primaryContact ? value.primaryContact.toString() : '',
                    emergencyContact: value.emergencyContact ? value.emergencyContact.toString() : '',
                    streetAddress: value.streetAddress,
                    zipCode: value.zip ? value.zip.toString() : '',
                    city: value.city,
                    notes: value.notes,
                    diagnosis: this.state.selectedItems[0].toString(),
                    midnightEpoch: 0
                });
                MyRealm.create(Case.schema.name, {
                    caseID: caseId,
                    patientID: patientId,
                    diagnosis: this.state.selectedItems ? [this.state.selectedItems[0].toString()] : []
                });
            });
            console.log(MyRealm.objects(Patient.schema.name));
            this.clearForm();

            this.props.navigator.push({
                screen: 'PatientList',
                animated: true,
                animationType: 'fade',
                title: 'Patients',
                backbuttonHidden: true,
                passProps: {
                    selectedPatient: 'Piyush',      // add the selected patient Object for hightlighting
                    patientCount: 50                // add the patient Count for displaying in header
                }
            });
        }
    }

    render() {
        return (
            // Add header (navigation module)
            <AddPatientScreen
                refName={this.setForm}
                onChange={this.onChange}
                onSubmit={this.handleSubmit}
                value={this.state.value}
                items={items}
                onSelectedItemsChange={this.onSelectedItemsChange}
                selectedItems={this.state.selectedItems}
            />
        );
    }
}

export default AddPatientScreenContainer;
