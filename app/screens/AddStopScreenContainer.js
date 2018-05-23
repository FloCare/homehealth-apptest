import React, {Component} from 'react';
import firebase from 'react-native-firebase';
import {AddStopScreen} from '../components/AddStopScreen';
import {screenNames} from '../utils/constants';

class AddStopScreenContainer extends Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        firebase.analytics().setCurrentScreen(screenNames.addStop, screenNames.addStop);
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
