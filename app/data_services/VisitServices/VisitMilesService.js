import {VisitMiles} from '../../utils/data/schema';

export class VisitMilesService {
    static visitMilesService;

    static initialiseService(floDB) {
        VisitMilesService.visitMilesService = new VisitMilesService(floDB);
        return VisitMilesService.visitMilesService;
    }

    static getInstance() {
        if (!VisitMilesService.visitMilesService) {
            throw new Error('Visit Miles service requested before being initialised');
        }
        return VisitMilesService.visitMilesService;
    }

    constructor(floDB) {
        this.floDB = floDB;
    }

    createVisitMilesForVisit(visit, visitMilesData) {
        visit.visitMiles = this.floDB.create(VisitMiles, visitMilesData);
    }

    deleteVisitMilesByObject(visitMiles) {
        this.floDB.delete(visitMiles);
    }

}
