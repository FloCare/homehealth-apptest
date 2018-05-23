import React, {Component} from 'react';
import firebase from 'react-native-firebase';
import {AddNoteScreen} from '../components/AddNoteScreen';
import {screenNames} from '../utils/constants';

class AddNoteScreenContainer extends Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        firebase.analytics().setCurrentScreen(screenNames.addNote, screenNames.addNote);
    }

    onSubmit() {
        console.log('Navigating away from Notes screen');
        this.props.navigator.pop();
    }

    render() {
        const {patientId, name} = this.props;
        return (
            <AddNoteScreen
                onSubmit={this.onSubmit}
                patientId={patientId}
                name={name}
            />
        );
    }
}

export default AddNoteScreenContainer;
