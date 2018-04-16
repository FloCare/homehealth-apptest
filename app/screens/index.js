import {Navigation} from 'react-native-navigation';
import {VisitsScreenContainer} from './visitsScreenContainer';
import AddPatientScreenContainer from './AddPatientScreenContainer';
import PatientDetailScreenContainer from './PatientDetailScreenContainer';
import {VisitListContainer} from '../components/common/visitListContainer';
import {VisitSummary} from '../components/HomeScreen/VisitSummary';
import {CreateAndSaveDummies} from "../utils/data/schema";
import {HomeScreenContainer} from "../components/HomeScreen/HomeScreenContainer";

const RegisterScreens = () => {
    CreateAndSaveDummies(true);
    CreateAndSaveDummies(true);
    CreateAndSaveDummies(true);
    CreateAndSaveDummies(true);
    CreateAndSaveDummies(true);
    CreateAndSaveDummies(true);

    Navigation.registerComponent('VisitsList', () => VisitsScreenContainer);
    Navigation.registerComponent('AddPatient', () => AddPatientScreenContainer);
    Navigation.registerComponent('PatientDetails', () => PatientDetailScreenContainer);
    Navigation.registerComponent('VisitsList', () => VisitsScreenContainer);
    Navigation.registerComponent('Visit2', () => VisitListContainer);
    Navigation.registerComponent('HomeScreen', () => HomeScreenContainer);
};

export {RegisterScreens};
