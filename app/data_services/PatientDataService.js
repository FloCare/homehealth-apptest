import moment from 'moment';
import {floDB, Patient} from '../utils/data/schema';
import {PatientActions} from '../redux/Actions';
import {arrayToMap, arrayToObjectByKey, filterResultObjectByListMembership} from '../utils/collectionUtils';
import {addressDataService} from './AddressDataService';
import {parsePhoneNumber} from '../utils/lib';
import {visitDataService} from './VisitDataService';

import * as PatientAPI from '../utils/API/PatientAPI';
import {QueryHelper} from "../utils/data/queryHelper";

export class PatientDataService {
    static patientDataService;

    static initialiseService(floDB, store) {
        PatientDataService.patientDataService = new PatientDataService(floDB, store);
    }

    static getInstance() {
        if(!PatientDataService.patientDataService) {
            throw new Error('padient data service requested before being initialised');
        }

        return PatientDataService.patientDataService;
    }

    static getFlatPatient(patient) {
        return {
            patientID: patient.patientID,
            name: PatientDataService.constructName(patient.firstName, patient.lastName),
            addressID: patient.address.addressID,
            primaryContact: patient.primaryContact,
            emergencyContact: patient.emergencyContact,
            notes: patient.notes,
            //TODO this will need work if more than one episode per patient
            visits: patient.episodes[0].visits.map(visit => visit.visitID),
            archived: patient.archived
        };
    }

    static constructName (firstName, lastName) {
        if (lastName === null) return firstName;
        return lastName + " " + firstName;
    }

    static getFlatPatientList(patientList) {
        return patientList.map(patient => PatientDataService.getFlatPatient(patient));
    }

    static getFlatPatientMap(patients) {
        return arrayToObjectByKey(PatientDataService.getFlatPatientList(patients), 'patientID');
    }

    constructor(floDB, store) {
        this.floDB = floDB;
        this.store = store;
    }

    getTotalPatientCount() {
        return this.floDB.objects(Patient).length;
    }
    getPatientByID(patientID) {
        return this.floDB.objectForPrimaryKey(Patient, patientID);
    }

    getAllPatients(){
        return this.floDB.objects(Patient.schema.name).filtered('archived = false');
    }

    getPatientsFilteredByName(searchTerm) {
        if (searchTerm === "") return this.getAllPatients();
        const searchTerms = searchTerm.toString().split(" ");
        let queryStr = QueryHelper.nameContainsQuery(searchTerms.shift());
        queryStr = searchTerms.reduce((queryAccumulator, searchTerm) =>
            QueryHelper.andQuery(queryAccumulator, QueryHelper.nameContainsQuery(searchTerm)), queryStr);
        return this.getAllPatients().filtered(queryStr);
    }

    getPatientsSortedByName(patientList){
        if (patientList.length === 0) return patientList;
        let patientDataArray = [];
        patientList.forEach(patient => patientDataArray.push({sortIndex: patient.name.toString().toLowerCase(), data: patient}));
        const sortedSeedArray = patientDataArray.sort(function(patientData1, patientData2) {
            return patientData1.sortIndex.localeCompare(patientData2.sortIndex);
        });
        return sortedSeedArray.map(seedData => seedData.data);
    }

    createNewPatient(patient, isLocallyOwned = true, updateIfExisting = false) {
        // Todo: Add proper ID generators
        // Create a patient, create & add an address, and create & add an episode
        const patientId = !isLocallyOwned && patient.id ? patient.id : Math.random().toString();
        const episodeId = Math.random().toString();
        const addressId = Math.random().toString();

        let newPatient = null;
        this.floDB.write(() => {
            // Add the patient
            newPatient = this.floDB.create(Patient.schema.name, {
                patientID: patientId,
                firstName: patient.firstName.toString().trim(),
                lastName: patient.lastName.toString().trim(),
                primaryContact: patient.primaryContact ? parsePhoneNumber(patient.primaryContact.toString().trim()) : '',
                emergencyContact: patient.emergencyContact ? parsePhoneNumber(patient.emergencyContact.toString().trim()) : '',
                notes: patient.notes ? patient.notes.toString().trim() : '',
                timestamp: patient.createdOn ? moment(patient.createdOn).valueOf() : moment().utc().valueOf(),
                isLocallyOwned,
                archived: false
            }, updateIfExisting);

            if (isLocallyOwned) {
                addressDataService.addAddressToTransaction(newPatient, patient, addressId);
            } else addressDataService.addAddressToTransaction(newPatient, patient.address, patient.address.id);

            // Todo: Add an episode, Move this to its own Data Service
            newPatient.episodes.push({
                episodeID: episodeId,
                diagnosis: []
            });
        });
        if (newPatient) {
            this.addPatientsToRedux([newPatient], true);
        }
    }

