import React, {Component} from 'react';
import {View, ActivityIndicator, Modal, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#00000040'
    },
    activityIndicatorWrapper: {
        backgroundColor: '#FFFFFF',
        height: 80,
        width: 80,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'space-around'
    }
});

export default class LoadingModal extends Component {
    render() {
        return (
            <Modal
                transparent
                animationType={'none'}
                visible={this.props.loading}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.activityIndicatorWrapper}>
                        <ActivityIndicator
                            animating={this.props.loading}
                        />
                    </View>
                </View>
            </Modal>
        );
    }
}