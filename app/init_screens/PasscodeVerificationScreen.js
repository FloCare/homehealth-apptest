import React, {Component} from 'react';
import CodeInput from 'react-native-confirmation-code-input';
import RNSecureKeyStore from 'react-native-secure-key-store';
import {View, Image, StyleSheet, Text, Alert} from 'react-native';
import Header from '../components/common/Header';
import StartApp from '../screens/App';
import {Images} from '../Images';


class PasscodeVerificationScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showMessage: false
    };
    this.props = props;
    this.verifyCode = this.verifyCode.bind(this);
  }

  verifyCode(code) {
    if (code.length === 4) {
      RNSecureKeyStore.get('passCode')
      .then((res) => {
        if (res === code) {
          // Todo: Check if Encryption key should be a function of passcode
          // Fetch the encryption key
          if (this.props.inactivity) {
            this.props.navigator.dismissModal({
              animationType: 'none'
            });
            console.log('reset the timer here');
            return;
          } else {
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
              console.log(err);
              Alert.alert('Error', 'Unable to retrieve data');
            });
          }
        } else {
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
      return (<Text style={styles.alertMessageStyle}>Invalid passcode</Text>);
    }
  }

  render() {
    console.log('Hello world');
    return (
        <View style={{flex: 1, backgroundColor: '#ffffff'}}>
            <View style={styles.welcomeTextStyle}>
               <Header titleText='Enter Passcode' />
            </View>
            <Image 
               style={styles.stretch}
               source={Images.secureAccessImage}
            /> 
            <View>
              <CodeInput
                codeLength={4}
                secureTextEntry
                ref="verificationRef"
                activeColor='grey'
                inactiveColor='grey'
                autoFocus
                keyboardType='numeric'
                ignoreCase
                inputPosition='center'
                onFulfill={(code) => this.verifyCode(code)}
              />
            </View>
            <View style={styles.alertViewStyle}>
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
  alertViewStyle: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  alertMessageStyle: {
    marginTop: 20,
    fontSize: 12,
    color: 'red',
    justifyContent: 'center',
    alignItems: 'center'
  },
  welcomeTextStyle: {  
    margin: 10,
    marginBottom: 20,
    marginTop: 10,
  }
});

export default PasscodeVerificationScreen;
