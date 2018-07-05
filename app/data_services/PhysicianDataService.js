import {Physician} from '../utils/data/schema';
import {validateNonEmptyValueForAllKeys} from "../utils/collectionUtils";

export class PhysicianDataService {

    static physicianDataService;

    static initialiseService(floDB, store) {
        PhysicianDataService.physicianDataService= new PhysicianDataService(floDB, store);
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

    // Has to be inside a floDB.write
    createNewPhysician(physicianDetails){
        // TODO Perform validations for mandatory fields before calling DB

        validateNonEmptyValueForAllKeys(physicianDetails, Physician.getMandatoryKeys());

        return this.floDB.create(Physician.getSchemaName(),
            {
                physicianId: physicianDetails.physicianId.toString(),
                npiId: physicianDetails.npiId.toString(),
                firstName: physicianDetails.firstName,
                lastName: physicianDetails.lastName || null,
                contactNo: physicianDetails.contactNo || null,
                faxNo: physicianDetails.faxNo || null,
            }
        )
    }

}
