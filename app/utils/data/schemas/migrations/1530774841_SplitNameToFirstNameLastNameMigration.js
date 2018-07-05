import {Patient} from "../../schema";

export const SplitNameToFirstNameLastNameMigration = (oldRealm, newRealm) => {
    console.log("running split name migration")
    if (oldRealm.schemaVersion < 4) {
        console.log("starting migration");
        const oldPatientObjects = oldRealm.objects(Patient.getSchemaName());
        const newPatientObjects = newRealm.objects(Patient.getSchemaName());

        for (let i = 0; i < oldPatientObjects.length; i++) {
            const separatorIndex = oldPatientObjects[i].name.indexOf(" ");
            if (separatorIndex < 0) {
                newPatientObjects[i].firstName = oldPatientObjects[i].name;
                newPatientObjects[i].lastName = null;
            }
            else {
                newPatientObjects[i].firstName = oldPatientObjects[i].name.substr(0, separatorIndex);
                newPatientObjects[i].lastName = oldPatientObjects[i].name.substr(separatorIndex + 1);
            }
        }
    }
};