import PatientActions from '../Actions';

export function PatientReducer(patients = {}, action) {
    switch (action.type) {
        case PatientActions.ADD_PATIENTS:
            return {...patients, ...action.patientList};
        case PatientActions.EDIT_PATIENT:
            return {...patients, ...action.patientList};
        default:
            return patients;
    }
}
