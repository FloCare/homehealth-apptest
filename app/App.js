import {Navigation} from 'react-native-navigation';
import {screenNames} from './utils/constants';
import RegisterInitScreens from './init_screens';

RegisterInitScreens();

// Display Invite/PasscodeVerification Screen
Navigation.startSingleScreenApp({
  screen: {
    screen: screenNames.passcodeVerificationScreen,
    title: 'Welcome', 
  }
});
