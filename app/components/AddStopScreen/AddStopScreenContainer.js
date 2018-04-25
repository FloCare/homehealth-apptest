import React, {Component} from 'react';
import {View} from 'react-native';
import AddStopFormContainer from '../AddStopForm';
import styles from './styles';

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
        return (
            <View style={styles.containerStyle}>
                <AddStopFormContainer
                    onSubmit={this.onSubmit}
                />
            </View>
        );
    }
}

export {AddNoteScreenContainer};
