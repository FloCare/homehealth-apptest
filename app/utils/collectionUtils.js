function ArrayToMap(array, keyProperty) {
    return array.reduce((map, object) => map.set(object[keyProperty], object), new Map());
}

function filterResultObjectByListMembership(object, property, membershipList) {
    console.log(`filter key: ${property}`);
    membershipList.map(member => console.log(member));

    return object.filtered(membershipList
                    .map((membershipItem) =>
                                        // console.log("print somethign");
                                        // console.log(`comparing ${property}, ${membershipItem}`);
                                         `${property}=="${membershipItem}"`)
                    .join(' OR ')
        );
}
export {ArrayToMap, filterResultObjectByListMembership};
