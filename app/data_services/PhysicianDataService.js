import {Physician} from '../utils/data/schema';

export class PhysicianDataService {

    static physicianDataService;

    static initialiseService(floDB, store) {
        PhysicianDataService.physicianDataService = new PhysicianDataService(floDB, store);
    }

    static getInstance() {
        if (!PhysicianDataService.physicianDataService) {
            throw new Error('Physician data service requested before being initialised');
        }
        return PhysicianDataService.physicianDataService;
    }

    constructor(floDB, store) {
        this.floDB = floDB;
        this.store = store;
    }

    static constructName(firstName, lastName) {
        if (lastName === null) return firstName;
        return `${lastName} ${firstName}`;
    }

    // Has to be inside a floDB.write
    createNewPhysician(physicianDetails, overWrite = true) {
        return this.floDB.create(Physician.getSchemaName(), physicianDetails, overWrite);
    }

}
