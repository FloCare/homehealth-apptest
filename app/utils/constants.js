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
    loginScreen: 'LoginScreen',
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
    addOrRescheduleVisitsLightBox: 'AddOrRescheduleVisitsLightBox',
    visitListScreen: 'VisitListScreen',
    visitMapScreen: 'VisitMapScreen',
    visitDayViewScreen: 'VisitDayViewScreen',

    // Firebase screen names
    home: 'home',
    more: 'more',
    login: 'login',
    welcome: 'welcome',
    invite: 'invite',
    setPassCode: 'set_passcode',
    passcodeVerification: 'passcode_verification',
    addPatientScreen: 'add_patient',
    patientDetailsScreen: 'patient_details',
    patientListScreen: 'patient_list',
    addNoteScreen: 'add_note',
    addStopScreen: 'add_stop',
    stopListScreen: 'stop_list',
    addVisit: 'add_visit',
    addVisitsForPatient: 'add_visits_for_patient',
    visitList: 'visit_list',
    visitMap: 'visit_map',
};

const visitType = {
    patient: 'patient',
    place: 'place'
};

const userProperties = {
    INVITE_CODE: 'invite_code',
    USER_ID: 'user_id',
    ROLE: 'role',
    ORG: 'org',
    OTA_VERSION: 'ota_version',
};

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
};

const parameterValues = {
    SUCCESS: 'success',
    FAILURE: 'failure',
    CALL_PATIENT: 'call_patient',
    CALL_EMERGENCY: 'call_emergency',
    CALL_CLINICIAN: 'call_clinician',
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
    REFRESH: 'refresh',
    RESCHEDULE: 'reschedule',
    DELETE_VISIT: 'delete_visit',

};

const visitSubjects = {
    PLACE: 'Place',
    PATIENT: 'Patient'
};

let inActivityTimer = null;
const inActivityTime = 120000; // ms
const lastActiveTime = new Date();

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

//ending in a3b is dev key
export const pubnubPubKey = 'pubnubPubKey';
//ending in 524 is dev key
export const pubnubSubKey = 'pubnubSubKey';

// export const apiServerURL = 'http://192.168.1.101:8000';
export const apiServerURL = 'https://app-9707.on-aptible.com';


export {setInActivityTimer, clearInActivityTimer, lastActiveTime, diagnosisList,
    screenNames, visitType, PrimaryColor, TransparentPrimaryColor,
    PrimaryFontFamily, userProperties, eventNames, parameterValues, visitSubjects};
