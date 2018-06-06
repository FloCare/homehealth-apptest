import {Platform} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import {RegisterScreens} from '.';
import {screenNames, PrimaryColor} from '../utils/constants';
import {Images} from '../Images';
import {FloDBProvider} from '../utils/data/schema';
import {RootReducer} from '../redux/RootReducer';

import {initialiseService as initialisePatientService} from '../data_services/PatientDataService';
import {initialiseService as initialiseStopService} from '../data_services/PlaceDataService';
import {initialiseService as initialiseVisitService} from '../data_services/VisitDataService';
import {initialiseService as initialiseAddressService} from '../data_services/AddressDataService';
import {dateService, initialiseService as initialiseDate} from '../data_services/DateService';
import {todayMomentInUTCMidnight} from '../utils/utils';

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

    // Initialize the Redux Store
    const store = createStore(RootReducer);

    // Initialize Data Services, pass it the db and store instances
    initialiseVisitService(FloDBProvider.db, store);
    initialiseStopService(FloDBProvider.db, store);
    initialisePatientService(FloDBProvider.db, store);
    initialiseAddressService(FloDBProvider.db, store);
    initialiseDate(FloDBProvider.db, store);

    dateService.setDate(todayMomentInUTCMidnight().valueOf());

    // Register the screens
    try {
        RegisterScreens(store, Provider);
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
