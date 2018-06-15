import React, {Component} from 'react';
import {View} from 'react-native';
import firebase from 'react-native-firebase';
import {Button} from 'react-native-elements';
import t from 'tcomb-form-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import {Options} from './AddStopFormModel';
import {ParseGooglePlacesAPIResponse} from '../../utils/parsingUtils';
import {eventNames} from '../../utils/constants';
import {placeDataService} from '../../data_services/PlaceDataService';

const Form = t.form.Form;

class AddStopFormContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: {
                placeID: props.placeID || null,
                addressID: props.addressID || null,
                streetAddress: props.streetAddress || null,
                lat: props.lat || null,
                long: props.long || null,
                zipCode: props.zipCode || null,
                city: props.city || null,
                state: props.state || null,
                country: props.country || null,
                stopName: props.stopName || null,
                primaryContact: props.primaryContact || null,
            },
            modelType: this.getType(props.streetAddress),
        };
        this.edit = props.edit || false;
        this.onChangeAddressText = this.onChangeAddressText.bind(this);
        this.clearForm = this.clearForm.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.setForm = this.setForm.bind(this);
        this.onChange = this.onChange.bind(this);
        this.getType = this.getType.bind(this);
        this.onAddressSelect = this.onAddressSelect.bind(this);
        this.getDefaultValue = this.getDefaultValue.bind(this);

        this.options = new Options();
        this.options.OnPress = this.onAddressSelect;
        this.options.OnChangeAddressText = this.onChangeAddressText;
        this.options.RefName = this.setForm;
        this.options.GetDefaultValue = this.getDefaultValue;
    }

    onChange(value, path) {
        console.log('value:', value, 'path:', path);
        console.log('value.streetAddress: ', value.streetAddress);

        // Change type and options if address changed
        if (path.indexOf('streetAddress') > -1) {
            const type = this.getType(value.streetAddress);
            //const options = this.getOptions(value.streetAddress);
            this.setState({
                modelType: type
            });
        }

        this.setState({
            value
        });
    }

    onChangeAddressText(value) {
        console.log('Address Text Changed:', value);
        const val = Object.assign({}, this.state.value, {streetAddress: value});
        const type = this.getType(value);
        this.setState({
            value: val,
            modelType: type
        });
    }

    onAddressSelect(data, details) {
        // Todo: Handle OFFLINE flow
        const resp = ParseGooglePlacesAPIResponse(data, details);
        const {streetAddress, city, stateName, zipCode, country, lat, long} = resp;

        const value = Object.assign({}, this.state.value, {streetAddress, zipCode, city, state: stateName, country, lat, long});
        this.setState({value});
    }

    setForm(element) {
        this.addStopForm = element;
        return this.addStopForm;
    }

    getType(streetAddress) {
        if (streetAddress && streetAddress.length > 0) {
            return t.struct({
                streetAddress: t.String,
                primaryContact: t.maybe(t.String),
                stopName: t.String
            });
        } else {
            return t.struct({
                streetAddress: t.String
            });
        }
    }

    getDefaultValue() {
        return this.state.value.streetAddress || '';
    }

    clearForm() {
        this.setState({
            value: {
                streetAddress: null,
                lat: null,
                long: null,
                zipCode: null,
                city: null,
                state: null,
                country: null,
                stopName: null,
                primaryContact: null
            },
            modelType: this.getType()
        });
        //this.addStopForm.setAddressText('');
    }

    handleSubmit(e, onSubmit) {
        const value = this.addStopForm.getValue();

        // Todo Doesn't make sense for the remember me currently, hence removing it
        if (value) {
            let placeId = null;
            if (this.edit) {
                // update the changed fields in the database
                console.log('Updating fields in the db');
                placeId = this.state.value.placeID;

                try {
                    placeDataService.editExistingPlace(placeId, this.state.value);
                } catch (err) {
                    console.log('Error on Stop editing: ', err);
                    // Todo: Raise an error to the screen
                    return;
                }
            } else {
                try {
                    placeDataService.createNewPlace(this.state.value);
                    firebase.analytics().logEvent(eventNames.ADD_STOP, {});
                    console.log('Save to DB successful');
                } catch (err) {
                    console.log('Error on Stop addition: ', err);
                    // Todo Don't fail silently, raise and alarm
                }
            }
        }
        this.clearForm();
        onSubmit();
    }

    render() {
        const {onSubmit} = this.props;
        return (
            <View style={styles.containerStyle}>
                <KeyboardAwareScrollView
                    style={styles.formScrollViewStyle}
                    keyboardShouldPersistTaps='handled'
                >
                    <Form
                        ref={this.setForm}
                        type={this.state.modelType}
                        value={this.state.value}
                        options={this.options.Options}
                        onChange={this.onChange}
                    />
                </KeyboardAwareScrollView>
                <Button
                    disabled={(!(this.state.value.streetAddress)) || (!(this.state.value.stopName))}
                    containerViewStyle={{marginLeft: 0, marginRight: 0}}
                    buttonStyle={styles.buttonStyle}
                    title='Done'
                    onPress={(e) => this.handleSubmit(e, onSubmit)}
                />
            </View>
        );
    }
}

export {AddStopFormContainer};
