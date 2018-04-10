import {PatientSchema} from "./schema";
import Realm from 'realm'

export function writePatientToDB(patient) {
    Realm.open({schema: [PatientSchema]}).
    then(realm => {
        realm.write(()=>realm.create(PatientSchema.name, patient));
    });
}

export function getAllLocalPatients() {
    Realm.open({schema: [PatientSchema]}).
    then(realm => {
        realm.objects(PatientSchema.name);
    });
}