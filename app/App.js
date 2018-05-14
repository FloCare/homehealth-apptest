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
    hideBackButtonTitle: true,
    statusBarTextColorScheme: 'light'
};

Navigation.startTabBasedApp({
    tabs: [
        // {
        //     title: 'Home Screen',
        //     label: 'Today',
        //     icon: Images.calendar,
        //     screen: screenNames.homeScreen,
        //     navigatorStyle: {navBarHidden: true, statusBarTextColorSchemeSingleScreen: 'dark'}
        // },
        // {
        //     title: 'Patients',
        //     label: 'Patients',
        //     icon: Images.person_ic,
        //     screen: screenNames.patientList,
        // },
        {
            icon: Images.person_ic,
            screen: screenNames.inviteScreen,
            navigatorStyle: {navBarHidden: false}
        }
    ],
    appStyle: navigatorStyle,
    tabsStyle: navigatorStyle
});
