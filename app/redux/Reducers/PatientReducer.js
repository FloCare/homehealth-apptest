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
            Object.keys(action.patientList).map(
                key => {
                    newPatients[key].archived = true;
                    return newPatients[key];
                });
            return newPatients;
        default:
            return patients;
    }
}
