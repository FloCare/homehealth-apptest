import React, {Component} from 'react';
import {AddNoteScreen} from '../components/AddNoteScreen';

class AddNoteScreenContainer extends Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
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
