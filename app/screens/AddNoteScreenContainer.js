import React, {Component} from 'react';
import {AddNoteScreen} from '../components/AddNoteScreen';
import {screenNames} from '../utils/constants';

class AddNoteScreenContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            navigateToScreen: screenNames.patientDetails,
        };
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(patientId) {
        // Todo: navigate away based on state
        // Todo: Pass data accordingly
        this.props.navigator.push({
            screen: this.state.navigateToScreen,
            animated: true,
            animationType: 'fade',
            title: 'Patients',
            backbuttonHidden: true,
            passProps: {
                patientId
            }
        });
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
