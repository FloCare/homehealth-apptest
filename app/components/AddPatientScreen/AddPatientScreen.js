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
            firstName,
            lastName,
            streetAddress,
            zipCode,
            city,
            state,
            country,
            apartmentNo,
            primaryContact,
            notes,
            lat,
            long,
            dateOfBirth,
            emergencyContactInfo
        } = this.props;
        return (
            <View style={styles.containerStyle}>
                <AddPatientFormContainer
                    onSubmit={onSubmit}
                    edit={edit}
                    patientID={patientID}
                    addressID={addressID}
                    firstName={firstName}
                    lastName={lastName}
                    streetAddress={streetAddress}
                    apartmentNo={apartmentNo}
                    zipCode={zipCode}
                    city={city}
                    state={state}
                    country={country}
                    primaryContact={primaryContact}
                    notes={notes}
                    lat={lat}
                    long={long}
                    dateOfBirth={dateOfBirth}
                    emergencyContactInfo={emergencyContactInfo}
                />
            </View>
        );
    }
}

export {AddPatientScreen};
