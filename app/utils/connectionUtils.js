import {floDB, Patient, Address} from './data/schema';


const HandleConnectionChange = (connectionInfo) => {
    if (connectionInfo.type === 'none') {
        console.log('Device went offline');
    } else {
        // Todo: Move this data to redux ???
        // Todo: Also save formatted address returned by Google in such cases
        const unValidatedObjects = floDB.objects(Address.schema.name).filtered('isValidated = false');
        console.log('Number of unvalidated Objects:', unValidatedObjects.length);

        // Todo: Have hardcoded country filter as 'USA' currently
        if (unValidatedObjects && unValidatedObjects.length > 0) {
            unValidatedObjects.map((item) => {
                console.log('Trying to get lat-long for:', item.formattedAddressForGeocoding);
                fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${item.formattedAddressForGeocoding}&components=country:us&key=AIzaSyDiWZ3198smjFepUa0ZAoHePSnSxuhTzRU`)
                    .then((response) => response.json())
                    .then((responseJson) =>
                        parseResponse(responseJson, item))
                    .catch((error) =>
                        console.log('Error while fetching Geocoded address: ', error));
                return item;
            });
        }
    }
};

const parseResponse = (result, address) => {
    if (result.status === 'OK' &&
        result.results &&
        result.results.length > 0 &&
        result.results[0].geometry &&
        result.results[0].geometry.location
    ) {
        const loc = result.results[0].geometry.location;
        const latitude = loc.lat;
        const longitude = loc.lng;

        console.log('Fetched the lat long for address: ', address.streetAddress, ':', latitude, longitude);

        // Write to DB
        try {
            floDB.write(() => {
                address.latitude = latitude;
                address.longitude = longitude;
                address.isValidated = true;
            });
        } catch (err) {
            // Todo Don't fail silently
            console.log('Error while writing to DB: ', err);
        }
    } else if (result.status === 'ZERO_RESULTS') {
        try {
            console.log('ZERO_RESULTS found by Google Geocode API for address:', address.streetAddress);
            floDB.write(() => {
                address.latitude = null;
                address.longitude = null;
                address.isValidated = true;
            });
        } catch (err) {
            // Todo Don't fail silently
            console.log('Error while writing to DB:', err);
        }
    } else {
        console.log('Failed to parse Geocode Response from Google APIs');
        console.log(result.status);
        console.log(result.results[0].geometry.location);
    }
};

export {HandleConnectionChange};
