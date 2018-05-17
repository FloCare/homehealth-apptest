import {Navigation} from 'react-native-navigation';
import {RegisterScreens} from '.';
import {screenNames, PrimaryColor} from '../utils/constants';
import {Images} from '../Images';

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
    RegisterScreens(key);

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
