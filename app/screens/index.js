import {Navigation} from 'react-native-navigation';
import {VisitsScreenContainer} from './visitsScreenContainer';
import AddPatientScreenContainer from './AddPatientScreenContainer';
import PatientDetailScreenContainer from './PatientDetailScreenContainer';
import {VisitListContainer} from '../components/common/visitListContainer';

const RegisterScreens = () => {
    Navigation.registerComponent('VisitsList', () => VisitsScreenContainer);
    Navigation.registerComponent('AddPatient', () => AddPatientScreenContainer);
    Navigation.registerComponent('PatientDetails', () => PatientDetailScreenContainer);
    Navigation.registerComponent('VisitsList', () => VisitsScreenContainer);
    Navigation.registerComponent('Visit2', () => VisitListContainer);
};

export {RegisterScreens};
