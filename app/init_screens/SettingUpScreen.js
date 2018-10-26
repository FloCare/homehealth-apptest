import React, {Component} from 'react';
import {Text, View, Image, StyleSheet, Alert} from 'react-native';
import {Images} from '../Images';
import {PrimaryColor, PrimaryFontFamily} from '../utils/constants';
import StartApp from '../screens/App';

export class SettingUpScreen extends Component {

    componentDidMount() {
        this.initialiseAndStartApp();
    }

    async initialiseAndStartApp() {
        try {
            await StartApp(this.props.startKey, true);
        } catch (err) {
            console.log('Error in starting app:', err);
            if (err.name === 'MissingNecessaryInternetConnection') {
                Alert.alert('Offline', 'Unable to start the app');
            } else {
                Alert.alert('Error', 'Unable to start the app');
            }
        }
    }

    render() {
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF'}}>
                <Text style={styles.textStyle}>
                    Flocare is setting up!
                </Text>
                <Image source={Images.loadingPlus} style={{marginTop: 20, marginBottom: 20, width: 150, height: 150, resizeMode: 'contain'}} />
                <Text style={{...styles.textStyle, fontSize: 16}}>
                    Loading Data...
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    textStyle: {
        fontSize: 30,
        color: PrimaryColor,
        fontFamily: PrimaryFontFamily,
        marginLeft: 40,
        marginRight: 40,
        textAlign: 'center'
    }
});
