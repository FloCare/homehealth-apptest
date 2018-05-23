import {Platform} from 'react-native';

const PrimaryColor = '#45ceb1';
const TransparentPrimaryColor = (opacity) => 
    // Todo: Can use a method to convert PrimaryColor in hexcode 
    // Todo: to rgba
     `rgba(69, 206, 177, ${opacity})`;
const PrimaryFontFamily = Platform.select({ios: 'SFProText-Regular', android: 'SF-Pro-Text-Regular'});


const diagnosisList = [
    {
        name: 'Diagnosis',
        id: 0,
        children: [{
            name: 'A',
            id: 1,
        }, {
            name: 'BALL',
            id: 2,
        }, {
            name: 'CAT',
            id: 3,
        }, {
            name: 'DOG',
            id: 4,
        }, {
            name: 'EAT',
            id: 5,
        }, {
            name: 'FAT',
            id: 6,
        }]
    },
];

const screenNames = {
    //Top Level Screens
    homeScreen: 'HomeScreen',
    patientList: 'PatientList',
    moreScreen: 'MoreScreen',
    welcomeScreen: 'WelcomeScreen',
    inviteScreen: 'InviteScreen',
    setPassCodeScreen: 'SetPassCodeScreen',
    thankyouScreen: 'ThankYouScreen',
    passcodeVerificationScreen: 'passcodeVerificationScreen',
    legal: 'Legal',

    addPatient: 'AddPatient',
    patientDetails: 'PatientDetails',
    addNote: 'AddNote',
    addStop: 'AddStop',
    stopList: 'StopList',

    addVisitScreen: 'AddVisitScreen',
    addVisitsForPatientScreen: 'AddVisitsForPatientScreen',
    visitListScreen: 'VisitListScreen',
    visitMapScreen: 'VisitMapScreen',
};

const visitType = {
    patient: 'patient',
    place: 'place'
};

const userProperties = {
    INVITE_CODE: 'invite_code'
}

const eventNames = {

    INVITE: 'Invite',
    PASSCODE: 'Passcode',
    VISIT_ACTIONS: 'VisitActions',
    PATIENT_ACTIONS: 'PatientActions',
    VISIT_VIEW: 'VisitView',
    ADD_NOTE: 'AddNote',
    ADD_VISIT: 'AddVisit',
    PATIENT_ADDED: 'PatientAdded',
    FLOATING_BUTTON: 'FloatingButton',
    ADD_STOP: 'StopAdded',
}

const parameterValues = {
    SUCCESS : 'success',
    FAILURE : 'failure',
    CALL: 'call',
    NAVIGATION: 'navigation',
    EDIT_NOTES: 'edit_notes',
    MAP: 'map',
    LIST: 'list',
    ADD_PATIENT: 'add_patient',
    ADD_NOTE: 'add_note',
    ADD_VISIT: 'add_visit',
    TOGGLE: 'toggle',
    DND: 'dnd',
    DETAILS: 'details',

}

let inActivityTimer = null;
const inActivityTime = 10000; // ms
let lastActiveTime = new Date();

const setInActivityTimer = (f) => {
    if (inActivityTimer) {
        clearInActivityTimer();
    }
    inActivityTimer = setTimeout(f, inActivityTime);
    return inActivityTimer;
};

const clearInActivityTimer = () => {
    if (inActivityTimer) {
        clearTimeout(inActivityTimer);
        inActivityTimer = null;
    }
};

export {setInActivityTimer, clearInActivityTimer, lastActiveTime, diagnosisList, screenNames, visitType, PrimaryColor, TransparentPrimaryColor, PrimaryFontFamily, userProperties, eventNames, parameterValues};
