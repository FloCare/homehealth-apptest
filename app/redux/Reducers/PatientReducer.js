import {PatientActions} from '../Actions';

export default function PatientReducer(patients = {}, action) {
    switch (action.type) {
        case PatientActions.ADD_PATIENTS:
            if (action.patientMap) {
                if (action.updateExisting) { return {...patients, ...action.patientMap}; }
                return {...action.patientMap, ...patients};
            }
            return patients;
        case PatientActions.EDIT_PATIENTS:
            return {...patients, ...action.patientMap};
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
