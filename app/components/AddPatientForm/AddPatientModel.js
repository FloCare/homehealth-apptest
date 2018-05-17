import t from 'tcomb-form-native';
import {PhoneNumber, zipCode} from '../../utils/lib';
import AddressAutoComplete from '../common/AddressAutoComplete';
import DiagnosisMultiSelect from './DiagnosisMultiSelect';
import stylesheet from './formStyleSheet';
import PatientFormTemplate from './AddPatientFormTemplate';

const AddPatientModel = t.struct({
    name: t.String,
    streetAddress: t.String,
    apartmentNo: t.maybe(t.String),
    zip: zipCode,
    city: t.maybe(t.String),
    state: t.maybe(t.String),
    primaryContact: PhoneNumber,
    //emergencyContact: t.maybe(PhoneNumber),
    //diagnosis: t.maybe(t.String),
    notes: t.maybe(t.String)
});

const nameError = (value) => {
    if (!value) {
        return 'Required';
    }
};

const formOptions = {
    stylesheet,
    template: PatientFormTemplate,
    fields: {
        name: {
            label: 'Patient Name',
            error: nameError,
            placeholder: 'John Doe',
            returnKeyType: 'next',
            autoCapitalize: 'words',
        },
        zip: {
            label: 'Zip Code',
            error: 'Please enter a valid zipCode',
            placeholder: '12345',
            keyboardType: 'numeric'
        },
        primaryContact: {
            label: 'Primary Contact',
            placeholder: '5417543010',
            keyboardType: 'numeric'
        },
        // emergencyContact: {
        //     label: 'Emergency Contact (Optional)',
        //     placeholder: '5417543010',
        //     keyboardType: 'numeric'
        // },
        // diagnosis: {
        //     label: 'Diagnosis',
        //     placeholder: '#ADHD',
        //     error: 'Please enter a valid diagnosis for the patient',
        //     config: {
        //         onSelectedItemsChange: null,
        //         selectedItems: []
        //     },
        //     template: DiagnosisMultiSelect
        // },
        streetAddress: {
            label: 'Street Address',
            error: 'Please enter a valid street address',
            template: AddressAutoComplete,
            config: {
                onPress: null,
                onChangeAddressText: null,
                refName: null,
                getDefaultValue: null,
            }
        },
        apartmentNo: {
            label: 'Apt. No. (Optional)',
            placeholder: '#482',
            keyboardType: 'numeric',
            error: 'Please enter a valid apartment No'
        },
        city: {
            label: 'City',
            error: 'Please enter a valid city name',
            placeholder: 'Los Angeles'
        },
        state: {
            label: 'State',
            error: 'Please enter a valid state name',
            placeholder: 'CA'
        },
        notes: {
            multiline: true,
            error: 'Please enter a valid note',
            label: 'Notes (Optional)',
            placeholder: 'Door Password - 1234',
            stylesheet: {
                ...stylesheet,
                textboxView: {
                    borderBottomView: 0
                },
                textbox: {
                    ...stylesheet.textbox,
                    normal: {
                        ...stylesheet.textbox.normal,
                        height: 100,
                        textAlignVertical: 'top',
                        borderWidth: 0.5
                    },
                    error: {
                        ...stylesheet.textbox.error,
                        height: 200,
                    },
                },
            },
        }
    }
};


class Options {
    constructor() {
        this._options = formOptions;
    }

    get Options() {
        return this._options;
    }

    set Options(options) {
        this._options = options;
    }

    // get SelectedItems() {
    //     return this._options.fields.diagnosis.config.selectedItems;
    // }
    //
    // set SelectedItems(selectedItems) {
    //     this._options.fields.diagnosis.config.selectedItems = selectedItems;
    // }

    get OnPress() {
        return this._options.fields.streetAddress.config.onPress;
    }

    set OnPress(onPress) {
        this._options.fields.streetAddress.config.onPress = onPress;
    }

    // get OnSelectedItemsChange() {
    //     return this._options.fields.diagnosis.config.onSelectedItemsChange;
    // }
    //
    // set OnSelectedItemsChange(onSelectedItemsChange) {
    //     console.log('============================');
    //     console.log('Setting onSelectedItems Change');
    //     console.log('============================');
    //     this._options.fields.diagnosis.config.onSelectedItemsChange = onSelectedItemsChange;
    // }

    get OnChangeAddressText() {
        return this._options.fields.streetAddress.config.onChangeAddressText;
    }

    set OnChangeAddressText(onChangeAddressText) {
        this._options.fields.streetAddress.config.onChangeAddressText = onChangeAddressText;
    }

    get RefName() {
        return this._options.fields.streetAddress.config.refName;
    }

    set RefName(refName) {
        this._options.fields.streetAddress.config.refName = refName;
    }

    get GetDefaultValue() {
        return this._options.fields.streetAddress.config.getDefaultValue;
    }

    set GetDefaultValue(getDefaultValue) {
        this._options.fields.streetAddress.config.getDefaultValue = getDefaultValue;
    }
}

export {AddPatientModel, Options};
