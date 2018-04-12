import React, { Component } from 'react';
import {View, Text} from "react-native";

var uuid = require('uuid/v4');

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
            <View>
                <Text>
                    Hello Everyone
                </Text>
            </View>
        );
    }
}
