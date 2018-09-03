import {Navigation} from 'react-native-navigation';
import {AsyncStorage, processColor, Platform} from 'react-native';
import Instabug, {BugReporting} from 'instabug-reactnative';
import SplashScreen from 'react-native-splash-screen';
import {screenNames, PrimaryColor, instabugKey} from './utils/constants';
import RegisterInitScreens from './init_screens';
import {setAutoScreenShotForInstabug, setFeedbackOptionOnly} from './utils/instabugUtils';

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

const setupInstaBug = () => {
    if (Platform.OS === 'ios') {
        // ios specific code for instabug
        Instabug.startWithToken(instabugKey, [Instabug.invocationEvent.screenshot]);
        Instabug.setPrimaryColor(processColor(PrimaryColor));
    }
    if (Platform.OS === 'android') {
        Instabug.enable();
    }
    Instabug.setWelcomeMessageMode(Instabug.welcomeMessageMode.disabled);
    BugReporting.setInvocationOptions([Instabug.invocationOptions.invocationOptionsEmailFieldHidden]);
    setFeedbackOptionOnly();
    setAutoScreenShotForInstabug(true);
};

export const StartApp = async () => {
    setupInstaBug();
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
