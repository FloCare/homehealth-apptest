import {Navigation} from 'react-native-navigation';
import {screenNames} from './utils/constants';
import RegisterInitScreens from './init_screens';
import {AsyncStorage} from 'react-native';
import {PrimaryColor} from './utils/constants';

RegisterInitScreens();

const navigatorStyle = {
    navBarBackgroundColor: PrimaryColor,
    navBarTextColor: '#ffffff',
    navBarButtonColor: 'white',
    hideBackButtonTitle: true,
    statusBarTextColorScheme: 'light'
};

async function check() {
	try {
		const isFirstVisit = await AsyncStorage.getItem('isFirstVisit');
		return isFirstVisit;
	} catch (error) {
		console.error('AsyncStorage error: ', error.message);
		// Todo: Figure out what to do here ???
		return false;
	}
};

const res = check();

// Display Invite/PasscodeVerification Screen
if (!res) {
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
