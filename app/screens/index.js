import {Navigation} from 'react-native-navigation';
import moment from 'moment/moment';
import {screenNames} from '../utils/constants';
import AddPatientScreenContainer from './AddPatientScreenContainer';
import PatientDetailScreenContainer from './PatientDetailScreenContainer';
import PatientListScreenContainer from './PatientListScreenContainer';
import AddNoteScreenContainer from './AddNoteScreenContainer';
import {CreateAndSaveDummies, floDB, Visit, VisitOrder} from '../utils/data/schema';
import {HomeScreenContainer} from '../components/HomeScreen/HomeScreenContainer';
import {VisitListScreenContainer} from '../components/VisitListScreen/visitListScreenContainer';
import {AddVisitsScreenContainer} from '../components/AddVisitsScreen/AddVisitsScreenContainer';
import AddStopScreenContainer from './AddStopScreenContainer';
import {VisitMapScreenController} from '../components/VisitMapScreen/VisitMapScreenController';
import {ScreenWithCalendarComponent} from '../components/common/screenWithCalendarComponent';
import StopListScreenContainer from './StopListScreenContainer';
import AddVisitsForPatientScreen from '../components/AddVisitsScreen/AddVisitsForPatientScreen';

const RegisterScreens = () => {
    // if (floDB.objects(Visit.schema.name).length === 0) {
    //     CreateAndSaveDummies();
    //     CreateAndSaveDummies();
    //     CreateAndSaveDummies();
    //     CreateAndSaveDummies();
    //     CreateAndSaveDummies();
    //
    //     const visitOrder = floDB.objectForPrimaryKey(VisitOrder, moment().utc().startOf('day').valueOf());
    //     floDB.write(() => {
    //         visitOrder.visitList = floDB.objects(Visit);
    //     });
    // }

    Navigation.registerComponent(screenNames.addPatient, () => AddPatientScreenContainer);
    Navigation.registerComponent(screenNames.addNote, () => AddNoteScreenContainer);
    Navigation.registerComponent(screenNames.patientDetails, () => PatientDetailScreenContainer);
    Navigation.registerComponent(screenNames.patientList, () => PatientListScreenContainer);
    Navigation.registerComponent(screenNames.homeScreen, () => HomeScreenContainer);
    Navigation.registerComponent(screenNames.visitListScreen, () => ScreenWithCalendarComponent(VisitListScreenContainer));
    Navigation.registerComponent(screenNames.visitMapScreen, () => ScreenWithCalendarComponent(VisitMapScreenController));
    Navigation.registerComponent(screenNames.addVisitScreen, () => ScreenWithCalendarComponent(AddVisitsScreenContainer));
    Navigation.registerComponent(screenNames.addStop, () => AddStopScreenContainer);
    Navigation.registerComponent(screenNames.stopList, () => StopListScreenContainer);
    Navigation.registerComponent(screenNames.addVisitsForPatientScreen, () => AddVisitsForPatientScreen);
};

export {RegisterScreens};
