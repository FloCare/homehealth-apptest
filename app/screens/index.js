import {Navigation} from 'react-native-navigation';
import {VisitsScreenContainer} from './visitsScreenContainer';
import AddPatientScreenContainer from './AddPatientScreenContainer';
import PatientDetailScreenContainer from './PatientDetailScreenContainer';
import PatientListScreenContainer from './PatientListScreenContainer';

const RegisterScreens = () => {
    Navigation.registerComponent('VisitsList', () => VisitsScreenContainer);
    Navigation.registerComponent('AddPatient', () => AddPatientScreenContainer);
    Navigation.registerComponent('PatientDetails', () => PatientDetailScreenContainer);
    Navigation.registerComponent('PatientList', () => PatientListScreenContainer);
};

export {RegisterScreens};
