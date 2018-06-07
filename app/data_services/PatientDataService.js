import {Patient} from '../utils/data/schema';
import {PatientActions} from '../redux/Actions';
import {arrayToObjectByKey} from '../utils/collectionUtils';
import {addressDataService} from './AddressDataService';
import {parsePhoneNumber} from '../utils/lib';

class PatientDataService {
    static getFlatPatient(patient) {
        return {
            patientID: patient.patientID,
            name: patient.name,
            addressID: patient.address.addressID,
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

    createNewPatient(patient) {
        // Todo: Add proper ID generators
        // Create a patient, create & add an address, and create & add an episode
        const patientId = Math.random().toString();
        const episodeId = Math.random().toString();
        const addressId = Math.random().toString();

        let newPatient = null;
        this.floDB.write(() => {
            // Add the patient
            newPatient = this.floDB.create(Patient.schema.name, {
                patientID: patientId,
                name: patient.name ? patient.name.toString().trim() : '',
                primaryContact: patient.primaryContact ? parsePhoneNumber(patient.primaryContact.toString().trim()) : '',
                emergencyContact: patient.emergencyContact ? parsePhoneNumber(patient.emergencyContact.toString().trim()) : '',
                notes: patient.notes ? patient.notes.toString().trim() : '',
                timestamp: 0,                                   // Todo: Add a timestmap
            });

            addressDataService.addAddressToTransaction(newPatient, patient, addressId);

            // Todo: Add an episode, Move this to its own Data Service
            newPatient.episodes.push({
                episodeID: episodeId,
                diagnosis: []
            });
        });
        if (newPatient) {
            this.addPatientsToRedux([newPatient]);
        }
    }

    editExistingPatient(patientId, patient) {
        let patientObj = null;
        this.floDB.write(() => {
            patientObj = this.floDB.objectForPrimaryKey(Patient.schema.name, patientId);

            // Edit the corresponding address info
            addressDataService.addAddressToTransaction(patientObj, patient, patient.addressID);

            // Edit the patient info
            this.floDB.create(Patient.schema.name, {
                patientID: patient.patientID,
                name: patient.name ? patient.name.toString().trim() : '',
                primaryContact: patient.primaryContact ? parsePhoneNumber(patient.primaryContact.toString().trim()) : '',
                emergencyContact: patient.emergencyContact ? parsePhoneNumber(patient.emergencyContact.toString().trim()) : '',
                notes: patient.notes ? patient.notes.toString().trim() : '',
                timestamp: 0,                                   // Todo: Add a timestmap
            }, true);
        });
        if (patientObj) {
            this.updatePatientsInRedux([patientObj]);
        }
    }

    updatePatientsInRedux(patients) {
        this.store.dispatch({
            type: PatientActions.EDIT_PATIENTS,
            patientList: PatientDataService.getFlatPatientMap(patients)
        });
        addressDataService.updateAddressesInRedux(patients.map(patient => patient.address));
    }

    addPatientsToRedux(patients) {
        this.store.dispatch({
            type: PatientActions.ADD_PATIENTS,
            patientList: PatientDataService.getFlatPatientMap(patients)
        });
        addressDataService.updateAddressesInRedux(patients.map(patient => patient.address));
    }
}

export let patientDataService;

export function initialiseService(floDB, store) {
    patientDataService = new PatientDataService(floDB, store);
}
