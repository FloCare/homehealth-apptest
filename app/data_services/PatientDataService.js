import moment from 'moment';
import firebase from 'react-native-firebase';
import {Episode, Patient} from '../utils/data/schema';
import {PatientActions} from '../redux/Actions';
import {
    arrayToMap,
    arrayToObjectByKey,
    filterResultObjectByListMembership, hasNonEmptyValueForAllKeys,
} from '../utils/collectionUtils';
import {eventNames, notificationType, screenNames} from '../utils/constants';
import {addressDataService} from './AddressDataService';
import {parsePhoneNumber} from '../utils/lib';
import {VisitService} from './VisitServices/VisitService';

import * as PatientAPI from '../utils/API/PatientAPI';
import {QueryHelper} from '../utils/data/queryHelper';
import {getMessagingServiceInstance} from './MessagingServices/PubNubMessagingService/MessagingServiceCoordinator';
import {EpisodeMessagingService} from './MessagingServices/PubNubMessagingService/EpisodeMessagingService';
import {getEpisodeDetailsByIds} from '../utils/API/EpisodeAPI';
import {PhysicianDataService} from './PhysicianDataService';

export class PatientDataService {
    static patientDataService;

    static initialiseService(floDB, store) {
        PatientDataService.patientDataService = new PatientDataService(floDB, store);
    }

    static getInstance() {
        if (!PatientDataService.patientDataService) {
            throw new Error('patient data service requested before being initialised');
        }

        return PatientDataService.patientDataService;
    }

    static getFlatPatient(patient) {
        return {
            patientID: patient.patientID,
            name: PatientDataService.constructName(patient.firstName, patient.lastName),
            addressID: patient.address.addressID,
            primaryContact: patient.primaryContact,
            notes: patient.notes,
            isLocallyOwned: patient.isLocallyOwned,
            //TODO this will need work if more than one episode per patient
            visits: VisitService.getInstance().filterUserVisits(
                patient.episodes[0].visits).map(visit => visit.visitID),
            archived: patient.archived,
            recentlyAssigned: moment.utc(patient.assignmentTimestamp).diff(moment.utc(), 'days') === 0,
            recentlyUpdated: moment.utc(patient.lastUpdateTimestamp).diff(moment.utc(), 'days') === 0,
        };
    }

