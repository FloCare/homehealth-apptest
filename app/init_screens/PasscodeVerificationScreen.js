import React, {Component} from 'react';
import CodeInput from 'react-native-confirmation-code-input';
import RNSecureKeyStore from 'react-native-secure-key-store';
//import UserInactivity from 'react-native-user-inactivity';
import {View, Image, StyleSheet} from 'react-native';
import Header from '../components/common/Header';
import StartApp from '../screens/App';


class PasscodeVerificationScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      timeWentInactive: null,
    };
    this.onInactivity = this.onInactivity.bind(this);
    this.verifyCode = this.verifyCode.bind(this);
  }

  onInactivity = (timeWentInactive) => {
    this.setState({
      timeWentInactive,
    });
    //this.props.navigator.pop();
  }

  verifyCode(code) {
    if (code.length === 4) {
      RNSecureKeyStore.get('passCode')
      .then((res) => {
        if (res === code) {
          console.log('=====================================');
          console.log('Passcode Correct !!!!');
          console.log('=====================================');
          // TODO: Logic for passcode being right
          StartApp();
          // Fetch enc key
          // Register new screens here
          

          // Todo: Check if Encryption key should be a function of passcode
          // Fetch the encryption key
          // RNSecureKeyStore.get('encryptionKey')
          //   .then((k) => {
          //     // Connect to realm

          //     // Navigate to the App
          //   }, (err) => {
          //     // Todo: Raise the error to the app
          //     console.log(err);
          //   });
        } else {
          //TODO Handle the logic when the passcode is not right
          console.log('=====================================');
          console.log('Incorrect Passcode.');
          console.log('=====================================');
        }
      }, (err) => {
        console.log(err);
      });
    }
  }

  render() {
    console.log('Hello world');
    return (
        <View>
            <View style={styles.welcome}>
               <Header titleText='Enter Passcode' />
            </View>
            <Image 
               style={styles.stretch}
               source={require('../../resources/secureAccessImg.png')}
            /> 
            <View >
              <CodeInput
                      codeLength = '4'
                      secureTextEntry
                      activeColor='grey'
                      inactiveColor='grey'
                      autoFocus={true}
                      ignoreCase={true}
                      inputPosition='center'
                      onFulfill={(code) => this.verifyCode(code)}
                      />
            </View>
        </View>
    );   
  }
}

const styles = StyleSheet.create({
  signupPageColor: {
    backgroundColor: '#ffffff',
  },
  stretch: {
    alignSelf: 'center',
    width: 100,
    height: 100,
  },
  welcome: {  
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    marginBottom: 20,
    marginTop: 10,
  }
});

export default PasscodeVerificationScreen;
