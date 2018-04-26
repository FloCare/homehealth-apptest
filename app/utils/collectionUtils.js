function arrayToMap(array, keyProperty) {
    return array.reduce((map, object) => map.set(object[keyProperty], object), new Map());
}

function filterResultObjectByListMembership(object, property, membershipList) {
    return object.filtered(membershipList
        .map((membershipItem) => `${property}=="${membershipItem}"`)
        .join(' OR ')
    );
}

function getFirstElement(object) {
    if (isNonEmptyArray(object)) { return object[0]; }
    return undefined;
}

function isNonEmptyArray(object) {
    return object && object.length && object.length > 0;
}

const createSectionedListFromRealmObject = (realmObj) => {
    const arr = Object.keys(realmObj).map((key) => realmObj[key]);
    const sections = arr.reduce((m, obj) => {
        const title = obj.name[0];
        if (title in Object.keys(m)) {
            m[title].push(obj);
        } else {
            m[title] = [obj];
        }
        return m;
    }, {});
    const sectionsArray = Object.keys(sections).map((key) => { return {title: key, data: sections[key]}; });
    return sectionsArray;
};

export {arrayToMap, filterResultObjectByListMembership, isNonEmptyArray, getFirstElement, createSectionedListFromRealmObject};
