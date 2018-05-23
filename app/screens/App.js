import {Platform} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {RegisterScreens} from '.';
import {screenNames, PrimaryColor} from '../utils/constants';
import {Images} from '../Images';
import {FloDBProvider} from '../utils/data/schema';

const navigatorStyle = {
    navBarBackgroundColor: PrimaryColor,
    navBarTextColor: '#ffffff',
    navBarButtonColor: 'white',
    tabBarBackgroundColor: '#f8f8f8',
    tabBarTranslucent: false,
    tabBarSelectedButtonColor: PrimaryColor,
    tabBarButtonColor: 'black',
    hideBackButtonTitle: true,
    statusBarTextColorScheme: 'light'
};

function getLargeNavBarOrSubstitute() {
    if (Platform.OS === 'ios' && parseInt(Platform.Version, 10) >= 11) {
        return {
            largeTitle: true,
            navBarBackgroundColor: PrimaryColor,
            topBarElevationShadowEnabled: false,
            navBarNoBorder: true,
            navBarButtonColor: 'white',
        };
    }

    return null;
}

const StartApp = (key) => {
    // Initialize the DB
    try {
        FloDBProvider.initialize(key);
    } catch (err) {
        console.log('Error in initializing DB: ', err);
        throw err;
    }

    try {
        RegisterScreens();
    } catch (err) {
        console.log('Error in registering screens: ', err);
        throw err;
    }

    Navigation.startTabBasedApp({
        tabs: [
            {
                title: 'Home Screen',
                label: 'Today',
                icon: Images.calendar,
                screen: screenNames.homeScreen,
                navigatorStyle: {navBarHidden: true, statusBarTextColorSchemeSingleScreen: 'dark'}
            },
            {
                title: 'Patients',
                label: 'Patients',
                icon: Images.person_ic,
                screen: screenNames.patientList,
                navigatorStyle: getLargeNavBarOrSubstitute()
            },
            {
                label: 'More',
                icon: Images.more,
                screen: screenNames.moreScreen,
                navigatorStyle: getLargeNavBarOrSubstitute()
            },
        ],
        appStyle: navigatorStyle,
        tabsStyle: navigatorStyle,
        animationType: 'fade'
    });
};

export default StartApp;
