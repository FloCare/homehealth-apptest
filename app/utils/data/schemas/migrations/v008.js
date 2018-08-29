import {Visit, VisitMiles} from '../../schema';

export const v008 = (oldRealm, newRealm) => {
    if (oldRealm.schemaVersion < 8) {
        const visitObjects = newRealm.objects(Visit.getSchemaName());
        const visitMilesData = {
            odometerStart: null,
            odometerEnd: null,
            totalMiles: null,
            milesComments: null
        };
        for (let i = 0; i < visitObjects.length; i++) {
            visitObjects[i].visitMiles = newRealm.create(VisitMiles.getSchemaName(), visitMilesData);
        }
    }
};
