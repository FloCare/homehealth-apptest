import React, { Component } from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-elements';
import styles from './styles';
import { AddPatientForm } from '../AddPatientForm';

class AddPatientScreen extends Component {
    /*
        Presentational component - has for a form and button as children
     */
    constructor(props) {
        super(props);
        //this.state = { value: {} };
        //this.formValues = React.createRef();
        //this.handleSubmit = this.handleSubmit.bind(this);
    }

    // handleSubmit() {
    //     console.log('hello');
    //     console.log(Object.getOwnPropertyNames(this.formValues.current.refs.input.refs.name.refs.input));
    //     console.log('bye');
    //     //const value = this.refs.addPatientForm.getValue();
    //     //console.log('value: ', value);
    // }

    render() {
        return (
            <View style={styles.containerStyle}>
                <AddPatientForm
                    refName={this.props.onSubmit}
                />
                <Button
                    styles={styles.buttonStyle}
                    title='Save'
                    onPress={this.handleSubmit}
                />
            </View>
        );
    }
}

export { AddPatientScreen };
