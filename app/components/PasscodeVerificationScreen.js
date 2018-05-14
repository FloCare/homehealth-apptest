import React, {Component} from 'react';
import OtpInputs from 'react-native-otp-inputs';
// import RNSecureKeyStore from 'react-native-secure-key-store';
import UserInactivity from 'react-native-user-inactivity';
import {View, Image, StyleSheet, Text} from 'react-native';
import Header from './common/Header';


export class PasscodeVerificationScreen extends Component {

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
    this.props.navigator.pop();
  }

  verifyCode(code) {
    if (code.length === 4) {
      // RNSecureKeyStore.get('passCode')
      // .then((res) => {
      //   console.log('@@@@@@@@@@@@@@@@@@@@@@@@');
      //   console.log(res);
      //   if (res === code) {
      //     this.props.navigator.pop();
      //   }
      // }, (err) => {
      //   console.log(err);
      // });
    }
  }

  render() {
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
                <OtpInputs handleChange={code => this.verifyCode(code)} numberOfInputs={4} />
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

