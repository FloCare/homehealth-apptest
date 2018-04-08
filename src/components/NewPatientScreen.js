import React, {Component} from 'react';
import {Input} from './common';
import * as PatientDAO from '../data/patientDAO'
import {ScrollView, Text, View} from "react-native";
import {Header} from "./common/Header";
import {Button} from "./common/Button";

var uuid = require('uuid/v4');

export default class NewPatientForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            patient: {
                patientID: uuid(),
                name: '',
                streetAddress: '',
                zipCode: '',
                city: '',
                diagnosis: '',
                primaryContact: '',
                emergencyContact: '',
                notes: ''
            }
        };
    }

    enableSave() {
        if (this.state.patient.name === '' ||
            this.state.patient.streetAddress === '' ||
            this.state.patient.zipCode === '' ||
            this.state.patient.diagnosis === '' ||
            this.state.patient.primaryContact === ''
        )
            return false
        return true;
    }

    render() {
        return (
            <View style={{flexGrow: 1, padding: 0}}>
                <Header headerText='Authentication'/>
                {this.getForm()}
                <View style={styles.buttonContainer}>
                    <Button
                        title='Save'
                        onPress={() => {
                            console.log(this.state);
                            PatientDAO.writePatientToDB(this.state.patient)
                        }}
                        buttonStyle={styles.buttonStyle}
                    />
                </View>
            </View>
        );
    }

    getForm() {
        return (
            <View style={{flex: 1, paddingBottom: 40}}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{margin: 8, flexGrow: 1}}>
                    <Input
                        label="Patient Name"
                        placeholder="John Derp"
                        value={this.state.patient.name}
                        onChangeText={(text) => {
                            let newPatient = Object.assign({}, this.state.patient, {name: text});
                            this.setState({patient: newPatient})
                        }}
                    />
                    <Input
                        label="Street Address"
                        placeholder="123, Alphabet drive"
                        value={this.state.patient.streetAddress}
                        onChangeText={(text) => {
                            let newPatient = Object.assign({}, this.state.patient, {phoneNumber: text});
                            this.setState({patient: newPatient})
                        }}
                    />
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        <Input
                            label="Zip Code"
                            placeholder="12345-1234"
                            value={this.state.patient.zipCode}
                            disabled={this.state.patient.zipCode === ''}
                            type="zipcode"
                            downMargin={20}
                            onChangeText={(text) => {
                                let newPatient = Object.assign({}, this.state.patient, {zipCode: text});
                                this.setState({patient: newPatient})
                            }}
                        />
                        <Input
                            containerSt
                            label="City, State"
                            placeholder="Los Angeles, California"
                            value={this.state.patient.city}
                            onChangeText={(text) => {
                                let newPatient = Object.assign({}, this.state.patient, {city: text});
                                this.setState({patient: newPatient})
                            }}
                        />
                    </View>
                    <Input
                        label="Primary Contact"
                        placeholder="(425) 555-1212"
                        value={this.state.patient.primaryContact}
                        type="phone"
                        onChangeText={(text) => {
                            let newPatient = Object.assign({}, this.state.patient, {primaryContact: text});
                            this.setState({patient: newPatient})
                        }}
                    />
                    <Input
                        label="Emergency Contact"
                        placeholder="(425) 555-1212"
                        value={this.state.patient.emergencyContact}
                        onChangeText={(text) => {
                            let newPatient = Object.assign({}, this.state.patient, {emergencyContact: text});
                            this.setState({patient: newPatient})
                        }}
                    />
                    <Input
                        label="Diagnosis"
                        placeholder="Diagnosis"
                        value={this.state.patient.diagnosis}
                        onChangeText={(text) => {
                            let newPatient = Object.assign({}, this.state.patient, {diagnosis: text});
                            this.setState({patient: newPatient})
                        }}
                    />
                    <Input
                        label="Notes"
                        placeholder="Any important information about the patient."
                        value={this.state.patient.notes}
                        onChangeText={(text) => {
                            let newPatient = Object.assign({}, this.state.patient, {notes: text});
                            this.setState({patient: newPatient})
                        }}
                    />
                </ScrollView>
            </View>
        );
    }
}

const styles = {
    buttonStyle: {
        padding: 0,
        backgroundColor: "rgb(52,218,146)",
        margin: 0,
        right: 0,
        left: 0
    },
    buttonContainer: {
        flex: 1,
        position: 'absolute',
        bottom: 0,
        padding: 0,
        left: 0,
        right: 0,
    }
};
