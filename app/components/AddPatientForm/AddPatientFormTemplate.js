import React from 'react';
import {View} from 'react-native';

const PatientFormTemplate = (locals) => {
    return (
        <View>
            <View style={styles.margin}>
                {locals.inputs.name}
            </View>
            <View style={styles.margin}>
                {locals.inputs.streetAddress}
            </View>
            <View style={{...styles.container, ...styles.margin}}>
                <View style={styles.field}>
                    {locals.inputs.apartmentNo}
                </View>
                <View style={styles.field}>
                    {locals.inputs.zip}
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
            <View style={styles.margin}>
                {locals.inputs.emergencyContact}
            </View>
            <View style={{...styles.margin, marginBottom: 30}}>
                {locals.inputs.notes}
            </View>
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
