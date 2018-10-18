import {VisitMiles} from '../../schema';

export const v11 = (oldRealm, newRealm) => {
    const milesPresent = (miles) => (miles !== null && miles !== undefined);

    if (oldRealm.schemaVersion < 11) {
        const oldVisitMiles = oldRealm.objects(VisitMiles.getSchemaName);
        const newVisitMiles = newRealm.objects(VisitMiles.getSchemaName);
        for (let i = 0; i < oldVisitMiles.length; i++) {
            if (milesPresent(oldVisitMiles.odometerStart) && milesPresent(oldVisitMiles.odometerEnd)) {
                newVisitMiles.computedMiles = oldVisitMiles.odometerEnd - oldVisitMiles.odometerStart;
            }
            let commentsString = oldVisitMiles.milesComments ? `${oldVisitMiles.milesComments}; ` : '';
            if (milesPresent(oldVisitMiles.odometerStart)) {
                commentsString += `Odometer Start: ${oldVisitMiles.odometerStart.toFixed(1)}`;
            }
            if (milesPresent(oldVisitMiles.odometerEnd)) {
                commentsString += `; Odometer End: ${oldVisitMiles.odometerEnd.toFixed(1)}`;
            }
            newVisitMiles.milesComments = commentsString;
        }
    }
};
