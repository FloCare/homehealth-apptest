import React, {Component} from 'react';
import OtpInputs from 'react-native-otp-inputs';
import {Button} from 'react-native-elements';
import {StyleSheet, Text, TextInput, ScrollView, View, AsyncStorage} from 'react-native';
import Header from './common/Header';
import {screenNames} from '../utils/constants';
import {PrimaryFontFamily} from '../utils/constants';

// TODO Provide actual invite codes , move it to a backend later
const inviteCodes = ['9999', '5678', '2468', '7777'];

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

  render() {
    const {emailId, organizationName} = this.state;
    return (
      <ScrollView >
            <View style={styles.grayTextStyle}>
                <Text style={styles.grayTextStyle}> Hey Whats up </Text>
            </View>  
            <View style={styles.boldTextStyle}>
                <Text style={styles.boldTextStyle}> Have an invite? </Text>
            </View>  
            <View style={styles.grayTextStyle}>
                <Text style={styles.grayTextStyle}> Enter the INVITE code </Text>
            </View>  
            <View >
                <OtpInputs  
                  handleChange={
                    code => {
                              if (code.length === 4) {
                                  if (inviteCodes.indexOf(code) >= 0) {
                                    try {
                                        AsyncStorage.setItem('isFirstVisit', 'false');
                                        this.props.navigator.push({
                                          screen: screenNames.welcomeScreen,
                                          backbuttonHidden: true,
                                          navigatorStyle: {
                                              tabBarHidden: true
                                          }
                                        });
                                    } catch (error) {
                                        console.error('AsyncStorage error: ', error.message);
                                    }
                                  
                                  }
                              }

                          // TODO when the invite code is wrong
                          // else {
                          //   <Text> Please enter a valid invite </Text>
                          // }
                    }
                  } numberOfInputs={4}
                />
              </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  grayTextStyle: {
    fontSize: 18,
    color: 'grey',
    justifyContent: 'center',
    alignItems: 'center'
  },
  boldTextStyle: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

