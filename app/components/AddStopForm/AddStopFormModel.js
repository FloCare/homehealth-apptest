import AddressAutoComplete from '../common/AddressAutoComplete';
import stylesheet from './formStyleSheet';

const formOptions = {
    stylesheet,
    fields: {
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
        primaryContact: {
            label: 'Contact No (Optional)',
            placeholder: '5417543010',
            keyboardType: 'numeric'
        },
        stopName: {
            label: 'Give it a name',
            placeholder: 'Eg. Office',
            error: 'Please enter a valid stop name'
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

    get OnPress() {
        return this._options.fields.streetAddress.config.onPress;
    }

    set OnPress(onPress) {
        this._options.fields.streetAddress.config.onPress = onPress;
    }

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

export {Options};
