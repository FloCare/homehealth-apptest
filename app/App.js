import {Platform} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {RegisterScreens} from './screens';
import {screenNames, PrimaryColor} from './utils/constants';
import {Images} from './Images';

RegisterScreens();

const navigatorStyle = {
    navBarBackgroundColor: PrimaryColor,
    navBarTextColor: '#ffffff',
    navBarButtonColor: 'white',
    tabBarBackgroundColor: '#f8f8f8',
    tabBarTranslucent: false,
    tabBarSelectedButtonColor: PrimaryColor,
    tabBarButtonColor: 'black',
    hideBackButtonTitle: true,
    statusBarTextColorScheme: 'light',
    forceTitlesDisplay: true,
    keepStyleAcrossPush: false
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
        // {
        //     label: 'Welcome',
        //     icon: Images.person_ic,
        //     screen: screenNames.inviteScreen,
        //     navigatorStyle: {navBarHidden: false}
        // }
    ],
    appStyle: navigatorStyle,
    tabsStyle: navigatorStyle
});
