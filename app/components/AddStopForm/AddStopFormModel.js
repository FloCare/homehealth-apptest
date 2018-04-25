import t from 'tcomb-form-native';
import {PhoneNumber, zipCode} from '../../utils/lib';
import AddressAutoComplete from './AddressAutoComplete';
import DiagnosisMultiSelect from './DiagnosisMultiSelect';
import stylesheet from './formStyleSheet';

const AddPatientModel = t.struct({
    name: t.String,
    streetAddress: t.String,
    apartmentNo: t.maybe(t.String),
    zip: zipCode,
    city: t.maybe(t.String),
    primaryContact: PhoneNumber,
    emergencyContact: t.maybe(PhoneNumber),
    diagnosis: t.maybe(t.String),
    notes: t.maybe(t.String)
});

const nameError = (value) => {
    if (!value) {
        return 'Required';
    }
};

const formOptions = {
    stylesheet,
        fields: {
        address: {
            label: 'Street Address',
            error: 'Please enter a valid street address',
            template: AddressAutoComplete,
            config: {
                onPress: null,
                onChangeAddressText: null
            }
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

    get SelectedItems() {
        return this._options.fields.diagnosis.config.selectedItems;
    }

    set SelectedItems(selectedItems) {
        this._options.fields.diagnosis.config.selectedItems = selectedItems;
    }

    get OnPress() {
        return this._options.fields.streetAddress.config.onPress;
    }

    set OnPress(onPress) {
        this._options.fields.streetAddress.config.onPress = onPress;
    }

    get OnSelectedItemsChange() {
        return this._options.fields.diagnosis.config.onSelectedItemsChange;
    }

    set OnSelectedItemsChange(onSelectedItemsChange) {
        console.log('============================');
        console.log('Setting onSelectedItems Change');
        console.log('============================');
        this._options.fields.diagnosis.config.onSelectedItemsChange = onSelectedItemsChange;
    }

    get OnChangeAddressText() {
        return this._options.fields.streetAddress.config.onChangeAddressText;
    }

    set OnChangeAddressText(onChangeAddressText) {
        this._options.fields.streetAddress.config.onChangeAddressText = onChangeAddressText;
    }
}

export {AddPatientModel, Options};
