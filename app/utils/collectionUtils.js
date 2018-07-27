function arrayToMap(array, keyProperty) {
    if (!keyProperty) {
        console.error('keyProperty missing');
    }
    if (!array) {
        console.error('array undefined');
    }
    return array.reduce((map, object) => map.set(object[keyProperty], object), new Map());
}

function arrayToObjectByKey(array, keyProperty) {
    if (!keyProperty) {
        console.error('keyProperty missing');
    }
    if (!array) {
        console.error('array undefined');
    }
    return array.reduce((map, object) => { map[object[keyProperty]] = object; return map; }, {});
}

function arrayToObjectListByKey(array, keyProperty) {
    if (!keyProperty) {
        console.error('keyProperty missing');
    }
    if (!array) {
        console.error('array undefined');
    }
    return array.reduce((map, object) => {
        if (!map[object[keyProperty]]) { map[object[keyProperty]] = []; }
        map[object[keyProperty]].push(object);
        return map;
    }, {});
}

function filterResultObjectByListMembership(object, property, membershipList) {
    let filterPredicate = membershipList
        .map((membershipItem) => `${property}=="${membershipItem}"`)
        .join(' OR ');
    if (!membershipList || membershipList.length === 0) {
        filterPredicate = 'falsePredicate';
    }
    return object.filtered(filterPredicate);
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

const createSectionedListByName = (realmObj) => {
    const arr = Object.keys(realmObj).map((key) => realmObj[key]);
    const sections = arr.reduce((m, obj) => {
        const title = obj.name[0].toUpperCase();
        if ((Object.keys(m)).indexOf(title) > -1) {
            m[title].push(obj);
        } else {
            m[title] = [obj];
        }
        return m;
    }, {});
    const sectionsArray = Object.keys(sections).map((key) => ({title: key, data: sections[key]}));
    return sectionsArray;
};

export {arrayToMap, filterResultObjectByListMembership, isNonEmptyArray, getFirstElement, createSectionedListByName, arrayToObjectByKey, arrayToObjectListByKey};
