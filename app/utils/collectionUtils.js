import moment from 'moment';

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

const createSectionedListByField = (realmObj, sectionGenerator = (item) => item.name[0].toUpperCase(), sectionHeader = 'title', contentHeader = 'data') => {
    const arr = Object.keys(realmObj).map((key) => realmObj[key]);
    const sections = arr.reduce((m, obj) => {
        const title = sectionGenerator(obj);
        if ((Object.keys(m)).indexOf(title.toString()) > -1) {
            m[title].push(obj);
        } else {
            m[title] = [obj];
        }
        return m;
    }, {});
    return Object.keys(sections).map((key) => {
        const returnObject = {};
        returnObject[contentHeader] = sections[key];
        returnObject[sectionHeader] = key;
        return returnObject;
    });
};

function hasNonEmptyValueForKey(object, key) {
    return !!(object.hasOwnProperty(key) && object[key]);
}

function hasNonEmptyValueForAllKeys(object, keysList) {
    return keysList.every(key => hasNonEmptyValueForKey(object, key));
}

function isSameMonth(date1, date2) {
    return moment(date1).format('MM') === moment(date2).format('MM');
}

export {arrayToMap, filterResultObjectByListMembership, isNonEmptyArray, getFirstElement, createSectionedListByField,
    arrayToObjectByKey, arrayToObjectListByKey, hasNonEmptyValueForKey, hasNonEmptyValueForAllKeys, isSameMonth};
