import React, {Component} from 'react';
import {View} from 'react-native';
import {Button} from 'react-native-elements';
import t from 'tcomb-form-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {floDB, Place} from '../../utils/data/schema';
import styles from './styles';
import stylesheet from './formStyleSheet';
import AddressAutoComplete from '../AddStopForm/';

const Form = t.form.Form;

class AddStopFormContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: {
                address: null,
                remember: true,
                stopName: null
            },
            modelType: this.getType(),
            options: this.getOptions()
        };
        this.onChangeAddressText = this.onChangeAddressText.bind(this);
        this.clearForm = this.clearForm.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.setForm = this.setForm.bind(this);
        this.onChange = this.onChange.bind(this);
        this.getType = this.getType.bind(this);
        this.getOptions = this.getOptions.bind(this);
        this.onAddressSelect = this.onAddressSelect.bind(this);
    }

    onChange(value, path) {
        console.log('value:', value, 'path:', path);
        console.log('value.address: ', value.address);

        // Change type and options if address changed
        if (path.indexOf('address') > -1) {
            const type = this.getType(value.address);
            const options = this.getOptions(value.address);
            this.setState({
                modelType: type,
                options
            });
        }

        this.setState({
            value
        });
    }

    onChangeAddressText(value) {
        console.log('Address Text Changed:', value);
        const val = Object.assign({}, this.state.value, {address: value});
        this.setState({value: val});
    }

    onAddressSelect(data, details) {
        // Todo
        console.log('Address selected from dropdown');
    }

    setForm(element) {
        this.addStopForm = element;
        return this.addStopForm;
    }

    getType(address) {
        if (address && address.length > 0) {
            return t.struct({
                address: t.String,
                remember: t.Boolean,
                stopName: t.String
            });
        } else {
            return t.struct({
                address: t.String
            });
        }
    }

    getOptions(address) {
        if (address && address.length > 0) {
            const formOptions = {
                stylesheet,
                fields: {
                    address: {
                        error: 'Please enter a valid address',
                        placeholder: 'Search',
                        template: AddressAutoComplete,
                        config: {
                            onChangeAddressText: this.onChangeAddressText,
                            onPress: this.onAddressSelect
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
            return formOptions;
        } else {
            const formOptions = {
                stylesheet,
                fields: {
                    address: {
                        error: 'Please enter a valid address',
                        placeholder: 'Search',
                        template: AddressAutoComplete,
                        config: {
                            onChangeAddressText: this.onChangeAddressText,
                            onPress: this.onAddressSelect
                        }
                    }
                }
            };
            return formOptions;
        }
    }

    clearForm() {
        this.setState({
            value: {
                address: null,
                remember: null,
                stopName: null
            },
            modelType: this.getType(),
            options: this.getOptions()
        });
    }

    handleSubmit(e, onSubmit) {
        const value = this.addStopForm.getValue();

        console.log('====================================================');
        console.log('INSIDE HANDLESUBMIT');
        console.log('====================================================');
        console.log('value = ', value);
        console.log('====================================================');

        if (value && this.state.value.remember) {
            console.log('HURRRAAAYYYYY!!!! !!! SUCCESSSS! !!!!!!!!');

            const placeId = Math.random().toString();
            const addressId = Math.random().toString();

            try {
                floDB.write(() => {
                    const stop = floDB.create(Place.schema.name, {
                        placeID: placeId,
                        name: this.state.value.stopName
                    });

                    stop.address = {
                        addressID: addressId,
                        streetAddress: this.state.value.address
                    };
                });
                console.log('Save to DB successful');
            } catch (err) {
                console.log('Error on Stop addition: ', err);
                // Todo Don't fail silently, raise and alarm
            }
        }
        // const places = floDB.objects(Place.schema.name)
        // console.log('All places in DB:', places);

        this.clearForm();
        onSubmit();
    }

    render() {
        const {onSubmit} = this.props;
        return (
            <View style={styles.containerStyle}>
                <KeyboardAwareScrollView style={styles.formScrollViewStyle}>
                    <Form
                        ref={this.setForm}
                        type={this.state.modelType}
                        value={this.state.value}
                        options={this.state.options}
                        onChange={this.onChange}
                    />
                    <Button
                        buttonStyle={styles.buttonStyle}
                        title='Done'
                        onPress={(e) => this.handleSubmit(e, onSubmit)}
                    />
                </KeyboardAwareScrollView>
            </View>
        );
    }
}

export {AddStopFormContainer};
