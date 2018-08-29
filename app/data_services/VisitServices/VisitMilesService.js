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

    filterMilesInformationCompleteVisits(visits) {
        return visits.filtered('visitMiles.odometerStart != null && visitMiles.odometerEnd != null');
    }

}
