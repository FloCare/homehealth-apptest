import {Navigation} from 'react-native-navigation';
import {screenNames} from '../utils/constants';
import AddPatientScreenContainer from './AddPatientScreenContainer';
import PatientDetailScreenContainer from './PatientDetailScreenContainer';
import PatientListScreenContainer from './PatientListScreenContainer';
import AddNoteScreenContainer from './AddNoteScreenContainer';
import {HomeScreenContainer} from '../components/HomeScreen/HomeScreenContainer';
import {WelcomePageScreen} from '../components/WelcomePageScreen';
import {InviteScreen} from '../components/InviteScreen';
import {PasscodeVerificationScreen} from '../components/PasscodeVerificationScreen';
import {AccessCodeScreen} from '../components/AccessCodeScreen';
import {ThankYouScreen} from '../components/ThankYouScreen';
import {VisitListScreenContainer} from '../components/VisitListScreen/visitListScreenContainer';
import {AddVisitsScreenContainer} from '../components/AddVisitsScreen/AddVisitsScreenContainer';
import AddStopScreenContainer from './AddStopScreenContainer';
import {VisitMapScreenController} from '../components/VisitMapScreen/VisitMapScreenController';
import {ScreenWithCalendarComponent} from '../components/common/screenWithCalendarComponent';
import StopListScreenContainer from './StopListScreenContainer';
import AddVisitsForPatientScreen from '../components/AddVisitsScreen/AddVisitsForPatientScreen';
import {todayMomentInUTCMidnight} from '../utils/utils';
import {CreateAndSaveDummies, floDB, Visit, VisitOrder} from '../utils/data/schema';
import {MoreScreen} from '../components/MoreScreen/MoreScreen';

const RegisterScreens = () => {
    if (floDB.objects(Visit.schema.name).length === 0) {
        CreateAndSaveDummies();
        CreateAndSaveDummies();
        CreateAndSaveDummies();
        CreateAndSaveDummies();
        CreateAndSaveDummies();
        CreateAndSaveDummies();
        CreateAndSaveDummies();
        CreateAndSaveDummies();
        CreateAndSaveDummies();
        CreateAndSaveDummies();
        CreateAndSaveDummies();
        CreateAndSaveDummies();
        CreateAndSaveDummies();
        CreateAndSaveDummies();
        CreateAndSaveDummies();

        const visitOrder = floDB.objectForPrimaryKey(VisitOrder, todayMomentInUTCMidnight().valueOf());
        floDB.write(() => {
            visitOrder.visitList = floDB.objects(Visit);
        });
    }
    console.disableYellowBox = true;

    Navigation.registerComponent(screenNames.addPatient, () => AddPatientScreenContainer);
    Navigation.registerComponent(screenNames.addNote, () => AddNoteScreenContainer);
    Navigation.registerComponent(screenNames.patientDetails, () => PatientDetailScreenContainer);
    Navigation.registerComponent(screenNames.patientList, () => PatientListScreenContainer);
    Navigation.registerComponent(screenNames.homeScreen, () => HomeScreenContainer);
    Navigation.registerComponent(screenNames.moreScreen, () => MoreScreen);
    Navigation.registerComponent(screenNames.welcomeScreen, () => WelcomePageScreen);
    Navigation.registerComponent(screenNames.inviteScreen, () => InviteScreen);
    Navigation.registerComponent(screenNames.thankyouScreen, () => ThankYouScreen);
    Navigation.registerComponent(screenNames.passcodeVerificationScreen, () => PasscodeVerificationScreen);
    Navigation.registerComponent(screenNames.accessCodeScreen, () => AccessCodeScreen);
    Navigation.registerComponent(screenNames.visitListScreen, () => ScreenWithCalendarComponent(VisitListScreenContainer));
    Navigation.registerComponent(screenNames.visitMapScreen, () => ScreenWithCalendarComponent(VisitMapScreenController));
    Navigation.registerComponent(screenNames.addVisitScreen, () => ScreenWithCalendarComponent(AddVisitsScreenContainer));
    Navigation.registerComponent(screenNames.addStop, () => AddStopScreenContainer);
    Navigation.registerComponent(screenNames.stopList, () => StopListScreenContainer);
    Navigation.registerComponent(screenNames.addVisitsForPatientScreen, () => AddVisitsForPatientScreen);
};

export {RegisterScreens};
