import t from 'tcomb-form-native';
import {PhoneNumber, zipCodeType} from '../../utils/lib';
import AddressAutoComplete from '../common/AddressAutoComplete';
import DiagnosisMultiSelect from './DiagnosisMultiSelect';
import stylesheet from './formStyleSheet';
import PatientFormTemplate from './AddPatientFormTemplate';
import moment from 'moment/moment';
import React from 'react'
import { Text, View, TouchableOpacity} from 'react-native'
import DateTimePicker from 'react-native-modal-datetime-picker';
import {PrimaryColor, PrimaryFontFamily} from "../../utils/constants";

const EmergencyContactInformationModel = t.struct({
    contactNumber: PhoneNumber,
    contactName: t.maybe(t.String),
    contactRelation: t.maybe(t.String)
});

const Component = t.form.Component;

class DatePickerPopup extends Component {
    constructor (props) {
        super(props)
        const dateValue = props.value || null;
        this.state = {
            isDateTimePickerVisible: !dateValue,
            value: dateValue
        }
    }

    getTemplate () {

        const _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });
        const _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

        const isVisible = this.state.isDateTimePickerVisible;
        const selectedDate = this.state.value;
        const _handleDatePicked = (date) => {
            this._onChangeText();
            _hideDateTimePicker();

        };
        let self = this
        return function (locals) {
            return (
                <View style={{ flex: 1 }}>
                    <TouchableOpacity onPress={_showDateTimePicker}>
                        <Text>Date Of Birth</Text>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingTop:10}}>
                            <Text style={{color: '#525252',fontFamily: PrimaryFontFamily, fontSize: 15, paddingLeft: 5}}>
                                {selectedDate ? moment(selectedDate).format('DD-MMM-YYYY') : "Select Date"}
                            </Text>
                            {
                                selectedDate && <Text style={{color: PrimaryColor, textAlign: 'right', paddingRight:10}}>
                                    {"Change Date"}
                                </Text>
                            }
                        </View>
                    </TouchableOpacity>
                    <DateTimePicker
                        date={selectedDate || new Date()}
                        isVisible={isVisible}
                        datePickerModeAndroid="spinner"
                        onConfirm={(date) => {
                            _handleDatePicked(date);
                            locals.onChange(date);
                        }}
                        onCancel={() => {
                            _hideDateTimePicker();
                        }}
                        maximumDate={new Date()}
                    />
                </View>
            )
        }
    }

    getLocals () {
        let locals = super.getLocals();
        return locals;
    }

    _onChangeText (dateString) {
        this.setState({value: dateString})
    }

    shouldComponentUpdate (nextProps, nextState) {
        return true
    }
}

const AddPatientModel = t.struct({
    firstName: t.String,
    lastName: t.String,
    streetAddress: t.String,
    apartmentNo: t.maybe(t.String),
    zipCode: zipCodeType,
    city: t.maybe(t.String),
    state: t.maybe(t.String),
    primaryContact: PhoneNumber,
    //emergencyContact: t.maybe(PhoneNumber),
    //diagnosis: t.maybe(t.String),
    notes: t.maybe(t.String),
    dateOfBirth: t.maybe(t.Date),
    showDateOfBirth: t.maybe(t.Boolean),
    emergencyContactInfo: t.maybe(EmergencyContactInformationModel),
    showEmergencyContact: t.maybe(t.Boolean)
});


const NestedHeaderStylesheet = {
...stylesheet,
        controlLabel: {
    ...stylesheet.controlLabel,
            normal: {
        ...stylesheet.controlLabel.normal,
                fontSize: 12
        }
    }
};

const nameError = (value) => {
    if (!value) {
        return 'Required';
    }
};

const formOptions = {
    stylesheet,
    template: PatientFormTemplate,
    fields: {
        firstName: {
            label: 'First Name',
            error: nameError,
            placeholder: 'John',
            returnKeyType: 'next',
            autoCapitalize: 'words',
        },
        lastName: {
            label: 'Last Name',
            error: nameError,
            placeholder: 'Doe',
            returnKeyType: 'next',
            autoCapitalize: 'words',
        },
        zipCode: {
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
            placeholder: 'A-482',
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
        },
        dateOfBirth: {
            factory: DatePickerPopup
        },
        showDateOfBirth: {
            hidden: true,
        },
        emergencyContactInfo: {
            label: 'Emergency Contact Info (Optional)',
            fields: {
                contactName: {
                    stylesheet: NestedHeaderStylesheet,
                    label: 'Name',
                    placeholder: 'Blake',
                    returnKeyType: 'next',
                    autoCapitalize: 'words',
                },
                contactNumber: {
                    stylesheet: NestedHeaderStylesheet,
                    label: 'Contact Number',
                    placeholder: '5417543010',
                    keyboardType: 'numeric'
                },
                contactRelation: {
                    stylesheet: NestedHeaderStylesheet,
                    label: 'Relation',
                    placeholder: 'Brother'
                }
            }
        },
        showEmergencyContact: {
            hidden: true
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
