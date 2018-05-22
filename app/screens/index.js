import {Navigation} from 'react-native-navigation';
import {screenNames} from '../utils/constants';
import AddPatientScreenContainer from './AddPatientScreenContainer';
import PatientDetailScreenContainer from './PatientDetailScreenContainer';
import PatientListScreenContainer from './PatientListScreenContainer';
import AddNoteScreenContainer from './AddNoteScreenContainer';
import {HomeScreenContainer} from '../components/HomeScreen/HomeScreenContainer';
import {VisitListScreenContainer} from '../components/VisitListScreen/visitListScreenContainer';
import {AddVisitsScreenContainer} from '../components/AddVisitsScreen/AddVisitsScreenContainer';
import AddStopScreenContainer from './AddStopScreenContainer';
import {VisitMapScreenController} from '../components/VisitMapScreen/VisitMapScreenController';
import {ScreenWithCalendarComponent} from '../components/common/screenWithCalendarComponent';
import StopListScreenContainer from './StopListScreenContainer';
import AddVisitsForPatientScreen from '../components/AddVisitsScreen/AddVisitsForPatientScreen';
import {todayMomentInUTCMidnight} from '../utils/utils';
import {CreateAndSaveDummies, Visit, VisitOrder} from '../utils/data/schema';
import {MoreScreen} from '../components/MoreScreen/MoreScreen';
import {LegalScreen} from '../components/LegalScreen';
import LockOnInActivity from '../components/common/LockOnInActivity';

const RegisterScreens = () => {
    // if (floDB.objects(Visit.schema.name).length === 0) {
    //     CreateAndSaveDummies();
    //     CreateAndSaveDummies();
    //     CreateAndSaveDummies();
    //     CreateAndSaveDummies();
    //     CreateAndSaveDummies();
    //     CreateAndSaveDummies();
    //     CreateAndSaveDummies();
    //     CreateAndSaveDummies();
    //     CreateAndSaveDummies();
    //     CreateAndSaveDummies();
    //     CreateAndSaveDummies();
    //     CreateAndSaveDummies();
    //     CreateAndSaveDummies();
    //     CreateAndSaveDummies();
    //     CreateAndSaveDummies();

    //     const visitOrder = floDB.objectForPrimaryKey(VisitOrder, todayMomentInUTCMidnight().valueOf());
    //     floDB.write(() => {
    //         visitOrder.visitList = floDB.objects(Visit);
    //     });
    // }
    console.disableYellowBox = true;

    Navigation.registerComponent(screenNames.addPatient, () => AddPatientScreenContainer);
    Navigation.registerComponent(screenNames.addNote, () => AddNoteScreenContainer);
    Navigation.registerComponent(screenNames.patientDetails, () => PatientDetailScreenContainer);
    Navigation.registerComponent(screenNames.patientList, () => LockOnInActivity(PatientListScreenContainer));
    Navigation.registerComponent(screenNames.homeScreen, () => HomeScreenContainer);
    Navigation.registerComponent(screenNames.moreScreen, () => MoreScreen);
    Navigation.registerComponent(screenNames.legal, () => LegalScreen);
    Navigation.registerComponent(screenNames.visitListScreen, () => ScreenWithCalendarComponent(VisitListScreenContainer));
    Navigation.registerComponent(screenNames.visitMapScreen, () => ScreenWithCalendarComponent(VisitMapScreenController));
    Navigation.registerComponent(screenNames.addVisitScreen, () => ScreenWithCalendarComponent(AddVisitsScreenContainer));
    Navigation.registerComponent(screenNames.addStop, () => AddStopScreenContainer);
    Navigation.registerComponent(screenNames.stopList, () => StopListScreenContainer);
    Navigation.registerComponent(screenNames.addVisitsForPatientScreen, () => AddVisitsForPatientScreen);
};

export {RegisterScreens};
