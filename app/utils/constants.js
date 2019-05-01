import {Platform} from 'react-native';

const PrimaryColor = '#64CCC9';
const ErrorMessageColor = '#F51414';
const defaultBackGroundColor = '#FFFFFF';
const detailBackGroundColor = '#F7F7F7';

const TransparentPrimaryColor = (opacity) =>
    // Todo: Can use a method to convert PrimaryColor in hexcode 
    // Todo: to rgba
     `rgba(69, 206, 177, ${opacity})`;
const PrimaryFontFamily = Platform.select({ios: 'SFProText-Regular', android: 'SF-Pro-Text-Regular'});

const MaxFailedAttempts = 4;
const LockTimeOnFailedAttempts = 1; // minutes

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
    notificationScreen: 'NotificationScreen',
    moreScreen: 'MoreScreen',
    loginScreen: 'LoginScreen',
    welcomeScreen: 'WelcomeScreen',
    inviteScreen: 'InviteScreen',
    setPassCodeScreen: 'SetPassCodeScreen',
    settingUpScreen: 'settingUpScreen',
    thankyouScreen: 'ThankYouScreen',
    passcodeVerificationScreen: 'passcodeVerificationScreen',
    legal: 'Legal',

    addPatient: 'AddPatient',
    patient: 'Patient',
    patientDetails: 'PatientDetails',
    addNote: 'AddNote',
    addStop: 'AddStop',
    stopList: 'StopList',

    addVisitScreen: 'AddVisitScreen',
    addOrRescheduleVisitsLightBox: 'AddOrRescheduleVisitsLightBox',
    imageLightBox: 'ImageLightBox',
    onlinePatientLightBox: 'OnlinePatientLightBox',
    addTaskComponent: 'addTaskComponent',
    milesLogScreen: 'MilesLogScreen',
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
    DOWNLOAD_MISSING_IMAGE: 'DownloadMissingImage',
    FULLSCREEN_IMAGE: 'FullScreenImage',
    PATIENT_ADDED: 'PatientAdded',
    FLOATING_BUTTON: 'FloatingButton',
    ADD_STOP: 'StopAdded',
    NEW_NOTE_NOTIFICATION: 'NewNoteNotification',
    COLLABORATION: 'Collaboration',
    ADD_EDIT_MILES: 'AddOrEditMiles',
    SEND_REPORT: 'SendReport',
    SEND_REPORT_RESPONSE: 'SendReportResponse',
    ADD_TASK: 'AddTask',
    MARK_TASK_DONE: 'MarkTaskDone',
};

const parameterValues = {
    SUCCESS: 'success',
    FAILURE: 'failure',
    IMPORT_PATIENT: 'import_patient',
    CALL_PATIENT: 'call_patient',
    CALL_EMERGENCY: 'call_emergency',
    CALL_PHYSICIAN: 'call_physician',
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
    RESCHEDULE: 'date_reschedule',
    DELETE_VISIT: 'delete_visit',
    ADD_TIME: 'add_time',
    EDIT_TIME: 'edit_time',
    VIEW_VISIT_CALENDAR: 'view_visit_calendar',

};

const notificationType = {
    VISIT_COLLISION: 'VISIT_COLLISION',
    NEW_NOTE: 'NEW_NOTE',
    NEW_PATIENT: 'NEW_PATIENT'
};

const noteMessageType = {
    NEW_NOTE: 'NEW_NOTE',
    RICH_NEW_NOTE: 'RICH_NEW_NOTE'
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
export const pubnubPubKey = '';
//ending in 524 is dev key
export const pubnubSubKey = '';

//ending in a3b is dev key
export const pubnubEternalPubKey = '';
//ending in 524 is dev key
export const pubnubEternalSubKey = '';

export const instabugKey = '';

// export const apiServerURL = 'http://192.168.1.101:8000';
export const apiServerURL = '';


export {setInActivityTimer, clearInActivityTimer, lastActiveTime, diagnosisList,
    screenNames, visitType, PrimaryColor, TransparentPrimaryColor, ErrorMessageColor,
    PrimaryFontFamily, userProperties, eventNames, parameterValues, visitSubjects,
    notificationType, MaxFailedAttempts, LockTimeOnFailedAttempts, defaultBackGroundColor,
    detailBackGroundColor, noteMessageType};
