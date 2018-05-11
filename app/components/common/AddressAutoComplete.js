import React from 'react';
import {View, Text} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Config from 'react-native-config';
import {PrimaryFontFamily} from '../../utils/constants';

// Todo: CleanUp this template - pass relevant arguments to the GoogleAutocomplete component

function Autocompletetextbox(locals) {
   if (locals.hidden) {
        return null;
    }

    const stylesheet = locals.stylesheet;
    let formGroupStyle = stylesheet.formGroup.normal;
    let controlLabelStyle = stylesheet.controlLabel.normal;
    let textboxStyle = stylesheet.textbox.normal;
    let textboxViewStyle = stylesheet.textboxView.normal;
    let helpBlockStyle = stylesheet.helpBlock.normal;
    const errorBlockStyle = stylesheet.errorBlock;

    if (locals.hasError) {
        formGroupStyle = stylesheet.formGroup.error;
        controlLabelStyle = stylesheet.controlLabel.error;
        textboxStyle = stylesheet.textbox.error;
        textboxViewStyle = stylesheet.textboxView.error;
        helpBlockStyle = stylesheet.helpBlock.error;
    }

    if (locals.editable === false) {
        textboxStyle = stylesheet.textbox.notEditable;
        textboxViewStyle = stylesheet.textboxView.notEditable;
    }

    const label = locals.label ? (
        <Text style={controlLabelStyle}>{locals.label}</Text>
    ) : null;
    const help = locals.help ? (
        <Text style={helpBlockStyle}>{locals.help}</Text>
    ) : null;
    const error =
        locals.hasError && locals.error ? (
            <Text accessibilityLiveRegion="polite" style={errorBlockStyle}>
                {locals.error}
            </Text>
        ) : null;

    // Todo: Apply Country Filter: US ???
    return (
        <View style={formGroupStyle}>
            {label}
            <View style={textboxViewStyle}>
                <GooglePlacesAutocomplete
                    placeholder='32, Private Drive'
                    minLength={1}
                    autoFocus={false}
                    fetchDetails
                    query={{
                        key: Config.GOOGLE_API_KEY_PLACES
                    }}
                    textInputProps={{
                        onChangeText: locals.config.onChangeAddressText
                    }}
                    getDefaultValue={locals.config.getDefaultValue}
                    styles={{
                        textInputContainer: {
                            backgroundColor: 'rgba(0,0,0,0)',
                            borderTopWidth: 0,
                            borderBottomWidth: 0
                        },
                        textInput: {
                            ...textboxStyle,
                            marginLeft: 0,
                            marginRight: 0,
                            fontFamily: PrimaryFontFamily
                        },
                        predefinedPlacesDescription: {
                            color: '#1faadb'
                        },
                        poweredContainer: {
                            height: 0,
                            width: 0
                        },
                        powered: {
                            height: 0,
                            width: 0
                        }
                    }}
                    currentLocation={false}
                    onPress={locals.config.onPress}
                    ref={locals.config.refName}
                />
            </View>
            {help}
            {error}
        </View>
    );
}

export default Autocompletetextbox;
