import t from 'tcomb-form-native';

import AddressAutoComplete from './AddressAutoComplete';
import stylesheet from './formStyleSheet';


const formOptions = {
    stylesheet,
    fields: {
        address: {
            label: 'Street Address',
            error: 'Please enter a valid street address',
            template: AddressAutoComplete,
            config: {
                onPress: null,
                onChangeAddressText: null,
                refName: null
            }
        },
        remember: {
            label: 'Save for future'
        },
        stopname: {
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
        return this._options.fields.address.config.onPress;
    }

    set OnPress(onPress) {
        this._options.fields.address.config.onPress = onPress;
    }

    get OnChangeAddressText() {
        return this._options.fields.address.config.onChangeAddressText;
    }

    set OnChangeAddressText(onChangeAddressText) {
        this._options.fields.address.config.onChangeAddressText = onChangeAddressText;
    }

    get RefName() {
        return this._options.fields.address.config.refName;
    }

    set RefName(refName) {
        this._options.fields.address.config.refName = refName;
    }
}

export {Options};
