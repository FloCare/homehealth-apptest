import React, {Component} from 'react';
import CodePush from 'react-native-code-push';
import firebase from 'react-native-firebase';
import LinearGradient from 'react-native-linear-gradient';
import VirtualKeyboard from 'react-native-virtual-keyboard';
import RNSecureKeyStore from 'react-native-secure-key-store';
import {
    View,
    StyleSheet,
    Text,
    Alert,
    Dimensions,
    SafeAreaView,
    AsyncStorage,
} from 'react-native';
import moment from 'moment/moment';
import StartApp from '../screens/App';
import {
    screenNames,
    PrimaryColor,
    PrimaryFontFamily,
    userProperties,
    MaxFailedAttempts, LockTimeOnFailedAttempts,
} from '../utils/constants';
import {getItem} from '../utils/InMemoryStore';

class PasscodeVerificationScreen extends Component {
    static navigatorStyle = {
        navBarHidden: true
    };

    constructor(props) {
        super(props);
        this.userDetails = getItem('myUserDetails');
        this.state = {
            showMessage: false,
            code: '',
            failedAttempts: 0,
            lockTimeRemaining: null
        };
        this.props = props;
        this.verifyCode = this.verifyCode.bind(this);
    }

    componentDidMount() {
        firebase.analytics().setCurrentScreen(screenNames.passcodeVerification, screenNames.passcodeVerification);
        firebase.analytics().setUserProperty(userProperties.OTA_VERSION, '0.5.2');
        if (this.userDetails && this.userDetails.unlockTime > moment().valueOf()) {
            this.setLockTimeRefreshCounter();
        }
    }

    getLockTimeRemaining = () => (
        Math.round((this.userDetails.unlockTime - moment().valueOf()) / 1000)
    );

    setLockTimeRemaining = () => {
        const remainingTime = this.getLockTimeRemaining();
        if (remainingTime <= 0) {
            this.clearCounterForLockTime();
            this.setState({
                failedAttempts: 0,
                lockTimeRemaining: 0,
                showMessage: false
            });
        }
        this.setState({
            lockTimeRemaining: Math.round(remainingTime)
        });
    }

    setLockTimeRefreshCounter = () => {
        this.setLockTimeRemaining();
        this.lockTimeRefreshCounter = setInterval(this.setLockTimeRemaining, 1000);
    }

    clearCounterForLockTime = () => {
        if (this.lockTimeRefreshCounter) {
            clearInterval(this.lockTimeRefreshCounter);
        }
    }

    isLocked = () => (!!this.state.lockTimeRemaining);

    async verifyCode(code) {
        await CodePush.notifyApplicationReady();
        RNSecureKeyStore.get('passCode')
        .then((res) => {
            if (res === code) {
                // Todo: Check if Encryption key should be a function of passcode
                // Fetch the encryption key
                if (this.props.inactivity) {
                    this.props.navigator.dismissModal({
                        animationType: 'fade'
                    });
                    if (this.props.onSuccessCallback) {
                        this.props.onSuccessCallback();
                    }
                    return;
                }
                return RNSecureKeyStore.get('flokey');
            }
            const failedAttempts = this.state.failedAttempts + 1;
            if (failedAttempts >= MaxFailedAttempts) {
                this.userDetails.unlockTime = moment().valueOf() + (LockTimeOnFailedAttempts * 60 * 1000);
                this.setLockTimeRefreshCounter();
                AsyncStorage.setItem('myUserDetails', JSON.stringify(this.userDetails));
            }
            this.setState({
                showMessage: true,
                code: '',
                failedAttempts
            });
            return null;
        }, error => {
            console.log(error);
            Alert.alert('Error', 'Unable to verify passcode');
        })
        .then(async (k) => {
            if (k) {
                // Connect to realm, Register new screens
                // Navigate to the Tab Based App
                try {
                    await StartApp(k);
                } catch (e) {
                    console.log('Error in starting app:', e);
                    //TODO reset passcode
                    this.setState({
                        showMessage: true,
                        code: '',
                    });
                    if (e.name === 'MissingNecessaryInternetConnection') {
                        Alert.alert('Offline', 'Unable to start the app');
                    } else { Alert.alert('Error', 'Unable to start the app'); }
                }
            }
        }, (err) => {
            console.log(err);
            Alert.alert('Error', 'Unable to unlock your data');
        });
    }

