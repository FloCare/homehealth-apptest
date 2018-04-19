import React from 'react';
import {View, Text} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

function Autocompletetextbox(locals) {
    console.log('========================================');
    console.log('INSIDE AUTOCOMPLETETEXTBOX1');
    console.log('========================================');

    if (locals.hidden) {
        return null;
    }

    var stylesheet = locals.stylesheet;
    var formGroupStyle = stylesheet.formGroup.normal;
    var controlLabelStyle = stylesheet.controlLabel.normal;
    var textboxStyle = stylesheet.textbox.normal;
    var textboxViewStyle = stylesheet.textboxView.normal;
    var helpBlockStyle = stylesheet.helpBlock.normal;
    var errorBlockStyle = stylesheet.errorBlock;

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

    var label = locals.label ? (
        <Text style={controlLabelStyle}>{locals.label}</Text>
    ) : null;
    var help = locals.help ? (
        <Text style={helpBlockStyle}>{locals.help}</Text>
    ) : null;
    var error =
        locals.hasError && locals.error ? (
            <Text accessibilityLiveRegion="polite" style={errorBlockStyle}>
                {locals.error}
            </Text>
        ) : null;

    console.log('========================================');
    console.log('INSIDE AUTOCOMPLETETEXTBOX2');
    console.log('========================================');
    return (
        <View style={formGroupStyle}>
            {label}
            <View style={textboxViewStyle}>
                <GooglePlacesAutocomplete
                    placeholder='Enter Location'
                    minLength={2}
                    autoFocus={false}
                    returnKeyType={'default'}
                    fetchDetails={true}
                    query={{
                        key: 'AIzaSyDiWZ3198smjFepUa0ZAoHePSnSxuhTzRU'
                    }}
                    styles={{
                        textInputContainer: {
                            backgroundColor: 'rgba(0,0,0,0)',
                            borderTopWidth: 0,
                            borderBottomWidth:0
                        },
                        textInput: {
                            marginLeft: 0,
                            marginRight: 0,
                            height: 38,
                            color: '#5d5d5d',
                            fontSize: 16
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
                    onPress={(data, details = null) =>{
                        console.log('=============================================');
                        console.log('Data');
                        console.log(data);
                        console.log('=============================================');
                        console.log('Details');
                        console.log(details);
                        console.log('=============================================');
                        console.log('LatLong Object: ', details.geometry.location);
                        const arrLen = details.address_components.length;
                        console.log('Address Components: ');
                        if (details.address_components[arrLen-1]['types'][0] === 'postal_code') {
                            console.log('Zip Code: ', details.address_components[arrLen-1].long_name);
                        } else {
                            console.log('Last component is not a postal address');
                        }
                        console.log('=============================================');
                    }}
                />
            </View>
            {help}
            {error}
        </View>
    );
}

export default Autocompletetextbox;
