import {Navigation} from 'react-native-navigation';
import {screenNames} from '../utils/constants';
import AddPatientScreenContainer from './AddPatientScreenContainer';
import PatientDetailScreenContainer from './PatientDetailScreenContainer';
import PatientListScreenContainer from './PatientListScreenContainer';
import AddNoteScreenContainer from './AddNoteScreenContainer';
import {CreateAndSaveDummies, floDB, Visit} from '../utils/data/schema';
import {HomeScreenContainer} from '../components/HomeScreen/HomeScreenContainer';
import {VisitsScreenContainer} from '../components/VisitScreen/visitsScreenContainer';
import {CalendarPickerButton} from '../components/common/calendarPickerButton';
// import {AddVisitsScreenContainer} from '../components/AddVisitsScreen/AddVisitsScreenContainer';

const RegisterScreens = () => {
    if (floDB.objects(Visit.schema.name).length === 0) {
        CreateAndSaveDummies();
        CreateAndSaveDummies();
        CreateAndSaveDummies();
        CreateAndSaveDummies();
        CreateAndSaveDummies();
    }

    Navigation.registerComponent(screenNames.addPatient, () => AddPatientScreenContainer);
    Navigation.registerComponent(screenNames.addNote, () => AddNoteScreenContainer);
    Navigation.registerComponent(screenNames.patientDetails, () => PatientDetailScreenContainer);
    Navigation.registerComponent(screenNames.patientList, () => PatientListScreenContainer);
    Navigation.registerComponent(screenNames.homeScreen, () => HomeScreenContainer);
    Navigation.registerComponent(screenNames.visitsScreen, () => VisitsScreenContainer);
    // Navigation.registerComponent('AddVisitsScreen', () => AddVisitsScreenContainer);
    Navigation.registerComponent('CalendarPickerButton', () => CalendarPickerButton);
};

export {RegisterScreens};
