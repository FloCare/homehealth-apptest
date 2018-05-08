import React, {Component} from 'react';
import {View} from 'react-native';
import {AddPatientFormContainer} from '../AddPatientForm';
import styles from './styles';

class AddPatientScreen extends Component {
    /*
        Presentational component - has for a form and button as children
     */
    render() {
        const {
            onSubmit,
            edit,
            patientID,
            addressID,
            name,
            streetAddress,
            zip,
            city,
            state,
            country,
            apartmentNo,
            primaryContact,
            emergencyContact,
            notes,
            lat,
            long
        } = this.props;
        return (
            <View style={styles.containerStyle}>
                <AddPatientFormContainer
                    onSubmit={onSubmit}
                    edit={edit}
                    patientID={patientID}
                    addressID={addressID}
                    name={name}
                    streetAddress={streetAddress}
                    apartmentNo={apartmentNo}
                    zip={zip}
                    city={city}
                    state={state}
                    country={country}
                    primaryContact={primaryContact}
                    emergencyContact={emergencyContact}
                    notes={notes}
                    lat={lat}
                    long={long}
                />
            </View>
        );
    }
}

export {AddPatientScreen};
