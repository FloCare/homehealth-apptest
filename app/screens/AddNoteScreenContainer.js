import React, {Component} from 'react';
import {AddNoteScreen} from '../components/AddNoteScreen';
import {screenNames} from '../utils/constants';

class AddNoteScreenContainer extends Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    onNavigatorEvent(event) {
        // if(event.id === 'didAppear') {
        //     this.timeout = setTimeout(() => {
        //         this.props.navigator.showModal({
        //             screen: screenNames.passcodeVerificationScreen,
        //             backButtonHidden: true,
        //             passProps: {
        //                 inactivity: true
        //             }
        //         });
        //     }, 30000);
        // }
        // if(event.id === 'didDisappear') {
        //     clearTimeout(this.timeout);
        // }
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
