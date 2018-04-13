import {Navigation} from 'react-native-navigation';
import {RegisterScreens} from './screens';

RegisterScreens();

Navigation.startTabBasedApp({
    tabs: [
        {
            label: 'two',
            icon: require('../resources/ic_fiber_pin_2x.png'),
            screen: 'VisitsList'
        },
        {
            label: 'add',
            icon: require('../resources/ic_location_on_black_24dp.png'),
            screen: 'AddPatient'
        },
        {
            label: 'details',
            icon: require('../resources/ic_location_on_black_24dp.png'),
            screen: 'PatientDetails'
        }
    ]
});
