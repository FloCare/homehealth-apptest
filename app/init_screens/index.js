import {Navigation} from 'react-native-navigation';
import PasscodeVerificationScreen from './PasscodeVerificationScreen';
import {WelcomePageScreen} from './WelcomePageScreen';
import {InviteScreen} from './InviteScreen';
import {SetPassCodeScreen} from './SetPassCodeScreen';
import {ThankYouScreen} from './ThankYouScreen';
import {screenNames} from '../utils/constants';

// register first few screens
const RegisterInitScreens = () => {
    Navigation.registerComponent(screenNames.welcomeScreen, () => WelcomePageScreen);
    Navigation.registerComponent(screenNames.inviteScreen, () => InviteScreen);
    Navigation.registerComponent(screenNames.thankyouScreen, () => ThankYouScreen);
    Navigation.registerComponent(screenNames.passcodeVerificationScreen, () => PasscodeVerificationScreen);
    Navigation.registerComponent(screenNames.setPassCodeScreen, () => SetPassCodeScreen);
};

export default RegisterInitScreens;
