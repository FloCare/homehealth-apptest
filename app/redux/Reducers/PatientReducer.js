import {PatientActions} from '../Actions';

export default function PatientReducer(patients = {}, action) {
    switch (action.type) {
        case PatientActions.ADD_PATIENTS:
            if (action.patientList) { return {...action.patientList, ...patients}; }
            return patients;
        case PatientActions.EDIT_PATIENTS:
            return {...patients, ...action.patientList};
        case PatientActions.ARCHIVE_PATIENTS:
            const newPatients = {...patients};
            if (newPatients && action.patientList) {
                action.patientList.forEach(
                    patientID => {
                        if (newPatients[patientID]) {
                            newPatients[patientID].archived = true;
                        }
                    });
            }
            return newPatients;
        default:
            return patients;
    }
}
