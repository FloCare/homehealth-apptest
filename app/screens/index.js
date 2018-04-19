import {Navigation} from 'react-native-navigation';
import {VisitsScreenContainer} from './visitsScreenContainer';
import AddPatientScreenContainer from './AddPatientScreenContainer';
import PatientDetailScreenContainer from './PatientDetailScreenContainer';
import PatientListScreenContainer from './PatientListScreenContainer';
import {VisitListContainer} from '../components/common/visitListContainer';
import {screenNames} from '../utils/constants';

const RegisterScreens = () => {
    Navigation.registerComponent('VisitsList', () => VisitsScreenContainer);
    Navigation.registerComponent(screenNames.addPatient, () => AddPatientScreenContainer);
    Navigation.registerComponent(screenNames.patientDetails, () => PatientDetailScreenContainer);
    Navigation.registerComponent(screenNames.patientList, () => PatientListScreenContainer);
    Navigation.registerComponent('VisitsList', () => VisitsScreenContainer);
    Navigation.registerComponent('Visit2', () => VisitListContainer);
};

export {RegisterScreens};
