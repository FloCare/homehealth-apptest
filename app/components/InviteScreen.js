import React, {Component} from 'react';
import OtpInputs from 'react-native-otp-inputs';
import {Button} from 'react-native-elements';
import {StyleSheet, Text, TextInput, ScrollView, View, AsyncStorage} from 'react-native';
import Header from './common/Header';
import {screenNames} from '../utils/constants';
import {PrimaryFontFamily} from '../utils/constants';

const inviteCodes = ['9999', '5678', '2468', '7777'];

export class InviteScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      emailId: '',
      organizationName: ''
    };
    this.sendEmail = this.sendEmail.bind(this);
  }

  componentDidMount() {
    try {
          const isFirstVisit = AsyncStorage.getItem('isFirstVisit');
          if(isFirstVisit === 'false') {
            this.props.navigator.push({
            screen: screenNames.homeScreen,
            navigatorStyle: {
                tabBarHidden: true
            }
            });
          }
        } catch (error) {

        }
  }

// TODO Integrate Node email
  sendEmail = () => {
    const {emailId, organizationName} = this.state;
    // const to = ['karthik@flocare.health']; // string or array of email addresses
    //     email.sendEmail(to, {
    //         // Optional additional arguments
    //         cc: [''], // string or array of email addresses
    //         bcc: '', // string or array of email addresses
    //         subject: 'Invite',
    //         body: emailId
    //     }).catch(console.error);
        
        this.props.navigator.push({
            screen: screenNames.thankyouScreen,
            navigatorStyle: {
                tabBarHidden: true
            }
        });
  };

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
                  inputContainerStyles={styles.buttonText}
                  handleChange={
                    code => {
                              if (code.length === 4) {
                                  this.props.navigator.push({
                                        screen: screenNames.welcomeScreen,
                                        backbuttonHidden: true,
                                        navigatorStyle: {
                                            tabBarHidden: true
                                        }
                                  });
                                  if (inviteCodes.indexOf(code) > 0) {
                                    try {
                                        AsyncStorage.setItem('isFirstVisit', 'false');
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
              <View style={styles.instructionStyle}>
                <Text style={styles.welcome}> Don't have an invite yet?</Text>
              </View>
              <View style={styles.grayTextStyle}>
                <Text style={styles.grayTextStyle}>Please leave your work emailId and Organization name we will invite you!</Text>
              </View>
              <View style={{padding: 25}}>
                <Text style={{fontSize: 18}}>Email Id</Text>
                <TextInput
                  style={{height: 40, marginTop: 15, marginBottom: 15}}
                  onChangeText={value => this.setState({emailId: value})}
                  placeholder={'abc@domain.com '}
                  value={emailId}
                />
                <Text style={{fontSize: 18}}>Organization Name</Text>
                <TextInput
                  style={{height: 40, marginTop: 15, marginBottom: 15}}
                  onChangeText={value => this.setState({organizationName: value})}
                  placeholder={'Organization '}
                  value={organizationName}
                />
                <Button
                  containerViewStyle={{marginLeft: 0, marginRight: 0}}
                  buttonStyle={styles.buttonStyle}
                  textStyle={{
                  fontFamily: PrimaryFontFamily,
                  fontSize: 16
                  }}
                  title='Submit' onPress={this.sendEmail} />
              </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop: 50,
    padding: 20,
  },
  welcome: {  
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    marginBottom: 20,
    marginTop: 10,
  },
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
  },
  stretch: {
    alignSelf: 'center',
    width: 300,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    alignSelf: 'center',
    marginBottom: 30
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  buttonStyle: {
    backgroundColor: '#45ceb1',
    marginLeft: 0,
    marginRight: 0
},
  button: {
    color: '#666666',
    height: 36,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  }
});

