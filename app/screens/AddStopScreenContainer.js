import React, {Component} from 'react';
import {AddStopScreen} from '../components/AddStopScreen';

class AddStopScreenContainer extends Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
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
