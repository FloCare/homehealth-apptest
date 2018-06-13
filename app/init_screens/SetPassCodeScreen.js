import React, {Component} from 'react';
import RNSecureKeyStore from 'react-native-secure-key-store';
import LinearGradient from 'react-native-linear-gradient';
import firebase from 'react-native-firebase';
import VirtualKeyboard from 'react-native-virtual-keyboard';
import {StyleSheet, Text, View, Image, Alert, AsyncStorage, Dimensions} from 'react-native';
import StartApp from '../screens/App';
import {Images} from '../Images';
import {screenNames, eventNames, parameterValues, PrimaryColor, PrimaryFontFamily} from '../utils/constants';

//const Realm = require('realm');

class SetPassCodeScreen extends Component {

    static navigatorStyle = {
        navBarHidden: true
    };

    constructor(props) {
        super(props);
        this.state = {
            code: ''
        };
        this.setPasscode = this.setPasscode.bind(this);
        this.setKey = this.setKey.bind(this);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }

    onNavigatorEvent(event) {
        // STOP GAP solution. Will be removed when redux is used
        if (event.id === 'didAppear') {
            firebase.analytics().setCurrentScreen(screenNames.setPassCodeScreen, screenNames.setPassCodeScreen);
        }
    }

    setKey() {
        console.log('Trying to set the key ...');
        const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
        let randomString = '';
        const key = new Int8Array(64);
        for (let i = 0; i < key.length; i++) {
            const rnum = Math.floor(Math.random() * chars.length);
            randomString += chars.substring(rnum, rnum + 1);
        }

        RNSecureKeyStore.set('flokey', randomString)
            .then((res) => {
                console.log(res);
                try {
                    StartApp(randomString);
                } catch (err) {
                    console.log('Error in starting app:', err);
                    Alert.alert('Error', 'Unable to retrieve data');
                }
            }, (err) => {
                console.log(err);
                Alert.alert('Error', 'Unable to start the app');
            });
    }

// Secure the entered passcode in the keystore
    setPasscode(passcode) {
        // Save the passcode to keystore
        RNSecureKeyStore.set('passCode', passcode)
            .then((res) => {
                console.log('Updated the passcode to:', passcode);
                // Open VerifyPasscode Screen next time
                AsyncStorage.setItem('isFirstVisit', 'false');
                firebase.analytics().logEvent(eventNames.PASSCODE, {
                    status: parameterValues.SUCCESS
                });

                // if key already set, use it
                console.log('Trying to get the key ...');
                RNSecureKeyStore.get('flokey')
                    .then((k) => {
                        // Connect to realm, Register new screens
                        // Navigate to the Tab Based App
                        try {
                            StartApp(k);
                        } catch (e) {
                            console.log('Error in starting app:', e);
                            Alert.alert('Error', 'Unable to retrieve data');
                        }
                    }, (err) => {
                        console.log('Key not already set', err);
                        this.setKey();
                    });
            }, (err) => {
                console.log(err);
                firebase.analytics().logEvent(eventNames.PASSCODE, {
                    status: parameterValues.FAILURE
                });
                Alert.alert('Error', 'Unable to update passcode');
                return;
            });
    }

    onChangeCode(code) {
        this.setState({code});
        if (code.length === 4) { this.setPasscode(code); }
    }

    generateCodeDisplayArea() {
        const dotArray = [];
        for (let i = 0; i < 4; i++) {
            if (this.state.code.length > i) { dotArray.push(<Text style={{color: 'white', fontSize: 60, fontWeight: '500', marginHorizontal: 10}}>*</Text>); } else dotArray.push(<Text style={{color: 'rgba(255,255,255,0.3)', fontSize: 60, fontWeight: '500', marginHorizontal: 10}}>*</Text>);
        }
        return (
            <View
                style={{flexDirection: 'row'}}
            >
                {dotArray[0]}
                {dotArray[1]}
                {dotArray[2]}
                {dotArray[3]}
            </View>
        );
    }

    render() {
        const primaryColor = PrimaryColor;
        const secondary = '#34da92';
        const {width, height} = Dimensions.get('window');
        return (
            <LinearGradient
                colors={[primaryColor, secondary]}
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                }}
            >
                {/*<KeyboardAwareScrollView>*/}
                    <View>
                        <Text style={styles.headerSectionStyle}>
                            Let's secure the app
                        </Text>
                    </View>
                    <View>
                        <Text style={styles.topSectionStyle}>
                            Set a Passcode
                        </Text>
                    </View>
                    <View>
                        <Text style={styles.middleSectionStyle}>
                            Note: Once set, the passcode cannot be changed
                        </Text>
                    </View>
                    {/*<View>*/}
                        {/*<Image*/}
                            {/*style={styles.stretch}*/}
                            {/*source={Images.verificationCode}*/}
                        {/*/>*/}
                    {/*</View>*/}
                    {/*{this.generateCodeDisplayArea()}*/}

                    <View
                        style={{flexDirection: 'row'}}
                    >
                        <Text style={{color: this.state.code.length > 0 ? 'white' : 'rgba(255,255,255,0.3)', fontSize: 60, fontWeight: '500', marginHorizontal: 10}}>*</Text>
                        <Text style={{color: this.state.code.length > 1 ? 'white' : 'rgba(255,255,255,0.3)', fontSize: 60, fontWeight: '500', marginHorizontal: 10}}>*</Text>
                        <Text style={{color: this.state.code.length > 2 ? 'white' : 'rgba(255,255,255,0.3)', fontSize: 60, fontWeight: '500', marginHorizontal: 10}}>*</Text>
                        <Text style={{color: this.state.code.length > 3 ? 'white' : 'rgba(255,255,255,0.3)', fontSize: 60, fontWeight: '500', marginHorizontal: 10}}>*</Text>
                    </View>
                    <View style={{width, height: height * 0.5}}>
                        <VirtualKeyboard
                            color='white'
                            pressMode='string'
                            onPress={(val) => this.onChangeCode(val)}
                            style={{
                                container: {
                                    flex: 1,
                                    flexDirection: 'column',
                                    // marginLeft: 0,
                                    // marginRight: 0,
                                },
                                row: {
                                    flex: 1
                                },
                                number: {
                                    fontFamily: 'SFProText',
                                    fontSize: 35,
                                }
                            }}
                        />
                    </View>
                {/*</KeyboardAwareScrollView>*/}
            </LinearGradient>
        );
    }
}

const styles = StyleSheet.create({
    headerSectionStyle: {
        color: 'white',
        fontFamily: PrimaryFontFamily,
        fontSize: 24,
        fontWeight: '500',
        textAlign: 'center',
        margin: 10,
        marginTop: 50,
    },
    topSectionStyle: {
        color: 'white',
        fontFamily: PrimaryFontFamily,
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
        marginBottom: 5,
    },
    middleSectionStyle: {
        color: 'white',
        fontFamily: PrimaryFontFamily,
        fontSize: 12,
        textAlign: 'center',
        margin: 10,
        marginBottom: 10,
        marginTop: 10,
    },
    stretch: {
        alignSelf: 'center',
        width: 150,
        height: 150,
        marginBottom: 10,
    }
});

export {SetPassCodeScreen};

