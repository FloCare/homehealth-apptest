import Realm from 'realm';
import { PatientSchema } from './schema';

function writePatientToDB(patient) {
    Realm.open({ schema: [PatientSchema] })
        .then(realm => {
            realm.write(() => realm.create(PatientSchema.name, patient));
        });
}

function getAllLocalPatients() {
    Realm.open({ schema: [PatientSchema] })
        .then(realm => {
            realm.objects(PatientSchema.name);
        });
}

export default { writePatientToDB, getAllLocalPatients };
