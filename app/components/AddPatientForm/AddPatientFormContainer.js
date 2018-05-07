import React, {Component} from 'react';
import {View} from 'react-native';
import {Button} from 'react-native-elements';
import {floDB, Patient} from '../../utils/data/schema';
import {AddPatientForm} from './AddPatientForm';
import {AddPatientModel, Options} from './AddPatientModel';
import styles from './styles';
import {parsePhoneNumber} from '../../utils/lib';
import {ParseGooglePlacesAPIResponse} from '../../utils/parsingUtils';

class AddPatientFormContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: {
                patientID: props.patientID || null,
                name: props.name || null,
                addressID: props.addressID || null,
                streetAddress: props.streetAddress || '',
                apartmentNo: props.apartmentNo || null,
                zip: props.zip || null,
                city: props.city || null,
                state: props.state || null,
                primaryContact: props.primaryContact || null,
                emergencyContact: props.emergencyContact || null,
                //diagnosis: props.diagnosis || null,
                notes: props.notes || null,
                lat: props.lat || null,
                long: props.long || null
            },
            //selectedItems: []
        };
        this.edit = props.edit || false;
        this.clearForm = this.clearForm.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.setForm = this.setForm.bind(this);
        this.setAddressFieldRef = this.setAddressFieldRef.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onAddressSelect = this.onAddressSelect.bind(this);
        //this.onSelectedItemsChange = this.onSelectedItemsChange.bind(this);
        this.onChangeAddressText = this.onChangeAddressText.bind(this);
        this.getDefaultValue = this.getDefaultValue.bind(this);

        this.options = new Options();
        this.options.OnPress = this.onAddressSelect;
        //this.options.OnSelectedItemsChange = this.onSelectedItemsChange;
        this.options.OnChangeAddressText = this.onChangeAddressText;
        this.options.RefName = this.setAddressFieldRef;
        this.options.GetDefaultValue = this.getDefaultValue;
    }

   // onSelectedItemsChange(selectedItems) {
   //     // const options = t.update(this.state.options, {
   //     //     fields: {
   //     //         diagnosis: {
   //     //             config: {
   //     //                 selectedItems: {$set: selectedItems}
   //     //             }
   //     //         }
   //     //     }
   //     // });
   //     this.setState({selectedItems});
   //     console.log(selectedItems);
   //  }

    onAddressSelect(data, details) {
        // Todo: Handle OFFLINE flow
        const resp = ParseGooglePlacesAPIResponse(data, details);
        const {streetAddress, city, stateName, zip, country, lat, long} = resp;

        const value = Object.assign({}, this.state.value, {streetAddress, city, state: stateName, zip, country, lat, long});
        this.setState({value});
    }

    onChange(value, path) {
        this.addPatientForm.getComponent(path).validate();
        this.setState({value});
        console.log('value:', value, 'path:', path);
    }

    onChangeAddressText(value) {
        const val = Object.assign({}, this.state.value, {streetAddress: value});
        this.setState({value: val});
    }

    getDefaultValue() {
        return this.state.value.streetAddress;
    }

    setForm(formElement) {
        this.addPatientForm = formElement;
        return this.addPatientForm;
    }

    setAddressFieldRef(element) {
        this.addressField = element;
        return this.addressField;
    }

    clearForm() {
        this.setState({
            value: {
                name: null,
                streetAddress: null,
                zip: null,
                city: null,
                state: null,
                primaryContact: null,
                emergencyContact: null,
                //diagnosis: null,
                notes: null,
                lat: null,
                long: null
            },
            //selectedItems: []
        });
        this.addressField.setAddressText('');
    }

    handleSubmit(e, onSubmit) {
        const value = this.addPatientForm.getValue();

        console.log('====================================================');
        console.log('INSIDE HANDLESUBMIT');
        console.log('====================================================');
        console.log('value = ', value);
        console.log('====================================================');
       if (value) {
            let patientId = null;
            if (this.edit) {
                // update the changed fields in the database
                console.log('Updating fields in the db');
                patientId = this.state.value.patientID;

                try {
                    floDB.write(() => {
                        // find the patient to update
                        const patient = floDB.objectForPrimaryKey(Patient.schema.name, patientId);

                        // Edit the corresponding address info
                        patient.address = {
                            addressID: this.state.value.addressID,
                            streetAddress: this.state.value.streetAddress ? this.state.value.streetAddress.toString() : '',
                            apartmentNo: this.state.value.apartmentNo ? this.state.value.apartmentNo : '',
                            zipCode: this.state.value.zip ? this.state.value.zip.toString() : '',
                            city: this.state.value.city ? this.state.value.city.toString() : '',
                            state: this.state.value.state ? this.state.value.state.toString() : ''
                        };

                        // Edit the latLong info
                        if (this.state.value.lat && this.state.value.long) {
                            patient.address.coordinates = {
                                latitude: this.state.value.lat,
                                longitude: this.state.value.long
                            };
                        }

                        // Edit the patient info
                        floDB.create(Patient.schema.name, {
                            patientID: this.state.value.patientID,
                            name: this.state.value.name ? this.state.value.name.toString() : '',
                            primaryContact: this.state.value.primaryContact ? parsePhoneNumber(this.state.value.primaryContact.toString()) : '',
                            emergencyContact: this.state.value.emergencyContact ? parsePhoneNumber(this.state.value.emergencyContact.toString()) : '',
                            notes: this.state.value.notes ? this.state.value.notes.toString() : '',
                            timestamp: 0,                                   // Todo: Add a timestmap
                        }, this.edit);
                    });
                } catch (err) {
                    console.log('Error on Patient and Episode creation: ', err);
                    // Todo: Raise an error to the screen
                    return;
                }

                // console.log('The new patient is:', floDB.objects(Patient.schema.name).filtered('patientID = $0', patientId));
            } else {
                // Todo: Add proper ID generators
                patientId = Math.random().toString();
                const episodeId = Math.random().toString();
                const addressId = Math.random().toString();

                try {
                    floDB.write(() => {
                        // Add the patient
                        const patient = floDB.create(Patient.schema.name, {
                            patientID: patientId,
                            name: this.state.value.name ? this.state.value.name.toString() : '',
                            primaryContact: this.state.value.primaryContact ? parsePhoneNumber(this.state.value.primaryContact.toString()) : '',
                            emergencyContact: this.state.value.emergencyContact ? parsePhoneNumber(this.state.value.emergencyContact.toString()) : '',
                            notes: this.state.value.notes ? this.state.value.notes.toString() : '',
                            timestamp: 0,                                   // Todo: Add a timestmap
                        });

                        // Add the corresponding address
                        patient.address = {
                            addressID: addressId,
                            streetAddress: this.state.value.streetAddress ? this.state.value.streetAddress.toString() : '',
                            apartmentNo: this.state.value.apartmentNo ? this.state.value.apartmentNo : '',
                            zipCode: this.state.value.zip ? this.state.value.zip.toString() : '',
                            city: this.state.value.city ? this.state.value.city.toString() : '',
                            state: this.state.value.state ? this.state.value.state.toString() : ''
                        };

                        // Add a latLong if present
                        if (this.state.value.lat && this.state.value.long) {
                            patient.address.coordinates = {
                                latitude: this.state.value.lat,
                                longitude: this.state.value.long
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
                    return;
                }
                // console.log('The new patient is:', floDB.objects(Patient.schema.name).filtered('patientID = $0', patientId));
            }
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
                    //selectedItems={this.state.selectedItems}
                />
                <Button
                    containerViewStyle={{marginLeft: 0, marginRight: 0}}
                    buttonStyle={styles.buttonStyle}
                    title='Save'
                    onPress={(e) => this.handleSubmit(e, onSubmit)}
                    large
                />
            </View>
        );
    }
}

export {AddPatientFormContainer};
