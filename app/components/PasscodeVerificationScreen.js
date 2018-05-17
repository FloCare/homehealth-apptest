import React, {Component} from 'react';
import CodeInput from 'react-native-confirmation-code-input';
import RNSecureKeyStore from 'react-native-secure-key-store';
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
      RNSecureKeyStore.get('passCode')
      .then((res) => {
        if (res === code) {
          this.props.navigator.pop();
        }
        else {
          this.setState({ 
            showMessage: true
          });
          this.refs.verificationRef.clear();
        }
      }, (err) => {
        console.log(err);
      });
    }
  }

  renderView() {
    if (this.state.showMessage) {
      return (<Text style={styles.alertMessageStyle}> Invalid invite code </Text>);
    }
  }

  render() {
    return (
        <View>
            <View style={styles.welcomeTextStyle}>
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
                      ref="verificationRef"
                      activeColor='grey'
                      inactiveColor='grey'
                      autoFocus={true}
                      ignoreCase={true}
                      inputPosition='center'
                      onFulfill={(code) => this.verifyCode(code)}
                      />
            </View>
            <View style={styles.alertMessageStyle}>
                {this.renderView()}
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
  alertMessageStyle: {
    marginTop: 20,
    fontSize: 12,
    color: 'red',
    justifyContent: 'center',
    alignItems: 'center'
  },
  welcomeTextStyle: {  
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    marginBottom: 20,
    marginTop: 10,
  }
});

