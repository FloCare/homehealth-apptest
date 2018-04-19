import React, {Component} from 'react';
import {View} from 'react-native';
import {Button} from 'react-native-elements';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import {MyRealm, Patient, Case} from '../../utils/data/schema';
import {diagnosisList} from '../../utils/constants';
import {AddPatientForm} from './AddPatientForm';
import styles from './styles';

class AddPatientFormContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: {
                name: null,
                streetAddress: null,         // Todo: Move address out of patientSchema
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

    handleSubmit(e, onSubmit) {
        const value = this.addPatientForm.getValue();

        if (value) {
            // Todo: Add proper ID generators
            const patientId = Math.random().toString();
            const caseId = Math.random().toString();

            // add a new patient and a new case
            // Todo: Add error handling ???
            // Todo: Split the patient schema. Add a (patient + address + case)
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

            // Call Screen Container's onSubmit() hook
            onSubmit();
        }
    }

    render() {
        const {onSubmit} = this.props;
        return (
            <View style={styles.containerStyle}>
                <AddPatientForm
                    refName={this.setForm}
                    onChange={this.onChange}
                    value={this.state.value}
                    items={diagnosisList}
                    onSelectedItemsChange={this.onSelectedItemsChange}
                    selectedItems={this.state.selectedItems}
                />
                <SectionedMultiSelect
                    items={diagnosisList}
                    uniqueKey='id'
                    subKey='children'
                    selectText='Diagnosis'
                    showDropDowns
                    readOnlyHeadings
                    onSelectedItemsChange={this.onSelectedItemsChange}
                    selectedItems={this.selectedItems}
                />
                <Button
                    buttonStyle={styles.buttonStyle}
                    title='Save'
                    onPress={(e) => this.handleSubmit(e, onSubmit)}
                />
            </View>
        );
    }
}

export {AddPatientFormContainer};
