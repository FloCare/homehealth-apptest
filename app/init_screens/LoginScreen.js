import React, {Component} from 'react';
import {View, ActivityIndicator, Dimensions, SafeAreaView, KeyboardAvoidingView, AsyncStorage, TextInput} from 'react-native';
import firebase from 'react-native-firebase';
import RNSecureKeyStore from 'react-native-secure-key-store';
import {screenNames, PrimaryFontFamily, PrimaryColor, userProperties, apiServerURL} from '../utils/constants';
import StyledText from '../components/common/StyledText';
import {SimpleButton} from '../components/common/SimpleButton';
import {UserDataService} from '../data_services/UserDataService';
import {PatientDataService} from '../data_services/PatientDataService';
import {setUserForInstabug} from '../utils/instabugUtils';

class LoginScreen extends Component {
    state = {email: undefined, password: undefined, authSubtitle: ' ', loading: false};

    emailField = React.createRef();
    passwordField = React.createRef();

    onUseInviteCode = () => {
        this.props.navigator.push({
            screen: screenNames.inviteScreen
        });
    };

    componentDidMount() {
      firebase.analytics().setCurrentScreen(screenNames.login, screenNames.login);
      // setTimeout(() => {
      //     this.state = {
      //         email: 'admin.admin',
      //         password: '545819'
      //     };
      //     this.onSubmit();
      // });
    }

    onSubmit() {
        const {email, password} = this.state;
        this.setState({
            loading: true,
            authSubtitle: ' '
        });

        fetch(`${apiServerURL}/get-token/`, {
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
                    authSubtitle: 'Authentication Failed',
                    loading: false,
                    error: 'Login failed.'
                });
            } else {
                return response.json();
            }
        })
            .then(({token}) => {
                console.log(`token set to ${token}`);
                RNSecureKeyStore.set('accessToken', token);
            })
            .then(() => UserDataService.fetchUserProps())
            .then(userPropsJson => {
                firebase.analytics().setUserId(userPropsJson.userID);
                firebase.analytics().setUserProperty(userProperties.ROLE, userPropsJson.role);
                firebase.analytics().setUserProperty(userProperties.ORG, userPropsJson.org);

                AsyncStorage.setItem('myUserDetails', JSON.stringify(userPropsJson));
                const userName = PatientDataService.constructName(userPropsJson.firstName, userPropsJson.lastName);
                setUserForInstabug(userPropsJson.email, userName);
                this.props.navigator.resetTo({
                    screen: screenNames.welcomeScreen,
                    title: 'Welcome',
                    backButtonHidden: true,
                });
            })
            .catch((error) => {
                console.log(error);
                this.setState({
                    password: undefined,
                    authSubtitle: 'Authentication Failed',
                    loading: false,
                    error: 'Login failed.'
                });
            });
    }

    renderButton() {
        if (this.state.loading) {
            return <ActivityIndicator size="large" color="#ffffff" style={{marginVertical: 20}} />;
        }

        return (
            <SimpleButton
                style={{backgroundColor: 'white', borderRadius: 25, flex: 1}}
                textStyle={{
                    fontFamily: PrimaryFontFamily,
                    fontSize: 14,
                    fontWeight: '500',
                    color: PrimaryColor
                }}
                title='SIGN-IN' onPress={this.onSubmit.bind(this)}
            />
        );
    }

    render() {
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    backgroundColor: PrimaryColor
                }}
            >
                <KeyboardAvoidingView
                    style={{flex: 1}}
                    keyboardVerticalOffset={0}
                    behavior={'padding'}
                >
                    <SafeAreaView
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'space-evenly',
                            bottomMargin: 30
                        }}
                    >
                        <StyledText
                            style={{color: 'white', fontSize: 24, fontWeight: '500'}}
                        >
                            Login
                        </StyledText>
                        <View>
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
                                title={'Password'}
                                placeholder={'Password'}
                                secureTextEntry
                                value={this.state.password}
                                onChangeText={(text) => this.setState({password: text, authSubtitle: ' '})}
                                onSubmitEditing={this.onSubmit.bind(this)}
                            />
                        </View>
                        <StyledText
                            style={styles.errorTextStyle}
                        >
                            {this.state.authSubtitle}
                        </StyledText>
                        <View
                            style={{
                                flexDirection: 'row',
                                width: Dimensions.get('window').width * 0.7,
                                marginVertical: 20,
                            }}
                        >
                            {/*<SimpleButton*/}
                                {/*style={{backgroundColor: 'transparent', height: 50}}*/}
                                {/*textStyle={{*/}
                                    {/*fontFamily: PrimaryFontFamily,*/}
                                    {/*fontSize: 12,*/}
                                    {/*color: 'rgba(255,255,255,1)'*/}
                                {/*}}*/}
                                {/*title='Use Invite Code' onPress={this.onUseInviteCode.bind(this)}*/}
                            {/*/>*/}
                            <View
                                style={{flex: 1, height: 50}}
                            >
                                {this.renderButton()}
                            </View>
                        </View>
                    </SafeAreaView>
                </KeyboardAvoidingView>
            </View>
        );
    }
}

const InputField = React.forwardRef((props, ref) => (
        <View
            style={{width: Dimensions.get('window').width * 0.7, marginVertical: 10}}
        >
            <StyledText
                style={{color: 'white', textAlign: 'left', fontWeight: '500'}}
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

                autoCapitalize={'none'}
                selectionColor={'rgba(255,255,255,0.5)'}
                underlineColorAndroid={'white'}
                autoCorrect={false}
                style={{color: 'rgba(255,255,255,0.85)', fontSize: 18}}
                placeholderTextColor={'rgba(255,255,255,0.35)'}
            />
        </View>
    )
);

const styles = {
    errorTextStyle: {
        fontSize: 14,
        alignSelf: 'center',
        color: 'rgba(255,0,0,0.7)'
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
        marginLeft: 0,
        marginRight: 0,
        backgroundColor: 'white',
        borderRadius: 25,
        height: 50,
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
