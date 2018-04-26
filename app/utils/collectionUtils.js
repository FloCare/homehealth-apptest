function arrayToMap(array, keyProperty) {
    if (!keyProperty) {
        console.error('keyProperty missing');
    }
    if (!array) {
        console.error('array undefined');
    }
    return array.reduce((map, object) => map.set(object[keyProperty], object), new Map());
}

function filterResultObjectByListMembership(object, property, membershipList) {
    return object.filtered(membershipList
        .map((membershipItem) => `${property}=="${membershipItem}"`)
        .join(' OR ')
    );
}

function getFirstElement(object) {
    if (isNonEmptyArray(object)) {
        return object[0];
    }
    return undefined;
}

function isNonEmptyArray(object) {
    return object && object.length && object.length > 0;
}

export {arrayToMap, filterResultObjectByListMembership, isNonEmptyArray, getFirstElement};
