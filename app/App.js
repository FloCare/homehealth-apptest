import {Navigation} from 'react-native-navigation';
import {RegisterScreens} from './screens';
import {screenNames, PrimaryColor} from './utils/constants';

RegisterScreens();

// const navigatorStyle = {
//     navBarBackgroundColor: PrimaryColor,
//     navBarTextColor: '#ffffff',
//     navBarButtonColor: '#666666',
//     tabBarBackgroundColor: PrimaryColor,
// };

Navigation.startTabBasedApp({
    tabs: [
        // {
        //     label: 'two',
        //     icon: require('../resources/ic_fiber_pin_2x.png'),
        //     screen: 'VisitsList'
        // },
        // {
        //     title: 'Visits',
        //     label: 'two',
        //     icon: require('../resources/ic_fiber_pin_2x.png'),
        //     screen: 'Visit2',
        //     navigatorStyle
        // },
        {
            title: 'Home Screen',
            label: 'Today',
            icon: require('../resources/calendar.png'),
            screen: screenNames.homeScreen,
            navigatorStyle: {navBarHidden: true}
        },
        // {
        //     title: 'Visits Screen',
        //     label: 'visits',
        //     icon: require('../resources/ic_location_on_black_24dp.png'),
        //     screen: screenNames.visitListScreen,
        //     navigatorStyle
        // },
        // {
        //     title: 'Add new patient',
        //     label: 'add',
        //     icon: require('../resources/ic_location_on_black_24dp.png'),
        //     screen: screenNames.addPatient,
        //     navigatorStyle
        // },
        {
            title: 'Patients',
            label: 'Patients',
            icon: require('../resources/person_ic.png'),
            screen: screenNames.patientList,
        }
        // {
        //     title: 'RealmTest',
        //     label: 'realmTest',
        //     icon: require('../resources/ic_location_on_black_24dp.png'),
        //     screen: 'RealmTest',
        //     navigatorStyle
        // }
    ],
    appStyle: {
        navBarBackgroundColor: PrimaryColor,
        navBarTextColor: '#ffffff',
        navBarButtonColor: 'white',
        tabBarBackgroundColor: '#f8f8f8',
        tabBarTranslucent: false,
        tabBarSelectedButtonColor: PrimaryColor
    }
});
