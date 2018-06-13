import React, {Component} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {Button} from 'react-native-elements';
import RNSecureKeyStore from 'react-native-secure-key-store';
import {Input} from '../components/common/Input';
import {Spinner} from '../components/common/Spinner';
import {screenNames, PrimaryFontFamily} from '../utils/constants';

// TODO Change to the endpoint on Aptible
const API_URL = 'http://app-9707.on-aptible.com/get-token/';

class LoginScreen extends Component {
  state = {email: '', password: '', error: '', loading: false};

  onButtonPress() {
    const {email, password} = this.state;
    this.setState({
      loading: true
    });

    fetch(API_URL, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: email,
            password,
          }),
        }).then(response => {
            if (response.status < 200 || response.status >= 300) {
              this.setState({ 
                email: '',
                password: '',
                loading: false,
                error: 'Authentication Failed.'
              });
            } else {
              this.props.navigator.push({
                screen: screenNames.welcomeScreen,
                title: 'Welcome',
                backButtonHidden: true,
              });
              return response.json();
            }
        })
        .then(({token}) => {
          console.log(`token set to ${token}`);
          RNSecureKeyStore.set('accessToken', token);
    });
  }

  renderButton() {
    if (this.state.loading) {
      return <Spinner size="small" />;
    }
    
    return (
      <Button
          containerViewStyle={{marginLeft: 10, marginRight: 10}}
          buttonStyle={styles.buttonStyle}
          textStyle={{
            fontFamily: PrimaryFontFamily,
            fontSize: 16
          }}
          title='Sign in' onPress={this.onButtonPress.bind(this)}
      >
        Explore
      </Button>
    );
  }

  onPress = () => {
    this.props.navigator.push({
      screen: screenNames.inviteScreen
    });
  };

  render() {
    return (
      <View style={{marginBottom: 80}}>
        <View style={{marginBottom: 20}}>
          <Text style={styles.boldTextStyle}> Login </Text>

        </View>
        <View >
          <Input 
            placeholder="user@email.com"
            value={this.state.email}
            onChangeText={(text) => this.setState({email: text})}
            autoFocus
          />
        </View>

        <View>
          <Input 
            secureTextEntry
            placeholder="password"
            value={this.state.password}
            onChangeText={(text) => this.setState({password: text})}
          />
        </View>

        <Text style={styles.errorTextStyle}>
          {this.state.error}
        </Text>

        <View>
          {this.renderButton()}
        </View>
        <View style={styles.alertMessageStyle}>
          <TouchableOpacity
              onPress={this.onPress}
          >
          <Text style={{fontSize: 10}}> No Login yet? </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = {
  errorTextStyle: {
    fontSize: 14,
    alignSelf: 'center',
    color: 'red'
  },
    boldTextStyle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
    alignItems: 'center'
  },
    buttonStyle: {
    backgroundColor: '#45ceb1',
    marginLeft: 0,
    marginRight: 0,
    height: 50
  },
  alertMessageStyle: {
      marginTop: 20,
      fontSize: 12,
      color: 'red',
      justifyContent: 'center',
      alignItems: 'center'
  },
};


export {LoginScreen};
