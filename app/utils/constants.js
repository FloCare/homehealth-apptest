const PrimaryColor = '#45ceb1';
const TransparentPrimaryColor = (opacity) => {
    // Todo: Can use a method to convert PrimaryColor in hexcode 
    // Todo: to rgba
    return `rgba(69, 206, 177, ${opacity})`;
};
const PrimaryFontFamily = 'SF-Pro-Text-Regular';

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

export {diagnosisList, screenNames, visitType, PrimaryColor, TransparentPrimaryColor, PrimaryFontFamily};
