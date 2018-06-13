import {Navigation} from 'react-native-navigation';
import {AsyncStorage} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
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
    const isFirstRun = async () => {
        try {
            return await AsyncStorage.getItem('isFirstVisit');
        } catch (error) {
            console.error('AsyncStorage error: ', error.message);
            // Todo: Figure out what to do here ???
            return false;
        }
    };

	if (await isFirstRun()) {
		Navigation.startSingleScreenApp({
			screen: {
				screen: screenNames.passcodeVerificationScreen,
			},
			appStyle: navigatorStyle,
			animationType: 'fade'
		});
	} else {
		console.log(screenNames.loginScreen);
		Navigation.startSingleScreenApp({
			screen: {
				screen: screenNames.loginScreen,
                navigatorStyle: {
                    navBarHidden: true,
                },
			},
			appStyle: navigatorStyle,
			animationType: 'fade'
		});
	}
	SplashScreen.hide();
};

StartApp();
