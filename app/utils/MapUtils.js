import geoJsonBounds from "geojson-bounds";
import Polyline from "@mapbox/polyline/src/polyline";
import {Platform, Linking} from 'react-native';

const directionsResposeCache = {};
function getViewPortFromBounds(boundsCoordinates) {
    console.log(boundsCoordinates);
    const multipoint = {
        type: 'MultiPoint',
        coordinates: boundsCoordinates
    };

    const [west, south, east, north] = geoJsonBounds.extent(multipoint);
    const viewport = {};

    //TODO wut?
    viewport.longitude = (south + north) / 2;
    viewport.latitude = (east + west) / 2;
    viewport.longitudeDelta = (east - west) * 1.75;
    viewport.latitudeDelta = (north - south) * 1.75;

    return viewport;
}

function coordinatesToCSVString(coordinates) {
    return `${coordinates.latitude},${coordinates.longitude}`;
}

async function callDirectionsApiForPoints(coordinates) {
    try {
        if (coordinates.length < 2) { console.error('directins request between less than two points'); }
        let requestString = `https://maps.googleapis.com/maps/api/directions/json?origin=${coordinatesToCSVString(coordinates[0])}&destination=${coordinatesToCSVString(coordinates[coordinates.length - 1])}`;
        // let requestString = `https://maps.googleapis.com/maps/api/directions/json?units='imperial'&origin=${coordinatesToCSVString(coordinates[0])}&destination=${coordinatesToCSVString(coordinates[coordinates.length - 1])}`;
        if (coordinates.length > 2) {
            requestString += '&waypoints=';
            for (let i = 1; i < coordinates.length - 1; i++) {
                requestString = `${requestString}via:${coordinatesToCSVString(coordinates[i])}|`;
            }
        }
        console.log(requestString)
        const resp = await fetch(requestString);
        return await resp.json();
    } catch (error) {
        console.log('directions api call threw error');
        console.log(error);
        throw error;
    }
}

function extractInformationFromDirectionApiResponse(respJson) {
    const points = Polyline.decode(respJson.routes[0].overview_polyline.points);
    const geoData = {};
    geoData.polyline = points.map((point) => ({
        latitude: point[0],
        longitude: point[1]
    }));
    geoData.bounds = respJson.routes[0].bounds;
    //TODO when multiple legs are introduced, change this
    geoData.distance = respJson.routes[0].legs[0].distance.text;
    return geoData;
}

async function getProcessedGeoDataBetweenTwoPoints(startLoc, destinationLoc) {
    const cacheKey = `${startLoc.latitude},${startLoc.longitude}-${destinationLoc.latitude},${destinationLoc.longitude}`;
    try {
        let respJson;
        if(directionsResposeCache[cacheKey]) {
            respJson = directionsResposeCache[cacheKey];
        }
        else {
            respJson = await this.callDirectionsApiForPoints([startLoc, destinationLoc]);
            if(respJson.status === 'OK')
                directionsResposeCache[cacheKey] = respJson;
            else console.log(respJson.error_message);
        }
        return this.extractInformationFromDirectionApiResponse(respJson);
    } catch (error) {
        console.log('error log: getProcessedGeoDataBetweenTwoPoints');
        console.log(error)
        throw error;
    }
}

async function getProcessedDataForOrderedList(coordinates) {
    const cacheKey = coordinates.reduce((result, object)=>result+'|'+coordinatesToCSVString(object), '');
    try {
        let respJson;
        if(directionsResposeCache[cacheKey]) {
            respJson = directionsResposeCache[cacheKey];
        }
        else {
            respJson = await this.callDirectionsApiForPoints(coordinates);
            if(respJson.status === 'OK')
                directionsResposeCache[cacheKey] = respJson;
            else console.log("error message: "+respJson.error_message);
        }
        return this.extractInformationFromDirectionApiResponse(respJson);
    } catch (error) {
        console.log('error log: getProcessedGeoDataBetweenTwoPoints');
        throw error;
    }
}


const navigateTo = async (latitude, longitude, address) => {
    let scheme = null;
    let hasGoogleMaps = false;
    if (Platform.OS === 'android'){
        //Platform.select({ios: 'maps:0,0?daddr=', android: 'geo:0,0?q='});
        scheme = `geo:0,0?q=`;
    } else if (Platform.OS === 'ios'){
        await Linking.canOpenURL(`comgooglemaps://?daddr=${latitude},${longitude}`)
            .then(supported => {
                if (supported) {
                    hasGoogleMaps = true;
                    scheme = `comgooglemaps://?daddr=`;
                } else {
                    scheme = `maps:0,0?daddr=`;
                }
            }).catch(err => {
                console.log('Error in checking google maps scheme:', err);
                scheme = `maps:0,0?daddr=`;
            });
    } else {
        return;
    }
    const latLng = `${latitude},${longitude}`;
    const label = address;
    const url = Platform.select({
        ios: hasGoogleMaps ? `${scheme}${latLng}`: `${scheme}${label}@${address}`,
        android: `${scheme}${latLng}(${label})`
    });
    // console.log('Opening the URL:', url);
    Linking.openURL(url).catch(err => console.error('Error in opening Maps:', err));
};

export {getViewPortFromBounds, callDirectionsApiForPoints, extractInformationFromDirectionApiResponse, getProcessedDataForOrderedList, navigateTo};
