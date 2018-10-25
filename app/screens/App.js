import {Platform} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {screenNames, PrimaryColor} from '../utils/constants';
import {Images} from '../Images';

import {initialiseApp} from './InitialiseApp';

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

const StartApp = async (key, syncDataFromServer) => {
    await initialiseApp(key, syncDataFromServer);
    Navigation.startTabBasedApp({
        tabs: [
            {
                title: 'Home Screen',
                label: 'Today',
                icon: Images.calendar,
                screen: screenNames.homeScreen,
                navigatorStyle: {navBarHidden: true, statusBarTextColorSchemeSingleScreen: 'dark'},
                passProps: {
                    syncDataFromServer
                }
            },
            {
                title: 'Patients',
                label: 'Patients',
                icon: Images.person_ic,
                screen: screenNames.patientList,
                navigatorStyle: getLargeNavBarOrSubstitute()
            },
            {
                title: 'Notifications',
                label: 'Notifications',
                icon: Images.notificationBell,
                screen: screenNames.notificationScreen,
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
