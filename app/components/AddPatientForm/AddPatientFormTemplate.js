import React from 'react';
import {View} from 'react-native';

const PatientFormTemplate = (locals) => {
    return (
        <View>
            <View style={{...styles.container, ...styles.margin}}>
                <View style={styles.field}>
                    {locals.inputs.firstName}
                </View>
                <View style={styles.field}>
                    {locals.inputs.lastName}
                </View>
            </View>
            <View style={styles.margin}>
                {locals.inputs.streetAddress}
            </View>
            <View style={{...styles.container, ...styles.margin}}>
                <View style={styles.field}>
                    {locals.inputs.apartmentNo}
                </View>
                <View style={styles.field}>
                    {locals.inputs.zipCode}
                </View>
            </View>
            <View style={{...styles.container, ...styles.margin}}>
                <View style={styles.field}>
                    {locals.inputs.city}
                </View>
                <View style={styles.field}>
                    {locals.inputs.state}
                </View>
            </View>
            <View style={styles.margin}>
                {locals.inputs.primaryContact}
            </View>
            <View style={{...styles.margin}}>
                {locals.inputs.notes}
            </View>
            {
                locals.value.showDateOfBirth &&
                <View style={{...styles.margin}}>
                    {locals.inputs.dateOfBirth}
                </View>
            }
            {
                locals.value.showEmergencyContact &&
                <View style={{...styles.margin}}>
                    {locals.inputs.emergencyContactInfo}
                </View>
            }
        </View>
    );
};

const styles = {
    container: {
        flexDirection: 'row',
    },
    field: {
        flex: 1,
        paddingRight: 20,
    },
    margin: {
        marginTop: 10
    }
};

export default PatientFormTemplate;
