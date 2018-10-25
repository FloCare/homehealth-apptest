import {Navigation} from 'react-native-navigation';
import PasscodeVerificationScreen from './PasscodeVerificationScreen';
import {WelcomePageScreen} from './WelcomePageScreen';
import {InviteScreen} from './InviteScreen';
import {SetPassCodeScreen} from './SetPassCodeScreen';
import {LoginScreen} from './LoginScreen';
import {ThankYouScreen} from './ThankYouScreen';
import {SettingUpScreen} from './SettingUpScreen';
import {screenNames} from '../utils/constants';

// register first few screens
const RegisterInitScreens = () => {
	Navigation.registerComponent(screenNames.loginScreen, () => LoginScreen);
    Navigation.registerComponent(screenNames.welcomeScreen, () => WelcomePageScreen);
    Navigation.registerComponent(screenNames.inviteScreen, () => InviteScreen);
    Navigation.registerComponent(screenNames.thankyouScreen, () => ThankYouScreen);
    Navigation.registerComponent(screenNames.passcodeVerificationScreen, () => PasscodeVerificationScreen);
    Navigation.registerComponent(screenNames.setPassCodeScreen, () => SetPassCodeScreen);
    Navigation.registerComponent(screenNames.settingUpScreen, () => SettingUpScreen);
};

export default RegisterInitScreens;
