import {Place} from '../../schema';


export const v009 = (oldRealm, newRealm) => {
    if (oldRealm.schemaVersion < 9) {
        const placeObjects = newRealm.objects(Place.getSchemaName());
        placeObjects.update('isLocallyOwned', true);
    }
};
