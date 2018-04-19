import {Result} from 'realm';

function ArrayToMap(array, keyProperty) {
    return array.reduce((map, object) => map.set(object[keyProperty], object), new Map());
}

function filterResultObjectByListMembership(object, property, membershipList) {
    return object.filtered(membershipList
                    .map((membershipItem) => `${property}=="${membershipItem}"`)
                    .join(' OR ')
        );
}
export {ArrayToMap, filterResultObjectByListMembership};
