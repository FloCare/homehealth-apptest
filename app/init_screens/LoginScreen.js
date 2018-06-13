import React, {Component} from 'react';
import {TextInput, View, ActivityIndicator, Dimensions} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Button} from 'react-native-elements';
import RNSecureKeyStore from 'react-native-secure-key-store';
import {screenNames, PrimaryFontFamily, PrimaryColor} from '../utils/constants';
import StyledText from '../components/common/StyledText';

// TODO Change to the endpoint on Aptible
const API_URL = 'http://app-9707.on-aptible.com/get-token/';

class LoginScreen extends Component {
    state = {email: undefined, password: undefined, passwordPlaceholder: 'Password', loading: false};

    emailField = React.createRef();
    passwordField = React.createRef();

    onSubmit() {
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
                    password: undefined,
                    passwordPlaceholder: 'Authentication Failed',
                    loading: false,
                    error: 'Login failed.'
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
            return <ActivityIndicator size="large" color="#ffffff" style={{marginVertical: 20}} />;
        }

        return (
            <Button
                containerViewStyle={{marginVertical: 20}}
                buttonStyle={styles.buttonStyle}
                textStyle={{
                    fontFamily: PrimaryFontFamily,
                    fontSize: 16,
                    color: PrimaryColor
                }}
                title='Sign-in' onPress={this.onSubmit.bind(this)}
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
        const primaryColor = PrimaryColor;
        const secondary = '#34da92';
        return (
            <LinearGradient
                colors={[primaryColor, secondary]}
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                }}
            >
                <StyledText
                    style={{color: 'white', fontSize: 24, fontWeight: '500', marginVertical: 40}}
                >
                    Login
                </StyledText>
                <InputField
                    ref={this.emailField}
                    keyboardType={'email-address'}
                    title={'Email'}
                    placeholder={'Email'}
                    autoFocus
                    value={this.state.email}
                    onChangeText={(text) => this.setState({email: text})}
                    onSubmitEditing={() => this.passwordField.current.focus()}
                />
                <InputField
                    ref={this.passwordField}
                    someShit={this.someShit}
                    title={'Password'}
                    placeholder={this.state.passwordPlaceholder}
                    secureTextEntry
                    value={this.state.password}
                    onChangeText={(text) => this.setState({password: text})}
                    onSubmitEditing={this.onSubmit.bind(this)}
                />
                {this.renderButton()}
            </LinearGradient>
        );
    }
}

const InputField = React.forwardRef((props, ref) => (
        <View
            style={{width: Dimensions.get('window').width * 0.7, marginVertical: 10}}
        >
            <StyledText
                style={{color: 'white'}}
            >
                {props.title}
            </StyledText>
            <TextInput
                ref={ref}
                keyboardType={props.keyboardType}
                value={props.value}
                autoFocus={props.autoFocus}
                placeholder={props.placeholder}
                secureTextEntry={props.secureTextEntry}
                onChangeText={props.onChangeText}
                onSubmitEditing={props.onSubmitEditing}

                selectionColor={'rgba(255,255,255,0.5)'}
                underlineColorAndroid={'white'}
                autoCorrect={false}
                style={{color: 'white'}}
                placeholderTextColor={'rgba(255,255,255,0.35)'}
            />
        </View>
    )
);

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
        backgroundColor: 'white',
        borderRadius: 25,
        height: 50,
        width: Dimensions.get('window').width * 0.5
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
