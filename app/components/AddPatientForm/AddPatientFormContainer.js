import React, {Component} from 'react';
import firebase from 'react-native-firebase';
import {View} from 'react-native';
import {Button} from 'react-native-elements';
import {AddPatientForm} from './AddPatientForm';
import {AddPatientModel, Options} from './AddPatientModel';
import styles from './styles';
import {ParseGooglePlacesAPIResponse} from '../../utils/parsingUtils';
import {PrimaryFontFamily, eventNames} from '../../utils/constants';
import {patientDataService} from '../../data_services/PatientDataService';

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
                country: props.country || null,
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
                country: null,
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
                    patientDataService.editExistingPatient(patientId, this.state.value);
                } catch (err) {
                    console.log('Error on Patient and Episode edit: ', err);
                    // Todo: Raise an error to the screen
                    return;
                }
            } else {
                try {
                    patientDataService.createNewPatient(this.state.value);
                    firebase.analytics().logEvent(eventNames.PATIENT_ADDED, {});
                } catch (err) {
                    console.log('Error on Patient and Episode creation: ', err);
                    // Todo: Raise an error to the screen
                    return;
                }
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
                    textStyle={{
                        fontFamily: PrimaryFontFamily,
                        fontSize: 16
                    }}
                    title='Save'
                    onPress={(e) => this.handleSubmit(e, onSubmit)}
                />
            </View>
        );
    }
}

export {AddPatientFormContainer};
