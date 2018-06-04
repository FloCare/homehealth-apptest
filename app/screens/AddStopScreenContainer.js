import React, {Component} from 'react';
import firebase from 'react-native-firebase';
import {AddStopScreen} from '../components/AddStopScreen';
import {screenNames} from '../utils/constants';

class AddStopScreenContainer extends Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }

    onNavigatorEvent(event) {
        // STOP GAP solution. Will be removed when redux is used
        if(event.id === 'didAppear') {
            firebase.analytics().setCurrentScreen(screenNames.addStop, screenNames.addStop);
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
        const {edit, values} = this.props;
        if (values) {
            return (
                <AddStopScreen
                    onSubmit={this.onSubmit}
                    edit={edit}
                    placeID={values.placeID}
                    addressID={values.addressID}
                    streetAddress={values.streetAddress}
                    lat={values.lat}
                    long={values.long}
                    zip={values.zip}
                    city={values.city}
                    state={values.state}
                    country={values.country}
                    stopName={values.stopName}
                    primaryContact={values.primaryContact}
                />
            );
        } else {
            return (
                <AddStopScreen
                    onSubmit={this.onSubmit}
                />
            );
        }
    }
}

export default AddStopScreenContainer;
