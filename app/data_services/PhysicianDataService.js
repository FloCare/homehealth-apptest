import {Physician} from '../utils/data/schema';
import {validateNonEmptyValueForAllKeys} from '../utils/collectionUtils';

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
    createNewPhysician(physicianDetails) {
        validateNonEmptyValueForAllKeys(physicianDetails, Physician.getMandatoryKeys());
        return this.floDB.create(Physician.getSchemaName(),
            {
                id: physicianDetails.id.toString(),
                npiId: physicianDetails.npi.toString(),
                firstName: physicianDetails.firstName,
                lastName: physicianDetails.lastName || null,
                phone1: physicianDetails.phone1 || null,
                phone2: physicianDetails.phone2 || null,
                faxNo: physicianDetails.fax || null,
            }
        );
    }

}