    static constructName(firstName, lastName) {
        if (lastName === null) return firstName;
        return `${lastName} ${firstName}`;
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

    getAllPatients() {
        return this.floDB.objects(Patient.schema.name).filtered('archived = false');
    }

    getPatientsFilteredByName(searchTerm) {
        if (!searchTerm || searchTerm === '') return this.getAllPatients();
        const searchTerms = searchTerm.toString().split(' ');
        let queryStr = QueryHelper.nameContainsQuery(searchTerms.shift());
        queryStr = searchTerms.reduce((queryAccumulator, searchTerm) =>
            QueryHelper.andQuery(queryAccumulator, QueryHelper.nameContainsQuery(searchTerm)), queryStr);
        return this.getAllPatients().filtered(queryStr);
    }

    getAssignmentNotification(patientID, messageObject) {
        const body = `A new patient ${this.getPatientByID(patientID).name} is assigned to you.`;
        return {
            notificationID: `${patientID}_assignmentNotification`,
            type: notificationType.NEW_PATIENT,
            createdTime: parseInt(messageObject.timestamp),
            body,
            screenName: screenNames.patientDetails,
            passProps: JSON.stringify({
                patientId: patientID,
            }),
            navigatorStyle: JSON.stringify({
                tabBarHidden: true
            })
        };
    }


    getPatientsSortedByName(patientList) {
        if (patientList.length === 0) return patientList;
        const patientDataArray = [];
        patientList.forEach(patient => patientDataArray.push({
            sortIndex: patient.name.toString().toLowerCase(),
            data: patient
        }));
        const sortedSeedArray = patientDataArray.sort((patientData1, patientData2) => patientData1.sortIndex.localeCompare(patientData2.sortIndex));
        return sortedSeedArray.map(seedData => seedData.data);
    }

    createNewPatient(patient, isLocallyOwned = true, updateIfExisting = false, episode) {
        // Todo: Add proper ID generators
        // Create a patient, create & add an address, and create & add an episode
        const patientId = !isLocallyOwned && patient.patientID ? patient.patientID : Math.random().toString();
        const episodeId = Math.random().toString();
        const addressId = Math.random().toString();

        let newPatient = null;
        const creationTimestamp = patient.createdOn ? moment(patient.createdOn).valueOf() : moment().utc().valueOf();

        const emergencyContactNumber = patient.emergencyContactInfo.contactNumber;
        const emergencyContactName = patient.emergencyContactInfo.contactName;
        const emergencyContactRelation = patient.emergencyContactInfo.contactRelation;

        this.floDB.write(() => {
            // Add the patient
            newPatient = this.floDB.create(Patient.schema.name, {
                patientID: patientId,
                firstName: patient.firstName.toString().trim(),
                lastName: patient.lastName.toString().trim(),
                primaryContact: patient.primaryContact ? parsePhoneNumber(patient.primaryContact.toString().trim()) : undefined,
                notes: patient.notes ? patient.notes.toString().trim() : undefined,
                creationTimestamp,
                assignmentTimestamp: moment().utc().valueOf(),
                lastUpdateTimestamp: creationTimestamp,
                isLocallyOwned,
                archived: false,
                dateOfBirth: patient.dateOfBirth,
                emergencyContactNumber: emergencyContactNumber ? emergencyContactNumber.toString().trim() : undefined,
                emergencyContactName: emergencyContactName ? emergencyContactName.toString().trim() : undefined,
                emergencyContactRelation: emergencyContactRelation ? emergencyContactRelation.toString().trim() : undefined,
            }, updateIfExisting);

            if (isLocallyOwned) {
                addressDataService.addAddressToTransaction(newPatient, patient, addressId);
            } else addressDataService.addAddressToTransaction(newPatient, patient.address, patient.address.addressID);

            //Todo: Add an episode, Move this to its own Data Service
            if (!episode) {
                episode = {
                    episodeID: episodeId,
                    diagnosis: []
                };
            }
            if (episode.primaryPhysician &&
                hasNonEmptyValueForAllKeys(episode.primaryPhysician, ['physicianID', 'npi', 'firstName'])) {
                const physicianDetails = episode.primaryPhysician;
                const physician = {
                    physicianID: physicianDetails.physicianID.toString(),
                    npiId: physicianDetails.npi.toString(),
                    firstName: physicianDetails.firstName,
                    lastName: physicianDetails.lastName,
                    phone1: physicianDetails.phone1,
                    phone2: physicianDetails.phone2,
                    faxNo: physicianDetails.fax,
                };

                episode.primaryPhysician = PhysicianDataService.getInstance().createNewPhysician(physician, true);
            }
            const episodeObject = this.floDB.create(Episode, episode, true);
            if (!newPatient.episodes.map(e => e.episodeID).includes(episodeObject.episodeID)) {
                newPatient.episodes.push(episodeObject);
            }
        });

        if (newPatient) {
            if (patient.notes) {
                firebase.analytics().logEvent(eventNames.ADD_NOTE, {
                    length: patient.notes.toString().trim().length
                });
            }
            this.addPatientsToRedux([newPatient], true);
            try {
                getMessagingServiceInstance(EpisodeMessagingService.identifier).subscribeToEpisodes(newPatient.episodes);
            } catch (e) {
                console.log('error trying to subscribe to new patient');
                console.log(e);
            }
        }
    }

    //TODO edit address for patient
    editExistingPatient(patient, isServerUpdate = false, episode = null) {
        const patientObj = this.floDB.objectForPrimaryKey(Patient.schema.name, patient.patientID);

        if (patientObj) {
            if (!isServerUpdate) {
                this._checkPermissionForEditing([patientObj]);
            }

            const emergencyContactNumber = patient.emergencyContactInfo.contactNumber;
            const emergencyContactName = patient.emergencyContactInfo.contactName;
            const emergencyContactRelation = patient.emergencyContactInfo.contactRelation;

            this.floDB.write(() => {
                // Edit the corresponding address info
                if (isServerUpdate && patient.address && patient.address.addressID) {
                    addressDataService.addAddressToTransaction(patientObj, patient.address, patient.address.addressID);
                }
                if (!isServerUpdate && patient.addressID) {
                    addressDataService.addAddressToTransaction(patientObj, patient, patient.addressID);
                }

                // Edit the patient info
                const updatedPatient = this.floDB.create(Patient.schema.name, {
                    patientID: patient.patientID,
                    firstName: patient.firstName ? patient.firstName.toString().trim() : undefined,
                    lastName: patient.lastName ? patient.lastName.toString().trim() : undefined,
                    primaryContact: patient.primaryContact ? parsePhoneNumber(patient.primaryContact.toString().trim()) : undefined,
                    notes: patient.notes ? patient.notes.toString().trim() : undefined,
                    dateOfBirth: patient.dateOfBirth,
                    emergencyContactNumber: emergencyContactNumber ? emergencyContactNumber.toString().trim() : undefined,
                    emergencyContactName: emergencyContactName ? emergencyContactName.toString().trim() : undefined,
                    emergencyContactRelation: emergencyContactRelation ? emergencyContactRelation.toString().trim() : undefined,
                }, true);

                if (episode && episode.primaryPhysician &&
                    hasNonEmptyValueForAllKeys(episode.primaryPhysician, ['physicianID', 'npi', 'firstName'])) {
                    const physicianDetails = episode.primaryPhysician;
                    const physician = {
                        physicianID: physicianDetails.physicianID.toString(),
                        npiId: physicianDetails.npi.toString(),
                        firstName: physicianDetails.firstName,
                        lastName: physicianDetails.lastName,
                        phone1: physicianDetails.phone1,
                        phone2: physicianDetails.phone2,
                        faxNo: physicianDetails.fax,
                    };

                    updatedPatient.getFirstEpisode().primaryPhysician = PhysicianDataService.getInstance().createNewPhysician(physician, true);
                }
            });
            if (this.store) { this.updatePatientsInRedux([patientObj], isServerUpdate); }
        }
    }

    archivePatient(patientId, deletedOnServer = false) {
        console.log('Archiving Patient from realm');
        const patient = this.floDB.objectForPrimaryKey(Patient.schema.name, patientId);

        if (patient) {
            if (!deletedOnServer) {
                this._checkPermissionForEditing([patient]);
            } else {
                //TODO
                console.log(`archiving patient ${patientId}, unsubscribing from episodes`);
                console.log(patient.episodes.length);
                console.log(patient.episodes);
                getMessagingServiceInstance(EpisodeMessagingService.identifier).unsubscribeToEpisodes(patient.episodes);
            }

            this.floDB.write(() => {
                patient.archived = true;
            });
            VisitService.getInstance().deleteVisitsForSubject(patient);
            this._archivePatientsInRedux([patientId]);
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
                    const newPatients = await this.fetchAndSavePatientsByID(newPatientIDs);
                    additions = newPatients.success.length;
                }
                deletedPatients.forEach(patient => this.archivePatient(patient.patientID.toString(), true));
                console.log('after sync with server patient list is:');
                console.log(this.floDB.objects(Patient.getSchemaName()).length);
                return {
                    additions,
                    deletions
                };
            });
    }

    _fetchPatientsByIDAndAdapt(patientIDs) {
        return PatientAPI.getPatientsByID(patientIDs)
            .then((json) => {
                const successfulObjects = json.success;
                for (const patientID in successfulObjects) {
                    const patientObject = successfulObjects[patientID];
                    patientObject.address.id = patientObject.address.addressID.toString();
                    patientObject.address.lat = patientObject.address.latitude;
                    patientObject.address.long = patientObject.address.longitude;

                    patientObject.dateOfBirth = patientObject.dob || null;
                    if (patientObject.dateOfBirth) {
                        try {
                            patientObject.dateOfBirth = moment(patientObject.dateOfBirth, 'YYYY-MM-DD').toDate();
                        } catch (e) {
                            patientObject.dateOfBirth = null;
                            console.log('Unable to parse DOB. Skipping field');
                        }
                    }
                    patientObject.emergencyContactInfo = {
                        contactName: patientObject.emergencyContactName || null,
                        contactNumber: patientObject.emergencyContactNumber || null,
                        contactRelation: patientObject.emergencyContactRelation || null
                    };
                }
                return json;
            });
    }

    fetchPatientsWithEpisodeData(patientIDs) {
        return this._fetchPatientsByIDAndAdapt(patientIDs).then(
            json => {
                const dataArray = [];
                const successfulObjects = json.success;
                const episodeIDs = successfulObjects.map((patient) => patient.episodeID);
                return getEpisodeDetailsByIds(episodeIDs).then(
                    episodeResponseJson => {
                        const episodeObjects = episodeResponseJson.success;
                        for (const patientObject of successfulObjects) {
                            const episodeObject = episodeObjects.find(
                                (episode) => episode.episodeID === patientObject.episodeID);
                            dataArray.push({
                                patient: patientObject,
                                episode: episodeObject
                            });
                        }
                        return dataArray;
                    }
                ).catch(error => {
                    console.log('failed to get data for episode IDs.');
                    console.log(error);
                });
            }
        );
    }

    fetchAndSavePatientsByID(newPatientIDs) {
        return this.fetchPatientsWithEpisodeData(newPatientIDs).then(
            (responseArray) => {
                const resultObject = {success: [], failed: []};
                responseArray.forEach(
                    (patientEpisodeData) => {
                        const patient = patientEpisodeData.patient;
                        const episode = patientEpisodeData.episode;
                        if (episode) {
                            this.createNewPatient(patient, false, true, episode);
                            resultObject.success.push(patient.patientID);
                        } else {
                            resultObject.failed.push(patient.patientID);
                        }
                    }
                );
                addressDataService.attemptFetchForPendingAddresses();
                console.log('resultObject');
                console.log(resultObject);
                return resultObject;
            }
        );
    }


    fetchAndEditPatientsByID(patientIDs) {
        return this.fetchPatientsWithEpisodeData(patientIDs).then(
            responseArray => {
                responseArray.forEach(
                    (patientEpisodeData) => {
                        const patient = patientEpisodeData.patient;
                        const episode = patientEpisodeData.episode;
                        this.editExistingPatient(patient, true, episode);
                    }
                );
                addressDataService.attemptFetchForPendingAddresses();
                return responseArray.length;
            }
        );
    }

    updatePatientsInRedux(patients, isServerUpdate = false) {
        if (!isServerUpdate) {
            this._checkPermissionForEditing(patients);
        }

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
