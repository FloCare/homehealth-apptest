import React, { Component } from 'react';
import { Text, View, TextInput } from 'react-native';
import {Button} from 'react-native-elements';
import { Input } from '../components/common/Input';
import { CardSection } from '../components/common/CardSection';
import { Card } from '../components/common/Card';
import { Spinner } from '../components/common/Spinner';
import {screenNames, PrimaryFontFamily } from '../utils/constants';

class LoginScreen extends Component {
  state = { email: '', password: '', error: '', loading: false };

  onButtonPress() {
    const { email, password } = this.state;
    this.setState({
      loading: true
    });

    fetch('https://fathomless-harbor-75587.herokuapp.com/get-token/', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: email,
            password: password,
          }),
        }).then(response => {
            if (response.status < 200 || response.status >= 300) {
              this.setState({ 
                email: '',
                password: '',
                loading: false,
                error: 'Authentication Failed.'
              });
            }
            else {
              this.props.navigator.push({
                screen: screenNames.welcomeScreen,
                title: 'Welcome',
                backButtonHidden: true,
              });
              return response.json();
            }
        })
        .then(({ token }) => {
          console.log('token set');
          // TODO
          localStorage.setItem('access_token', token);
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

  render() {
    return (
      <View style={{marginBottom: 80}}>
        <View style={{marginBottom: 20}}>
          <Text style={styles.boldTextStyle}> Login </Text>

        </View>
        <View style={{marginBottom: 20}}>
          <Input 
            label="Email"
            placeholder="user@email.com"
            value={this.state.email}
            onChangeText={(text) => this.setState({ email: text })}
          />
        </View>

        <View>
          <Input 
            secureTextEntry
            label="Password"
            placeholder="password"
            value={this.state.password}
            onChangeText={(text) => this.setState({ password: text })}
          />
        </View>

        <Text style={styles.errorTextStyle}>
          {this.state.error}
        </Text>

        <View>
          {this.renderButton()}
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
    fontSize: 18,
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
  }
};


export {LoginScreen};
