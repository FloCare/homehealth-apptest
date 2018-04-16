import {Navigation} from 'react-native-navigation';
import {VisitsScreenContainer} from './visitsScreenContainer';
import {VisitListContainer} from '../components/common/visitListContainer';

const RegisterScreens = () => {
    Navigation.registerComponent('VisitsList', () => VisitsScreenContainer);
    Navigation.registerComponent('Visit2', () => VisitListContainer);
};

export {RegisterScreens};
