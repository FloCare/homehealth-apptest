import React, {Component} from 'react';
import firebase from 'react-native-firebase';
import CodeInput from 'react-native-confirmation-code-input';
import {StyleSheet, Text, View} from 'react-native';
import {screenNames, userProperties, eventNames, parameterValues } from '../utils/constants';

// TODO Provide actual invite codes , move it to a backend later
const inviteCodes = ['1947', '2011', '1988', '2018', '7860', '3299', '5401', '1971', '1851', '2013', '8055', '1772', '9742', '6496', '1063', '4977', '8341', '5297', '6312', '2750', '1649', '1347', '9403', '8591', '1084', '7059', '9275', '3958', '7107', '9558', '5107'];

export class InviteScreen extends Component {

  state = {showMessage: false};

  componentDidMount() {
      firebase.analytics().setCurrentScreen(screenNames.InviteScreen, screenNames.InviteScreen);
  }
// TODO will be used in the Sign In Page to figure out if it is a first time visit
  // async componentDidMount() {
  //   try {
  //         const isFirstVisit = await AsyncStorage.getItem('isFirstVisit');
  //         if(isFirstVisit === 'false') {
  //           this.props.navigator.push({
  //           screen: screenNames.homeScreen,
  //           navigatorStyle: {
  //               tabBarHidden: true
  //           }
  //           });
  //         }
  //       } catch (error) {
  //           console.error('AsyncStorage error: ', error.message);
  //       }
  // }

// TODO Integrate Node email
  // sendEmail = () => {
  //   const {emailId, organizationName} = this.state;
  //   // const to = ['karthik@flocare.health']; // string or array of email addresses
  //   //     email.sendEmail(to, {
  //   //         // Optional additional arguments
  //   //         cc: [''], // string or array of email addresses
  //   //         bcc: '', // string or array of email addresses
  //   //         subject: 'Invite',
  //   //         body: emailId
  //   //     }).catch(console.error);

  //   transporter.sendMail(mailOptions, function(error, info){
  //     if (error) {
  //       console.log(error);
  //     } else {
  //       console.log('Email sent: ' + info.response);
  //     }
  //   });
        
  //   this.props.navigator.push({
  //       screen: screenNames.thankyouScreen,
  //       navigatorStyle: {
  //           tabBarHidden: true
  //       }
  //   });
  // };

  _verifyInviteCode(code) {
    firebase.analytics().setUserProperty(userProperties.INVITE_CODE, code);
    if (code.length === 4) {
      if (inviteCodes.indexOf(code) >= 0) {
          try {
            firebase.analytics().logEvent(eventNames.INVITE, {
                'status': parameterValues.SUCCESS
            });
            this.props.navigator.push({
              screen: screenNames.welcomeScreen,
              title: 'Welcome',
              backButtonHidden: true,
            });
          } catch (error) {
            console.error('AsyncStorage error: ', error.message);
          }
      } else {
            firebase.analytics().logEvent(eventNames.INVITE, {
                'status': parameterValues.FAILURE
            });
            this.setState({ 
              showMessage: true
            });
            this.refs.codeInputRef.clear();
      }
    }
  }

  renderView() {
    if (this.state.showMessage) {
      return (<Text style={styles.alertMessageStyle}> Invalid invite code </Text>);
    }
  }

  render() {
    return (
      <View style={{flex: 1, justifyContent: 'flex-start', marginTop: 100}}> 
        <View style={styles.boldTextViewStyle}>
            <Text style={styles.boldTextStyle}>Have an invite?</Text>
        </View>
        <View style={styles.textViewStyle}>
            <Text style={styles.grayTextStyle}>Please enter the invite code</Text>
        </View>  
        <View style={{marginBottom: 20}}>
          <CodeInput
            codeLength={4}
            ref="codeInputRef"
            secureTextEntry
            inputPosition='center'
            activeColor='grey'
            inactiveColor='grey'
            autoFocus
            keyboardType='numeric'
            ignoreCase
            onFulfill={(code) => this._verifyInviteCode(code)}
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
  textViewStyle: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  grayTextStyle: {
    fontSize: 18,
    color: 'grey',
    justifyContent: 'center',
    alignItems: 'center'
  },
  boldTextViewStyle: {
    marginTop: 20,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  boldTextStyle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  alertViewStyle: {
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  alertMessageStyle: {
    fontSize: 12,
    color: 'red',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

