import {Navigation} from 'react-native-navigation';
import {RegisterScreens} from '.';
import {screenNames, PrimaryColor} from '../utils/constants';
import {Images} from '../Images';
import {FloDB} from '../utils/data/schema';

const navigatorStyle = {
    navBarBackgroundColor: PrimaryColor,
    navBarTextColor: '#ffffff',
    navBarButtonColor: 'white',
    tabBarBackgroundColor: '#f8f8f8',
    tabBarTranslucent: false,
    tabBarSelectedButtonColor: PrimaryColor,
    hideBackButtonTitle: true,
    statusBarTextColorScheme: 'light'
};

const StartApp = (key) => {
    // Initialize the DB
    try {
        FloDB.encKey = key;
        FloDB.initialize();
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
            }
        ],
        appStyle: navigatorStyle,
        tabsStyle: navigatorStyle,
        animationType: 'fade'
    });
};

export default StartApp;
