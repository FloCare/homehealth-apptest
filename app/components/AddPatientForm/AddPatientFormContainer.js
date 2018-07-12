import React, {Component} from 'react';
import firebase from 'react-native-firebase';
import {View, TouchableOpacity, Image, Text} from 'react-native';
import {Button} from 'react-native-elements';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import ModalSelector from 'react-native-modal-selector';
import {AddPatientForm} from './AddPatientForm';
import {AddPatientModel, Options} from './AddPatientModel';
import styles from './styles';
import {ButtonTextStyles} from '../common/SimpleButton';
import {ParseGooglePlacesAPIResponse} from '../../utils/parsingUtils';
import {PrimaryFontFamily, eventNames, PrimaryColor} from '../../utils/constants';
import {PatientDataService} from '../../data_services/PatientDataService';

import {Images} from '../../Images';


class AddPatientFormContainer extends Component {
    constructor(props) {
        super(props);
        const emergencyContactInfo = {
            contactNumber: props.emergencyContactInfo ? props.emergencyContactInfo.contactNumber || null : null,
            contactName: props.emergencyContactInfo ? props.emergencyContactInfo.contactName || null : null,
            contactRelation: props.emergencyContactInfo ? props.emergencyContactInfo.contactRelation || null : null
        };
        const showEmergencyContact = !!emergencyContactInfo.contactNumber;
        this.state = {
            value: {
                patientID: props.patientID || null,
                firstName: props.firstName || null,
                lastName: props.lastName || null,
                addressID: props.addressID || null,
                streetAddress: props.streetAddress || '',
                apartmentNo: props.apartmentNo || null,
                zipCode: props.zipCode || null,
                city: props.city || null,
                state: props.state || null,
                country: props.country || null,
                primaryContact: props.primaryContact || null,
                emergencyContact: props.emergencyContact || null,
                //diagnosis: props.diagnosis || null,
                notes: props.notes || null,
                lat: props.lat || null,
                long: props.long || null,
                showDateOfBirth: !!props.dateOfBirth,
                dateOfBirth: props.dateOfBirth || null,
                showEmergencyContact: showEmergencyContact,
                emergencyContactInfo: emergencyContactInfo
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
        const {streetAddress, city, stateName, zipCode, country, lat, long} = resp;

        const value = Object.assign({}, this.state.value, {streetAddress, city, state: stateName, zipCode, country, lat, long});
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
                firstName: null,
                lastName: null,
                streetAddress: null,
                zipCode: null,
                city: null,
                state: null,
                country: null,
                primaryContact: null,
                emergencyContact: null,
                //diagnosis: null,
                notes: null,
                lat: null,
                long: null,
                showDateOfBirth: false,
                dateOfBirth: null,
                showEmergencyContact: false,
                emergencyContactInfo: {
                    contactNumber: null,
                    contactName: null,
                    contactRelation: null
                }
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
                    this.patientDataService().editExistingPatient(patientId, this.state.value);
                } catch (err) {
                    console.log('Error on Patient and Episode edit: ', err);
                    // Todo: Raise an error to the screen
                    return;
                }
            } else {
                try {
                    this.patientDataService().createNewPatient(this.state.value);
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
        } else {
           const validationResult = this.addPatientForm.validate();
           if (validationResult.errors) {
               this.addPatientForm.getComponent(validationResult.errors[0].path).refs.input.focus();
           }
       }
    }

    disableExtraFields = () => {
        return this.state.value.showDateOfBirth && this.state.value.showEmergencyContact;
    };


    ExtraFieldsClickHandler = (key) => {
        switch (key) {
            case 'dob':
                this.setState({value: {
                        ...this.state.value,
                        showDateOfBirth: true,
                        isDateTimePickerVisible: false
                }});
                break;
            case 'emergencyContact':
                this.setState({value: {
                    ...this.state.value,
                    showEmergencyContact: true
                }});
                break;
            default:
                console.log('unhandled key');
        }
    };

    ExtraFieldsStyleData = {
        data: [
            {key: 0, id: 'dob', label: 'Date Of Birth'},
            {key: 1, id: 'emergencyContact', label: 'Emergency Contact Information'},
        ],
        optionTextStyle: {color: 'black'},
        overLayStyle: {backgroundColor: 'rgba(0,250,250,0.7)', padding: 5},
        optionContainerStyle: {backgroundColor: 'rgba(255,255,255,1.0)'},
        cancelContainerStyle: {backgroundColor: 'rgba(255,255,255,1.0)', borderRadius: 5},
    };

    // External Services
    patientDataService = () => { return PatientDataService.getInstance(); };

    render() {
        const {onSubmit} = this.props;
        const addFieldsButtonOpacity = this.disableExtraFields() ? 0.2 : 1.0;
        return (
            <View style={styles.containerStyle}>

                <KeyboardAwareScrollView
                    keyboardShouldPersistTaps={'always'}
                    enableAutoAutomaticScroll={false}
                    style={{...styles.formScrollViewStyle, marginBottom: 20}}
                >
                    <AddPatientForm
                        refName={this.setForm}
                        onChange={this.onChange}
                        options={this.options}
                        modelType={AddPatientModel}
                        value={this.state.value}
                        //selectedItems={this.state.selectedItems}
                    />
                    <ModalSelector
                        data={this.ExtraFieldsStyleData.data}
                        onChange={(option) => { this.ExtraFieldsClickHandler(option.id); }}
                        overLayStyle={this.ExtraFieldsStyleData.overLayStyle}
                        optionContainerStyle={this.ExtraFieldsStyleData.optionContainerStyle}
                        optionTextStyle={this.ExtraFieldsStyleData.optionTextStyle}
                        cancelText={'Cancel'}
                        cancelContainerStyle={this.ExtraFieldsStyleData.cancelContainerStyle}
                        disabled={this.disableExtraFields()}
                    >

                        <TouchableOpacity
                            style={{...styles.buttonStyle,
                                marginTop: 20,
                                backgroundColor: 'rgba(0, 0, 0, 0)',
                                alignSelf: 'center'}}
                        >
                            <View
                                style={{flex: 1,
                                    flexDirection: 'row',
                                    opacity: addFieldsButtonOpacity,
                                    alignItems: 'center',
                                    paddingBottom: 20}}
                            >
                                <Image
                                    style={{flex: 1, height: 18, resizeMode: 'contain', paddingRight: 40}}
                                   source={Images.plus}
                                />
                                <Text style={{...ButtonTextStyles.textStyle, fontSize: 20, color: PrimaryColor}}>
                                    {'Add More Fields'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </ModalSelector>
                </KeyboardAwareScrollView>

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
