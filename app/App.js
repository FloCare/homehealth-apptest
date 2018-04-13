import {Navigation} from 'react-native-navigation';
import {RegisterScreens} from './screens';

RegisterScreens();

Navigation.startTabBasedApp({
    tabs: [
        {
            label: 'two',
            icon: require('../resources/ic_fiber_pin_2x.png'),
            screen: 'VisitsList'
        }
    ]
});
