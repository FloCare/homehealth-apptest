import {Navigation} from 'react-native-navigation';
import {AsyncStorage, processColor} from 'react-native';
import Instabug from 'instabug-reactnative';
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

const isFirstRun = async () => {
    try {
        const isFirstVisitKeySet = await AsyncStorage.getItem('isFirstVisit');
        return !isFirstVisitKeySet;
    } catch (error) {
        console.error('AsyncStorage error: ', error.message);
        // Todo: Figure out what to do here ???
        return true;
    }
};

const StartApp = async () => {
    Instabug.startWithToken('29d3f443148b83202e3213845ff10c87', [Instabug.invocationEvent.shake]);
    Instabug.setWelcomeMessageMode(Instabug.welcomeMessageMode.disabled);
    Instabug.setStringToKey('Shake the device to report bug \nor\nGo to More and click report', Instabug.strings.shakeHint);
    //TODO Check color to be shown
    Instabug.setPrimaryColor(processColor(PrimaryColor));
	if (!await isFirstRun()) {
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
