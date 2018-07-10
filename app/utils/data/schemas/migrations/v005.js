import {Patient} from '../../schema';

export const v005 = (oldRealm, newRealm) => {
    if (oldRealm.schemaVersion < 5) {
        const oldPatientObjects = oldRealm.objects(Patient.getSchemaName());
        const newPatientObjects = newRealm.objects(Patient.getSchemaName());

        for (let i = 0; i < oldPatientObjects.length; i++) {
            newPatientObjects[i].creationTimestamp = oldPatientObjects[i].timestamp;
            newPatientObjects[i].assignmentTimestamp = oldPatientObjects[i].timestamp;
        }
    }
};
