import {Navigation} from 'react-native-navigation';
import AddPatientScreenContainer from './AddPatientScreenContainer';
import PatientDetailScreenContainer from './PatientDetailScreenContainer';
import {CreateAndSaveDummies, MyRealm, Visit} from '../utils/data/schema';
import {HomeScreenContainer} from '../components/HomeScreen/HomeScreenContainer';
import {VisitsScreenContainer} from '../components/VisitScreen/visitsScreenContainer';

import {CalendarPickerButton} from '../components/common/calendarPickerButton';
import {AddVisitsScreenContainer} from '../components/AddVisitsScreen/AddVisitsScreenContainer';

const RegisterScreens = () => {
    if (MyRealm.objects(Visit.schema.name).length === 0) {
        CreateAndSaveDummies();
        CreateAndSaveDummies();
        CreateAndSaveDummies();
        CreateAndSaveDummies();
        CreateAndSaveDummies();
        CreateAndSaveDummies();
    }

    Navigation.registerComponent('AddPatient', () => AddPatientScreenContainer);
    Navigation.registerComponent('PatientDetails', () => PatientDetailScreenContainer);
    Navigation.registerComponent('HomeScreen', () => HomeScreenContainer);
    Navigation.registerComponent('VisitsScreen', () => VisitsScreenContainer);
    // Navigation.registerComponent('AddVisitsScreen', () => AddVisitsScreenContainer);
    Navigation.registerComponent('CalendarPickerButton', () => CalendarPickerButton);
};

export {RegisterScreens};
