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

const setShakingThreshold = () => {
    const shakingThresholdAndroid = 250;
    const shakingThresholdIphone = 2.0;
    BugReporting.setShakingThresholdForAndroid(shakingThresholdAndroid);
    BugReporting.setShakingThresholdForiPhone(shakingThresholdIphone);
};

const setupInstaBug = () => {
    if (Platform.OS === 'ios') {
        // ios specific code for instabug
        Instabug.startWithToken(instabugKey, [Instabug.invocationEvent.shake]);
        Instabug.setPrimaryColor(processColor(PrimaryColor));
    }
    Instabug.setWelcomeMessageMode(Instabug.welcomeMessageMode.disabled);
    BugReporting.setInvocationOptions([Instabug.invocationOptions.invocationOptionsEmailFieldOptional]);
    Instabug.setStringToKey('Shake the device to give feedback\nor\nGo to More and click Send feedback', Instabug.strings.shakeHint);
    setFeedbackOptionOnly();
    setAutoScreenShotForInstabug(true);
    setShakingThreshold();
};

const StartApp = async () => {
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

StartApp();
