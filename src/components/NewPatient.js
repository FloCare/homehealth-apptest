import React, { Component } from 'react';
import { CardSection, Card, Input, Button } from './common';
import * as PatientDAO from '../data/patientDAO';

const uuid = require('uuid/v4');

export default class NewPatient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            patient: {
                patientID: uuid(),
                name: '',
                phoneNumber: '',
                diagnosis: ''
            },
            address: {
                lineOne: '',
                default: 'def'
            }
        };
    }

    render() {
        return (
            <Card>
                <CardSection>
                    <Input
                        label="Patient Name"
                        placeholder="John Derp"
                        value={this.state.patient.name}
                        onChangeText={(text) => {let newPatient = Object.assign({}, this.state.patient, { name: text }); this.setState({ patient: newPatient })}}
                    />
                </CardSection>

                <CardSection>
                    <Input
                        label="Phone Number"
                        placeholder="Phone Number"
                        value={this.state.patient.phoneNumber}
                        onChangeText={(text) => {let newPatient = Object.assign({}, this.state.patient, { phoneNumber: text }); this.setState({ patient: newPatient })}}
                    />
                </CardSection>

                <CardSection>
                    <Input
                        label="Address"
                        placeholder="Address"
                        value={this.state.address.lineOne}
                        onChangeText={(text) => this.setState({ address: { lineOne: text } })}
                    />
                </CardSection>

                <CardSection>
                    <Input
                        label="Diagnosis"
                        placeholder="Diagnosis"
                        value={this.state.patient.diagnosis}
                        onChangeText={(text) => {let newPatient = Object.assign({}, this.state.patient, { diagnosis: text }); this.setState({ patient: newPatient })}}
                    />
                </CardSection>

                <CardSection>
                    <Button onPress={() => {console.log(this.state); PatientDAO.writePatientToDB(this.state.patient)}}>
                        Save
                    </Button>
                    <Button>
                        Cancel
                    </Button>

                </CardSection>
                <CardSection>
                    <Button onPress={() => { console.log(PatientDAO.getAllLocalPatients()); }}>
                        Show realm on console
                    </Button>
                </CardSection>
            </Card>
        );
    }
}
