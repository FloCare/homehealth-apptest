import {Navigation} from 'react-native-navigation';
import {AsyncStorage} from 'react-native';
import {screenNames, PrimaryColor} from './utils/constants';
import RegisterInitScreens from './init_screens';

RegisterInitScreens();

const navigatorStyle = {
    navBarBackgroundColor: PrimaryColor,
    navBarTextColor: '#ffffff',
    navBarButtonColor: 'white',
    hideBackButtonTitle: true,
    statusBarTextColorScheme: 'light',
    forceTitlesDisplay: true,
    keepStyleAcrossPush: false
};

const check = async() => {
	try {
		const isFirstVisit = await AsyncStorage.getItem('isFirstVisit');
		return isFirstVisit;
	} catch (error) {
		console.error('AsyncStorage error: ', error.message);
		// Todo: Figure out what to do here ???
		return false;
	}
};

const StartApp = async() => {
	const res = await check();

	// Display Invite/PasscodeVerification Screen
	if (res) {
		Navigation.startSingleScreenApp({
			screen: {
				screen: screenNames.passcodeVerificationScreen,
			},
			appStyle: navigatorStyle,
			animationType: 'fade'
		});
	} else {
		Navigation.startSingleScreenApp({
			screen: {
				screen: screenNames.inviteScreen,
			},
			appStyle: navigatorStyle,
			animationType: 'fade'
		});
	}
};

StartApp();