    editExistingPatient(patientId, patient) {
        const patientObj = this.floDB.objectForPrimaryKey(Patient.schema.name, patientId);
        if (patientObj) {
            this._checkPermissionForEditing([patientObj]);

            this.floDB.write(() => {
                // Edit the corresponding address info
                addressDataService.addAddressToTransaction(patientObj, patient, patient.addressID);

                // Edit the patient info
                this.floDB.create(Patient.schema.name, {
                    patientID: patient.patientID,
                    firstName: patient.firstName ? patient.firstName.toString().trim() : ' ',
                    lastName: patient.lastName ? patient.lastName.toString().trim() : ' ',
                    primaryContact: patient.primaryContact ? parsePhoneNumber(patient.primaryContact.toString().trim()) : '',
                    emergencyContact: patient.emergencyContact ? parsePhoneNumber(patient.emergencyContact.toString().trim()) : '',
                    notes: patient.notes ? patient.notes.toString().trim() : '',
                    timestamp: 0,                                   // Todo: Add a timestmap
                }, true);
            });
            this.updatePatientsInRedux([patientObj]);
        }
    }

    archivePatient(patientId, deletedOnServer = false) {
        console.log('Archiving Patient from realm');
        const patient = this.floDB.objectForPrimaryKey(Patient.schema.name, patientId);

        if (patient) {
            if (!deletedOnServer) { this._checkPermissionForEditing([patient]); }

            let obj = null;
            this.floDB.write(() => {
                patient.archived = true;
                obj = visitDataService.deleteVisits(patient);
            });
            if (patient) {
                this._archivePatientsInRedux([patientId]);
            }
            if (obj && obj.visits) {
                visitDataService.deleteVisitsFromRedux(obj.visits);
            }
            if (obj && obj.visitOrders) {
                for (let i = 0; i < obj.visitOrders.length; i++) {
                    visitDataService.updateVisitOrderToReduxIfLive(obj.visitOrders[i].visitList, obj.visitOrders[i].midnightEpoch);
                }
            }
            console.log('Patient archived. His visits Deleted');
        }
    }

    updatePatientListFromServer() {
        return PatientAPI.getPatientIDList()
            .then(json => {
                const serverPatientIDs = json.patients;

                console.log('server patient ids');
                console.log(serverPatientIDs);

                const existingPatients = this.floDB.objects(Patient).filtered('isLocallyOwned = false && archived = false');
                const intersectingPatients = filterResultObjectByListMembership(existingPatients, 'patientID', serverPatientIDs);

                const intersectingPatientsByID = arrayToMap(filterResultObjectByListMembership(intersectingPatients, 'patientID', serverPatientIDs), 'patientID');

                const deletedPatients = [];
                existingPatients.forEach(patient => {
                    if (!intersectingPatientsByID.has(patient.patientID.toString())) {
                        deletedPatients.push(patient);
                    }
                });

                const newPatientIDs = [];
                serverPatientIDs.forEach(patientID => {
                    if (!intersectingPatientsByID.has(patientID.toString())) {
                        newPatientIDs.push(patientID);
                        //TODO batch it
                    }
                });

                return {
                    deletedPatients,
                    newPatientIDs
                };
            })
            .then(async ({deletedPatients, newPatientIDs}) => {
                let additions = 0;
                const deletions = deletedPatients.length;

                if (newPatientIDs.length > 0) {
                    additions = await this._fetchAndSavePatientsByID(newPatientIDs);
                }
                deletedPatients.forEach(patient => this.archivePatient(patient.patientID.toString(), true));
                return {
                    additions,
                    deletions
                };
            });
    }

    _fetchAndSavePatientsByID(newPatientIDs) {
        return PatientAPI.getPatientsByID(newPatientIDs)
            .then((json) => {
                const successfulObjects = json.success;
                for (const patientID in successfulObjects) {
                    const patientObject = successfulObjects[patientID];
                    patientObject.id = patientObject.id.toString();
                    patientObject.address.id = patientObject.address.id.toString();
                    patientObject.address.lat = patientObject.address.latitude;
                    patientObject.address.long = patientObject.address.longitude;
                    this.createNewPatient(patientObject, false, true);
                }
                addressDataService.attemptFetchForPendingAddresses();
                return successfulObjects.length;
            });
    }

    updatePatientsInRedux(patients) {
        this._checkPermissionForEditing(patients);

        this.store.dispatch({
            type: PatientActions.EDIT_PATIENTS,
            patientMap: PatientDataService.getFlatPatientMap(patients)
        });
        addressDataService.updateAddressesInRedux(patients.map(patient => patient.address));
    }

    addPatientsToRedux(patients, updateExisting = false) {
        this.store.dispatch({
            type: PatientActions.ADD_PATIENTS,
            patientMap: PatientDataService.getFlatPatientMap(patients),
            updateExisting
        });
        addressDataService.addAddressesToRedux(patients.map(patient => patient.address));
    }

    _archivePatientsInRedux(patients) {
        this.store.dispatch({
            type: PatientActions.ARCHIVE_PATIENTS,
            patientList: patients
        });
    }

    _checkPermissionForEditing(patients) {
        patients.forEach(patient => {
            if (!patient.isLocallyOwned) {
                console.log('illegal attempt to edit patient');
                throw new Error('Attempting to update a patient that is organisation owned');
            }
        });
    }
}