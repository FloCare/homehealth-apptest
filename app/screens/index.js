import {Navigation} from 'react-native-navigation';
import {VisitsScreenContainer} from './visitsScreenContainer';

const RegisterScreens = () => {
    Navigation.registerComponent('VisitsList', () => VisitsScreenContainer);
};

export {RegisterScreens};