    onKeyPress(char) {
        if (this.isLocked()) return;
        let code = this.state.code;
        if (char === 'back') {
            code = code.slice(0, -1);
        } else {
            code += char;
        }
        this.setState({code, showMessage: false});
        this.forceUpdate();
        if (code.length === 4) {
            setTimeout(() => this.verifyCode(code));
        }
    }

    render() {
        const primaryColor = PrimaryColor;
        const secondary = '#34da92';
        const {width} = Dimensions.get('window');
        const errorMessage = `Incorrect Passcode (${this.state.failedAttempts}/${MaxFailedAttempts})`;
        return (
            <LinearGradient
                colors={[primaryColor, secondary]}
                start={{x: 0.0, y: 0.0}} end={{x: 0, y: 1}}
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                }}
            >
                <SafeAreaView
                    style={{flex: 1, justifyContent: 'space-evenly', alignItems: 'center'}}
                >
                    <View>
                        <Text style={styles.headerSectionStyle}>
                            Enter Passcode
                        </Text>
                    </View>
                    <View
                        style={{flexDirection: 'row', justifyContent: 'center'}}
                    >
                        <Text style={{color: this.state.code.length > 0 ? 'white' : 'rgba(255,255,255,0.3)', fontSize: 60, fontWeight: '500', marginHorizontal: 10}}>*</Text>
                        <Text style={{color: this.state.code.length > 1 ? 'white' : 'rgba(255,255,255,0.3)', fontSize: 60, fontWeight: '500', marginHorizontal: 10}}>*</Text>
                        <Text style={{color: this.state.code.length > 2 ? 'white' : 'rgba(255,255,255,0.3)', fontSize: 60, fontWeight: '500', marginHorizontal: 10}}>*</Text>
                        <Text style={{color: this.state.code.length > 3 ? 'white' : 'rgba(255,255,255,0.3)', fontSize: 60, fontWeight: '500', marginHorizontal: 10}}>*</Text>
                    </View>
                </SafeAreaView>
                {
                    this.isLocked() &&
                    <Text style={{...styles.errorTextStyle, marginBottom: 5}}>
                        {`You can try again in ${this.state.lockTimeRemaining} seconds`}
                    </Text>
                }
                <Text
                    style={styles.errorTextStyle}
                >
                    {this.state.showMessage ? errorMessage : ' '}
                </Text>
                <SafeAreaView style={{width, flex: 1}}>
                    <VirtualKeyboard
                        color='white'
                        pressMode='char'
                        onPress={(val) => this.onKeyPress(val)}
                        style={{
                            container: {
                                flex: 1,
                                flexDirection: 'column',
                                marginBottom: 20,
                            },
                            row: {
                                flex: 1
                            },
                            number: {
                                fontFamily: PrimaryFontFamily,
                                fontSize: 35,
                                fontWeight: '400'
                            }
                        }}
                    />
                </SafeAreaView>
            </LinearGradient>
        );
    }
}

const styles = StyleSheet.create({
    headerSectionStyle: {
        color: 'white',
        fontFamily: PrimaryFontFamily,
        fontSize: 24,
        fontWeight: '500',
        textAlign: 'center',
        margin: 10,
        marginTop: 50,
    },
    errorTextStyle: {
        fontFamily: PrimaryFontFamily,
        fontSize: 14,
        alignSelf: 'center',
        color: 'rgba(255,0,0,0.7)'
    },
});


export default PasscodeVerificationScreen;
