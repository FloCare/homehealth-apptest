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

    visitListScreen: 'VisitListScreen',
};

export {diagnosisList, screenNames};
