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

const StartApp = async () => {
    const isFirstRun = await (async () => {
        try {
            return await AsyncStorage.getItem('isFirstVisit');
        } catch (error) {
            console.error('AsyncStorage error: ', error.message);
            // Todo: Figure out what to do here ???
            return false;
        }
    });

	// Display Invite/PasscodeVerification Screen
	if (isFirstRun) {
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
