import {Navigation} from 'react-native-navigation';
import {RegisterScreens} from './screens';
import {screenNames} from './utils/constants';

RegisterScreens();

const navigatorStyle = {
    navBarBackgroundColor: '#45ceb1',
    navBarTextColor: '#ffffff',
    navBarButtonColor: '#666666',
    tabBarBackgroundColor: '#45ceb1',
};

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
            label: 'home',
            icon: require('../resources/ic_location_on_black_24dp.png'),
            screen: screenNames.homeScreen,
            navigatorStyle: Object.assign({}, navigatorStyle, {navBarHidden: true})
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
            label: 'patientList',
            icon: require('../resources/ic_location_on_black_24dp.png'),
            screen: screenNames.patientList,
            navigatorStyle
        }
        // {
        //     title: 'RealmTest',
        //     label: 'realmTest',
        //     icon: require('../resources/ic_location_on_black_24dp.png'),
        //     screen: 'RealmTest',
        //     navigatorStyle
        // }
    ]
});
