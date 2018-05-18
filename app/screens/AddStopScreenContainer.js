import React, {Component} from 'react';
import {AddStopScreen} from '../components/AddStopScreen';
import {screenNames} from '../utils/constants';

class AddStopScreenContainer extends Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    onNavigatorEvent(event) {
        if(event.id === 'didAppear') {
            this.timeout = setTimeout(() => {
                this.props.navigator.showModal({
                    screen: screenNames.passcodeVerificationScreen,
                    backButtonHidden: true,
                    passProps: {
                        inactivity: true
                    }
                });
            }, 30000);
        }
        if(event.id === 'didDisappear') {
            clearTimeout(this.timeout);
        }
    }

    onSubmit() {
        //console.log('Navigating away from Stops screen');
        this.props.navigator.pop();
        if (this.props.onStopAdd) {
            this.props.onStopAdd();
        }
    }

    render() {
        return (
            <AddStopScreen
                onSubmit={this.onSubmit}
            />
        );
    }
}

export default AddStopScreenContainer;
