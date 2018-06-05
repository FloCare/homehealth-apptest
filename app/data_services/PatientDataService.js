import {Patient} from '../utils/data/schema';
import {PatientActions} from '../redux/Actions';
import {arrayToObjectByKey} from '../utils/collectionUtils';

class PatientDataService {
    static getFlatPatient(patient) {
        return {
            patientID: patient.patientID,
            name: patient.name,
            address: patient.address.addressID,
            primaryContact: patient.primaryContact,
            emergencyContact: patient.emergencyContact,
            notes: patient.notes,
            //TODO this will need work if more than one episode per patient
            visits: patient.episodes[0].visits.map(visit => visit.visitID),
        };
    }

    static getFlatPatientMap(patients) {
        return arrayToObjectByKey(patients.map(patient => PatientDataService.getFlatPatient(patient)), 'patientID');
    }
    
    constructor(floDB, store) {
        this.floDB = floDB;
        this.store = store;
    }

    getPatientByID(patientID) {
        return this.floDB.objectForPrimaryKey(Patient, patientID);
    }

    addPatientsToRedux(patients) {
        this.store.dispatch({type: PatientActions.ADD_PATIENTS, patientList: PatientDataService.getFlatPatientMap(patients)});
    }
}

export let patientDataService;

export function initialiseService(floDB, store) {
    patientDataService = new PatientDataService(floDB, store);
}