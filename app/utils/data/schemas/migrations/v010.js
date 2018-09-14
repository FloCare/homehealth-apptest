import {Place} from '../../schema';


export const v010 = (oldRealm, newRealm) => {
    if (oldRealm.schemaVersion < 10) {
        const placeObjects = newRealm.objects(Place.getSchemaName());
        placeObjects.update('isLocallyOwned', true);
    }
};
