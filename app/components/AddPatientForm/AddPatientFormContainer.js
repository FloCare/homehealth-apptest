import React, {Component} from 'react';
import {View} from 'react-native';
import {Button} from 'react-native-elements';
import {floDB, Patient} from '../../utils/data/schema';
import {AddPatientForm} from './AddPatientForm';
import {AddPatientModel, Options} from './AddPatientModel';
import styles from './styles';

class AddPatientFormContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: {
                name: null,
                streetAddress: null,
                apartmentNo: null,
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
        this.onAddressSelect = this.onAddressSelect.bind(this);
        this.onSelectedItemsChange = this.onSelectedItemsChange.bind(this);

        this.options = new Options();
        this.options.OnPress = this.onAddressSelect;
        this.options.OnSelectedItemsChange = this.onSelectedItemsChange;
    }

   onSelectedItemsChange(selectedItems) {
       // const options = t.update(this.state.options, {
       //     fields: {
       //         diagnosis: {
       //             config: {
       //                 selectedItems: {$set: selectedItems}
       //             }
       //         }
       //     }
       // });
       this.setState({selectedItems});
       console.log(selectedItems);
    }

    onAddressSelect(data, details) {
        // Todo: Save the data returned by Google APIs to state var: value

        console.log('LatLong Object: ', details.geometry.location);
        const arrLen = details.address_components.length;
        console.log('Address Components: ');

        let streetAddress = 'Pram Niwas, HSR Layout';

        let zip = null;
        if (details.address_components[arrLen-1]['types'][0] === 'postal_code') {
            zip = details.address_components[arrLen-1].long_name;
            console.log('Zip Code: ', zip);
        } else {
            console.log('Last component is not a postal address');
        }

        let city = 'Honululu';
        // Todo: Update city and state from API

        // Todo: Change this ???
        this.setState({
            value: Object.assign({}, this.state.value, {streetAddress, zip, city})
        });

        console.log('====================');
        console.log('state value:', this.state.value);
        console.log('====================');
    }

    onChange(value, path) {
        this.addPatientForm.getComponent(path).validate();
        this.setState({value});
        console.log('value:', value, 'path:', path);
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

        console.log('====================================================');
        console.log('INSIDE HANDLESUBMIT');
        console.log('====================================================');
        console.log('value = ', value);
        console.log('====================================================');

        if (value) {
            // Todo: Add proper ID generators
            const patientId = Math.random().toString();
            const episodeId = Math.random().toString();
            const addressId = Math.random().toString();
            const latLongID = Math.random().toString();
            const hasLatLong = true;

            try {
                floDB.write(() => {
                    // Add the patient
                    const patient = floDB.create(Patient.schema.name, {
                        patientID: patientId,
                        name: value.name ? value.name : '',
                        primaryContact: value.primaryContact ? value.primaryContact.toString() : '',
                        emergencyContact: value.emergencyContact ? value.emergencyContact.toString() : '',
                        notes: value.notes,
                        timestamp: 0,               // Todo: Add a timestmap
                    });

                    // Add the corresponding address
                    const address = patient.address = {
                        addressID: addressId,
                        streetAddress: value.streetAddress ? value.streetAddress.toString() : '',
                        zipCode: value.zip ? value.zip.toString() : '',
                        city: value.city ? value.city.toString() : '',
                        state: ''                                     // Todo: Add a state
                    };

                    // Add a latLong if present
                    if (hasLatLong) {                                  // Todo: Add latLong from Google APIs
                        address.latLong = {
                            latLongID,
                            lat: 1.0,
                            long: 1.0
                        };
                    }

                    // Add an Episode
                    patient.episodes.push({
                        episodeID: episodeId,
                        diagnosis: []                                   // Todo: Add diagnosis
                    });
                });
            } catch (err) {
                console.log('Error on Patient and Episode creation: ', err);
                // Todo: Raise an error to the screen
            }

            console.log('The new patient is:', floDB.objects(Patient.schema.name).filtered('patientID = $0', patientId));
            this.clearForm();

            // Call Screen Container's onSubmit() hook
            onSubmit(patientId);
        }
    }

    render() {
        const {onSubmit} = this.props;
        return (
            <View style={styles.containerStyle}>
                <AddPatientForm
                    refName={this.setForm}
                    onChange={this.onChange}
                    options={this.options}
                    modelType={AddPatientModel}
                    value={this.state.value}
                    selectedItems={this.state.selectedItems}
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
