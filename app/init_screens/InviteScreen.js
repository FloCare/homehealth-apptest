import React, {Component} from 'react';
import CodeInput from 'react-native-confirmation-code-input';
import {StyleSheet, Text, ScrollView, View, AsyncStorage} from 'react-native';
import {screenNames} from '../utils/constants';

// TODO Provide actual invite codes , move it to a backend later
const inviteCodes = ['9999', '5678', '2468', '7777'];

export class InviteScreen extends Component {

    state = {showMessage: false};

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
    if (code.length === 4) {
      if (inviteCodes.indexOf(code) >= 0) {
          try {
            AsyncStorage.setItem('isFirstVisit', 'false');
            this.props.navigator.push({
              screen: screenNames.welcomeScreen,
              backButtonHidden: true,
            });
          } catch (error) {
            console.error('AsyncStorage error: ', error.message);
          }
        } else {
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
      <ScrollView>
        <View style={styles.textViewStyle}>
            <Text style={styles.grayTextStyle}> Welcome </Text>
        </View>  
        <View style={styles.boldTextViewStyle}>
            <Text style={styles.boldTextStyle}> Have an invite? </Text>
        </View>  
        <View style={styles.textViewStyle}>
            <Text style={styles.grayTextStyle}> Enter the INVITE code </Text>
        </View>  
        <View>
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
      </ScrollView>
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
    marginTop: 20,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  alertViewStyle: {
    marginTop: 20,
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

